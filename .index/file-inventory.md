# File inventory

| Path | Purpose | Key symbols / content | Status |
| --- | --- | --- | --- |
| `apps/default/index.html` | Vite HTML entry | App title and React mount | Active |
| `apps/default/src/App.tsx` | Local app shell | `InboxDashboard` | Active |
| `apps/default/src/main.tsx` | React/Vite entry point | `createRoot`, app CSS import | Active |
| `apps/default/src/components/AIAssistant.tsx` | Local inbox assistant UI | Typed search results; separate display and bounded assistant context | Active |
| `apps/default/src/components/AIPersonalizationModal.tsx` | Local assistant preferences | Local avatar choices | Active |
| `apps/default/src/components/AddItemModal.tsx` | Inbox item entry and analysis UI | Item creation flow | Active |
| `apps/default/src/components/InboxDashboard.tsx` | SQLite-backed dashboard state and filters | Local item loading, filter and modal wiring | Active |
| `apps/default/src/components/InboxGrid.tsx` | Inbox item display | Retains existing results while refreshes load | Active |
| `apps/default/src/components/InboxHeader.tsx` | Dashboard header | Local-only navigation | Active |
| `apps/default/src/components/TestRunner.tsx`, `TestResults.tsx` | Exported demo test UI, not mounted by the app | Standalone test display components | Deprecated |
| `apps/default/src/index.css` | App styles | Tailwind directives and local system fonts | Active |
| `apps/default/src/services/api.ts` | Local REST client and filter query builder | `fetchInboxItems`, `createInboxItem`, size-bounded assistant context with optional-field guards | Active |
| `apps/default/src/services/deduplication.ts` | Duplicate matching and merge behavior | `DeduplicationService` | Active |
| `apps/default/src/types/inbox.ts` | Shared inbox and filter types | `InboxItem`, `FilterState`, `InboxAnalysis` | Active |
| `server/index.ts` | Local REST API and production static hosting | Host validation, CRUD, optimistic reanalysis, bounded query validation | Active |
| `server/database.ts` | SQLite schema, indexes, and row mapping | `database`, `mapItem`, `getItemById` | Active |
| `server/ollama.ts` | Local structured analysis and assistant generation | `analyzeContent`, coverage-aware `answerQuery`, local-model checks | Active |
| `server/types.ts` | Backend domain and validation types | `InboxItem`, `AssistantContextItem`, context metadata | Active |
| `package.json` | Root scripts, supported Node versions, and dependencies | `dev`, `build`, `start`, `better-sqlite3` | Active |
| `tsconfig.json`, `vite.config.ts` | TypeScript and Vite build/dev setup | Strict typecheck, API proxy derived from `PORT` | Active |
| `postcss.config.js`, `tailwind.config.js` | CSS build configuration | Tailwind and Autoprefixer | Active |
| `.env.example`, `.gitignore` | Local runtime configuration and generated-file exclusions | Ollama, port, SQLite path | Active |
| `README.md` | Local setup and API guide | Ollama install/pull, run scripts, configuration | Active |
| `.index/` | Verified project context and maintenance notes | Architecture, inventory, decisions, refresh log | Active |
| `REPO_ANALYSIS_MEMORY.md` | Cross-session repository analysis state | Current phase, findings, next steps | Active |
