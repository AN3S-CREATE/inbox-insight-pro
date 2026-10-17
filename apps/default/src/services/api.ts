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

export interface AssistantContextMetadata {
  matchingCount: number;
  contextTotal: number;
  includedCount: number;
  omittedCount: number;
  matchesFound: boolean;
}

const contextFieldLimits = {
  id: 100,
  title: 500,
  company: 300,
  companyLabel: 300,
  itemTypeLabel: 50,
  personalNote: 1_000,
  sender: 500,
  recipient: 500,
  departmentLabel: 100,
  urgencyLabel: 20,
  dateTime: 50,
  summary: 1_500,
  recommendation: 1_500,
  content: 1_500,
  category: 300
} as const;

function limitContextItem(item: InboxItem) {
  return {
    id: item.id.slice(0, contextFieldLimits.id),
    title: item.title.slice(0, contextFieldLimits.title),
    company: item.company.slice(0, contextFieldLimits.company),
    companyLabel: item.companyLabel.slice(0, contextFieldLimits.companyLabel),
    itemType: item.itemType,
    itemTypeLabel: item.itemTypeLabel.slice(0, contextFieldLimits.itemTypeLabel),
    personalNote: item.personalNote.slice(0, contextFieldLimits.personalNote),
    sender: item.sender.slice(0, contextFieldLimits.sender),
    recipient: item.recipient.slice(0, contextFieldLimits.recipient),
    department: item.department,
    departmentLabel: item.departmentLabel.slice(0, contextFieldLimits.departmentLabel),
    urgency: item.urgency,
    urgencyLabel: item.urgencyLabel.slice(0, contextFieldLimits.urgencyLabel),
    dateTime: item.dateTime.slice(0, contextFieldLimits.dateTime),
    summary: item.summary.slice(0, contextFieldLimits.summary),
    recommendation: item.recommendation.slice(0, contextFieldLimits.recommendation),
    content: item.content.slice(0, contextFieldLimits.content),
    category: item.category?.slice(0, contextFieldLimits.category) ?? ''
  };
}

export async function askInboxAssistant(
  query: string,
  items: InboxItem[],
  metadata: Omit<AssistantContextMetadata, 'includedCount' | 'omittedCount'>
): Promise<string> {
  const contextItems = items.slice(0, 20).map(limitContextItem);
  const context = {
    ...metadata,
    includedCount: contextItems.length,
    omittedCount: Math.max(0, metadata.contextTotal - contextItems.length)
  };
  const response = await request<{ response: string }>('/query', {
    method: 'POST',
    body: JSON.stringify({ query: query.slice(0, 2_000), items: contextItems, context })
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
