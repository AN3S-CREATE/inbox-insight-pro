export interface InboxItem {
  id: string;
  title: string;
  company: string;
  companyLabel: string;
  itemType: 'email' | 'voice' | 'written';
  itemTypeLabel: string;
  personalNote: string;
  sender: string;
  recipient: string;
  department: string;
  departmentLabel: string;
  urgency: 'low' | 'medium' | 'high';
  urgencyLabel: string;
  dateTime: string;
  summary: string;
  recommendation: string;
  content: string;
}

export interface FilterState {
  company: string;
  department: string;
  urgency: string;
  itemType: string;
  dateRange: string;
  search: string;
}