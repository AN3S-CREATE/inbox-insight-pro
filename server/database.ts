import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type { InboxItem } from './types.js';

const configuredPath = process.env.DATABASE_PATH ?? './data/inbox.sqlite';
const databasePath = resolve(process.cwd(), configuredPath);
mkdirSync(dirname(databasePath), { recursive: true });

export const database = new Database(databasePath);
database.pragma('journal_mode = WAL');
database.pragma('foreign_keys = ON');

database.exec(`
  CREATE TABLE IF NOT EXISTS inbox_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL DEFAULT '',
    item_type TEXT NOT NULL CHECK (item_type IN ('email', 'voice', 'written')),
    personal_note TEXT NOT NULL DEFAULT '',
    sender TEXT NOT NULL DEFAULT '',
    recipient TEXT NOT NULL DEFAULT '',
    department TEXT NOT NULL DEFAULT 'executive',
    urgency TEXT NOT NULL DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high')),
    date_time TEXT NOT NULL,
    summary TEXT NOT NULL DEFAULT '',
    recommendation TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT '',
    entities TEXT NOT NULL DEFAULT '[]',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_inbox_company_nocase ON inbox_items(company COLLATE NOCASE);
  CREATE INDEX IF NOT EXISTS idx_inbox_urgency ON inbox_items(urgency);
  CREATE INDEX IF NOT EXISTS idx_inbox_date_time ON inbox_items(date_time);
  CREATE INDEX IF NOT EXISTS idx_inbox_item_type ON inbox_items(item_type);
  CREATE INDEX IF NOT EXISTS idx_inbox_department ON inbox_items(department);
`);

interface ItemRow {
  id: string;
  title: string;
  company: string;
  item_type: InboxItem['itemType'];
  personal_note: string;
  sender: string;
  recipient: string;
  department: InboxItem['department'];
  urgency: InboxItem['urgency'];
  date_time: string;
  summary: string;
  recommendation: string;
  content: string;
  category: string;
  entities: string;
  created_at: string;
  updated_at: string;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entity): entity is string => typeof entity === 'string');
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

const itemTypeLabels: Record<InboxItem['itemType'], string> = {
  email: 'Email',
  voice: 'Voice Note',
  written: 'Written Note'
};

const urgencyLabels: Record<InboxItem['urgency'], string> = {
  low: '🟢 Low',
  medium: '🟡 Medium',
  high: '🔴 High'
};

export function mapItem(row: ItemRow): InboxItem {
  const entities: unknown = JSON.parse(row.entities);
  if (!isStringArray(entities)) {
    throw new Error(`Stored entities are invalid for inbox item ${row.id}.`);
  }
  return {
    id: row.id,
    title: row.title,
    company: row.company,
    companyLabel: row.company || 'Unknown Company',
    itemType: row.item_type,
    itemTypeLabel: itemTypeLabels[row.item_type],
    personalNote: row.personal_note,
    sender: row.sender,
    recipient: row.recipient,
    department: row.department,
    departmentLabel: departmentLabels[row.department],
    urgency: row.urgency,
    urgencyLabel: urgencyLabels[row.urgency],
    dateTime: row.date_time,
    summary: row.summary,
    recommendation: row.recommendation,
    content: row.content,
    category: row.category,
    entities,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function getItemById(id: string): InboxItem | undefined {
  const row = database.prepare('SELECT * FROM inbox_items WHERE id = ?').get(id) as ItemRow | undefined;
  return row ? mapItem(row) : undefined;
}
