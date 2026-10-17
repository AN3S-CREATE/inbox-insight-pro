import 'dotenv/config';
import express, { type ErrorRequestHandler, type Request, type Response } from 'express';
import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { z } from 'zod';
import { database, getItemById, mapItem } from './database.js';
import { analyzeContent, answerQuery, OllamaError } from './ollama.js';
import { departments, itemTypes, urgencies, type InboxItem, type ItemInput } from './types.js';

const app = express();
const port = Number(process.env.PORT ?? 3001);
app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));

app.use((req, res, next) => {
  const startedAt = Date.now();
  res.on('finish', () => {
    console.info(`${req.method} ${req.path} ${res.statusCode} ${Date.now() - startedAt}ms`);
  });
  next();
});

const optionalText = (max = 20_000) => z.string().trim().max(max).optional();
const itemInputSchema = z.object({
  title: z.string().trim().min(1).max(500),
  company: optionalText(300),
  itemType: z.enum(itemTypes),
  personalNote: optionalText(),
  sender: optionalText(500),
  recipient: optionalText(500),
  department: z.enum(departments).optional(),
  urgency: z.enum(urgencies).optional(),
  dateTime: z.string().datetime().optional(),
  summary: optionalText(),
  recommendation: optionalText(),
  content: z.string().trim().min(1).max(100_000),
  category: optionalText(300),
  entities: z.array(z.string().trim().max(300)).max(100).optional(),
  analyze: z.boolean().optional()
});
const updateSchema = itemInputSchema.partial().extend({
  reanalyze: z.boolean().optional()
});
const analysisInputSchema = z.object({
  title: optionalText(500),
  content: z.string().trim().min(1).max(100_000),
  sender: optionalText(500),
  recipient: optionalText(500),
  company: optionalText(300),
  itemType: z.enum(itemTypes).optional()
});

function badRequest(res: Response, error: z.ZodError): void {
  res.status(400).json({ error: 'Invalid request', details: error.flatten() });
}

function getDateStart(dateRange: string | undefined): string | undefined {
  if (!dateRange) return undefined;
  const now = new Date();
  if (dateRange === 'today') {
    now.setHours(0, 0, 0, 0);
    return now.toISOString();
  }
  if (dateRange === 'week') {
    now.setDate(now.getDate() - 7);
    return now.toISOString();
  }
  if (dateRange === 'month') {
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  }
  if (dateRange === 'last_month') {
    const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return firstDay.toISOString();
  }
  return undefined;
}

function getDateEnd(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

app.get('/api/health', (_req, res) => res.json({ status: 'ok', storage: 'sqlite', ai: 'ollama' }));

app.get('/api/items', (req, res) => {
  const query = z.object({
    company: z.string().optional(),
    department: z.enum(departments).optional(),
    urgency: z.enum(urgencies).optional(),
    itemType: z.enum(itemTypes).optional(),
    dateRange: z.enum(['today', 'week', 'month', 'last_month']).optional(),
    search: z.string().max(500).optional()
  }).safeParse(req.query);
  if (!query.success) return badRequest(res, query.error);

  const clauses: string[] = [];
  const values: string[] = [];
  if (query.data.company) {
    clauses.push('company = ? COLLATE NOCASE');
    values.push(query.data.company);
  }
  if (query.data.department) {
    clauses.push('department = ?');
    values.push(query.data.department);
  }
  if (query.data.urgency) {
    clauses.push('urgency = ?');
    values.push(query.data.urgency);
  }
  if (query.data.itemType) {
    clauses.push('item_type = ?');
    values.push(query.data.itemType);
  }
  if (query.data.dateRange) {
    const startDate = getDateStart(query.data.dateRange);
    if (startDate) {
      clauses.push('date_time >= ?');
      values.push(startDate);
      if (query.data.dateRange === 'last_month') {
        const endDate = getDateEnd();
        clauses.push('date_time < ?');
        values.push(endDate);
      }
    }
  }
  if (query.data.search?.trim()) {
    const search = `%${query.data.search.trim()}%`;
    clauses.push('(title LIKE ? COLLATE NOCASE OR content LIKE ? COLLATE NOCASE OR summary LIKE ? COLLATE NOCASE OR recommendation LIKE ? COLLATE NOCASE OR company LIKE ? COLLATE NOCASE OR sender LIKE ? COLLATE NOCASE OR recipient LIKE ? COLLATE NOCASE OR personal_note LIKE ? COLLATE NOCASE)');
    values.push(search, search, search, search, search, search, search, search);
  }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const rows = database.prepare(`SELECT * FROM inbox_items ${where} ORDER BY date_time DESC, created_at DESC`)
    .all(...values) as Parameters<typeof mapItem>[0][];
  res.json({ items: rows.map(mapItem) });
});

app.get('/api/items/:id', (req, res) => {
  const item = getItemById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  return res.json({ item });
});

const insertItem = database.prepare(`
  INSERT INTO inbox_items (
    id, title, company, item_type, personal_note, sender, recipient, department,
    urgency, date_time, summary, recommendation, content, category, entities,
    created_at, updated_at
  ) VALUES (
    @id, @title, @company, @itemType, @personalNote, @sender, @recipient, @department,
    @urgency, @dateTime, @summary, @recommendation, @content, @category, @entities,
    @createdAt, @updatedAt
  )
`);

function writeItem(input: ItemInput, existing?: InboxItem): InboxItem {
  const now = new Date().toISOString();
  const item = {
    id: existing?.id ?? randomUUID(),
    title: input.title ?? existing?.title ?? '',
    company: input.company ?? existing?.company ?? '',
    itemType: input.itemType ?? existing?.itemType ?? 'email',
    personalNote: input.personalNote ?? existing?.personalNote ?? '',
    sender: input.sender ?? existing?.sender ?? '',
    recipient: input.recipient ?? existing?.recipient ?? '',
    department: input.department ?? existing?.department ?? 'executive',
    urgency: input.urgency ?? existing?.urgency ?? 'medium',
    dateTime: input.dateTime ?? existing?.dateTime ?? now,
    summary: input.summary ?? existing?.summary ?? '',
    recommendation: input.recommendation ?? existing?.recommendation ?? '',
    content: input.content ?? existing?.content ?? '',
    category: input.category ?? existing?.category ?? '',
    entities: JSON.stringify(input.entities ?? existing?.entities ?? []),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now
  };
  if (existing) {
    database.prepare(`
      UPDATE inbox_items SET title=@title, company=@company, item_type=@itemType,
        personal_note=@personalNote, sender=@sender, recipient=@recipient,
        department=@department, urgency=@urgency, date_time=@dateTime,
        summary=@summary, recommendation=@recommendation, content=@content,
        category=@category, entities=@entities, updated_at=@updatedAt WHERE id=@id
    `).run(item);
  } else {
    insertItem.run(item);
  }
  const savedItem = getItemById(item.id);
  if (!savedItem) throw new Error(`Could not retrieve saved inbox item ${item.id}.`);
  return savedItem;
}

app.post('/api/items', async (req, res, next) => {
  const parsed = itemInputSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error);
  try {
    const input = parsed.data;
    const analysis = input.analyze === false
      ? undefined
      : await analyzeContent({
          title: input.title,
          content: input.content,
          sender: input.sender,
          recipient: input.recipient,
          company: input.company,
          itemType: input.itemType
        });
    const item = writeItem({
      ...input,
      company: analysis?.company ?? input.company,
      department: input.department ?? analysis?.department,
      urgency: input.urgency ?? analysis?.urgency,
      summary: input.summary ?? analysis?.summary,
      recommendation: input.recommendation ?? analysis?.recommendation,
      category: input.category ?? analysis?.category,
      entities: input.entities ?? analysis?.entities
    });
    return res.status(201).json({ item, isDuplicate: false, message: 'Item created and saved locally.' });
  } catch (error) {
    return next(error);
  }
});

app.put('/api/items/:id', async (req, res, next) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error);
  if (parsed.data.reanalyze && !parsed.data.content) {
    return res.status(400).json({ error: 'Content is required when reanalyze is true.' });
  }
  const existing = getItemById(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Item not found' });
  try {
    const input = parsed.data;
    const analysis = input.reanalyze && input.content
      ? await analyzeContent({
          title: input.title ?? existing.title,
          content: input.content,
          sender: input.sender ?? existing.sender,
          recipient: input.recipient ?? existing.recipient,
          company: input.company ?? existing.company,
          itemType: input.itemType ?? existing.itemType
        })
      : undefined;
    const { reanalyze: _reanalyze, ...fields } = input;
    const item = writeItem({
      ...existing,
      ...fields,
      company: fields.company ?? analysis?.company,
      department: fields.department ?? analysis?.department,
      urgency: fields.urgency ?? analysis?.urgency,
      summary: fields.summary ?? analysis?.summary,
      recommendation: fields.recommendation ?? analysis?.recommendation,
      category: fields.category ?? analysis?.category,
      entities: fields.entities ?? analysis?.entities
    }, existing);
    return res.json({ item });
  } catch (error) {
    return next(error);
  }
});

app.delete('/api/items/:id', (req, res) => {
  const result = database.prepare('DELETE FROM inbox_items WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Item not found' });
  return res.status(204).end();
});

app.post('/api/analyze', async (req, res, next) => {
  const parsed = analysisInputSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error);
  try {
    return res.json({ analysis: await analyzeContent(parsed.data) });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/query', async (req, res, next) => {
  const parsed = z.object({
    query: z.string().trim().min(1).max(2_000),
    items: z.array(z.object({
      id: z.string(),
      title: z.string(),
      companyLabel: z.string(),
      departmentLabel: z.string(),
      urgency: z.enum(urgencies),
      dateTime: z.string(),
      summary: z.string(),
      recommendation: z.string(),
      content: z.string()
    })).max(50)
  }).safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error);
  try {
    const contextItems = parsed.data.items as InboxItem[];
    return res.json({ response: await answerQuery(parsed.data.query, contextItems) });
  } catch (error) {
    return next(error);
  }
});

app.use('/api', (_req, res) => res.status(404).json({ error: 'API endpoint not found' }));

const clientBuildPath = resolve(process.cwd(), 'dist');
if (existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get(/^\/(?!api\/).*/, (_req, res) => res.sendFile(resolve(clientBuildPath, 'index.html')));
}

const errorHandler: ErrorRequestHandler = (error, _req: Request, res: Response, _next) => {
  console.error('Request failed:', error);
  if (res.headersSent) return;
  const message = error instanceof Error ? error.message : 'Unexpected server error';
  const statusCode = error instanceof OllamaError
    ? 503
    : typeof error === 'object' && error !== null && 'status' in error && typeof error.status === 'number'
      ? error.status
      : 500;
  res.status(statusCode)
    .json({ error: message });
};
app.use(errorHandler);

const server = app.listen(port, '127.0.0.1', () => {
  console.info(`Local inbox API listening on http://127.0.0.1:${port}`);
});

function closeServer(): void {
  server.close(() => {
    database.close();
    process.exit(0);
  });
}
process.on('SIGINT', closeServer);
process.on('SIGTERM', closeServer);
