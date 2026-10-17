export const itemTypes = ['email', 'voice', 'written'] as const;
export type ItemType = (typeof itemTypes)[number];

export const departments = [
  'finance',
  'marketing',
  'operations',
  'hr',
  'it',
  'sales',
  'legal',
  'executive'
] as const;
export type Department = (typeof departments)[number];

export const urgencies = ['low', 'medium', 'high'] as const;
export type Urgency = (typeof urgencies)[number];

export interface InboxItem {
  id: string;
  title: string;
  company: string;
  companyLabel: string;
  itemType: ItemType;
  itemTypeLabel: string;
  personalNote: string;
  sender: string;
  recipient: string;
  department: Department;
  departmentLabel: string;
  urgency: Urgency;
  urgencyLabel: string;
  dateTime: string;
  summary: string;
  recommendation: string;
  content: string;
  category: string;
  entities: string[];
  createdAt: string;
  updatedAt: string;
}

export type AssistantContextItem = Pick<
  InboxItem,
  | 'id'
  | 'title'
  | 'company'
  | 'companyLabel'
  | 'itemType'
  | 'itemTypeLabel'
  | 'personalNote'
  | 'sender'
  | 'recipient'
  | 'department'
  | 'departmentLabel'
  | 'urgency'
  | 'urgencyLabel'
  | 'dateTime'
  | 'summary'
  | 'recommendation'
  | 'content'
  | 'category'
>;

export interface AssistantContextMetadata {
  matchingCount: number;
  contextTotal: number;
  includedCount: number;
  omittedCount: number;
  matchesFound: boolean;
}

export interface ItemInput {
  title: string;
  company?: string;
  itemType: ItemType;
  personalNote?: string;
  sender?: string;
  recipient?: string;
  department?: Department;
  urgency?: Urgency;
  dateTime?: string;
  summary?: string;
  recommendation?: string;
  content: string;
  category?: string;
  entities?: string[];
}

export interface AnalysisInput {
  title?: string;
  content: string;
  sender?: string;
  recipient?: string;
  company?: string;
  itemType?: ItemType;
}

export interface AnalysisResult {
  company: string;
  department: Department;
  urgency: Urgency;
  summary: string;
  recommendation: string;
  category: string;
  entities: string[];
}
