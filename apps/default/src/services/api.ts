import type { FilterState, InboxAnalysis, InboxItem } from '../types/inbox';
import { DeduplicationService } from './deduplication';

const API_BASE = '/api';

export interface CreateItemInput {
  title: string;
  company?: string;
  itemType: InboxItem['itemType'];
  personalNote?: string;
  sender?: string;
  recipient?: string;
  content: string;
}

const departmentLabels: Record<InboxItem['department'], string> = {
  finance: 'Finance',
  marketing: 'Marketing',
  operations: 'Operations',
  hr: 'Human Resources',
  it: 'IT',
  sales: 'Sales',
  legal: 'Legal',
  executive: 'Executive'
};

interface ItemsResponse {
  items: InboxItem[];
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers
    }
  });
  if (!response.ok) {
    let message = `Local API request failed (${response.status})`;
    try {
      const body = await response.json() as { error?: string };
      message = body.error ?? message;
    } catch {
      // Keep the HTTP status message if the response is not JSON.
    }
    throw new Error(message);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function toQuery(filters: Partial<FilterState> = {}): string {
  const params = new URLSearchParams();
  for (const key of ['company', 'department', 'urgency', 'itemType', 'dateRange', 'search'] as const) {
    const value = filters[key];
    if (value) params.set(key, value);
  }
  const query = params.toString();
  return query ? `?${query}` : '';
}

export async function fetchInboxItems(
  filters: Partial<FilterState> = {},
  signal?: AbortSignal
): Promise<InboxItem[]> {
  const response = await request<ItemsResponse>(`/items${toQuery(filters)}`, { signal });
  return response.items;
}

export async function createInboxItem(
  itemData: CreateItemInput
): Promise<{ success: boolean; message: string; isDuplicate: boolean; item: InboxItem }> {
  const [existingItems, analysis] = await Promise.all([
    fetchInboxItems(),
    analyzeInboxContent(itemData)
  ]);
  const company = analysis.company || 'Unknown Company';
  const now = new Date().toISOString();
  const candidate: InboxItem = {
    id: 'pending',
    title: itemData.title,
    company,
    companyLabel: company,
    itemType: itemData.itemType,
    itemTypeLabel: itemData.itemType === 'voice' ? 'Voice Note' : itemData.itemType === 'written' ? 'Written Note' : 'Email',
    personalNote: itemData.personalNote ?? '',
    sender: itemData.sender ?? '',
    recipient: itemData.recipient ?? '',
    department: analysis.department,
    departmentLabel: departmentLabels[analysis.department],
    urgency: analysis.urgency,
    urgencyLabel: analysis.urgency === 'high' ? '🔴 High' : analysis.urgency === 'medium' ? '🟡 Medium' : '🟢 Low',
    dateTime: now,
    summary: analysis.summary,
    recommendation: analysis.recommendation,
    content: itemData.content,
    category: analysis.category,
    entities: analysis.entities
  };
  const matches = DeduplicationService.findDuplicates(candidate, existingItems);
  if (matches.length > 0) {
    const match = matches[0];
    const mergedItem = DeduplicationService.mergeItems(candidate, match.existingItem);
    const savedItem = await updateInboxItem(mergedItem.id, {
      ...mergedItem,
      category: analysis.category,
      entities: analysis.entities
    });
    const report = DeduplicationService.generateDeduplicationReport(matches);
    return {
      success: true,
      message: `Item merged with existing entry (${Math.round(match.similarity * 100)}% similarity). ${report}`,
      isDuplicate: true,
      item: savedItem
    };
  }

  const response = await request<{ item: InboxItem; message: string }>('/items', {
    method: 'POST',
    body: JSON.stringify({ ...itemData, ...analysis, analyze: false })
  });
  return { ...response, success: true, isDuplicate: false };
}

export async function updateInboxItem(id: string, updates: Partial<InboxItem>): Promise<InboxItem> {
  const response = await request<{ item: InboxItem }>(`/items/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
  return response.item;
}

export async function deleteInboxItem(id: string): Promise<void> {
  await request<void>(`/items/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function analyzeInboxContent(input: {
  title?: string;
  content: string;
  sender?: string;
  recipient?: string;
  company?: string;
  itemType?: InboxItem['itemType'];
}): Promise<InboxAnalysis> {
  const response = await request<{ analysis: InboxAnalysis }>('/analyze', {
    method: 'POST',
    body: JSON.stringify(input)
  });
  return response.analysis;
}

export async function askInboxAssistant(
  query: string,
  items: InboxItem[]
): Promise<string> {
  const response = await request<{ response: string }>('/query', {
    method: 'POST',
    body: JSON.stringify({ query, items: items.slice(0, 50) })
  });
  return response.response;
}

export async function searchInboxItems(
  query: string,
  filters: Partial<FilterState> = {}
): Promise<InboxItem[]> {
  return fetchInboxItems({ ...filters, search: query || filters.search || '' });
}

export async function getDetectedCompanies(): Promise<Array<{ value: string; label: string }>> {
  const items = await fetchInboxItems();
  const unique = new Map(items.filter((item) => item.company).map((item) => [
    item.company,
    { value: item.company, label: item.companyLabel }
  ]));
  return [...unique.values()];
}
