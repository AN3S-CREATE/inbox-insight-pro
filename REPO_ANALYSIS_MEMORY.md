# Repository Analysis State — inbox-insight-pro

## Current Analysis Phase & Progress
Phase 4: PR review follow-up verified. The initial local app is merged to
`main`; all 11 review findings have code changes on `fix-review-feedback`.
Typecheck, production build, and mock-Ollama API checks now pass. Next is
commit/push, create and merge the follow-up PR, resolve the original threads,
and remove the merged feature branches.

## Key Architectural Insights Discovered
- `apps/default/src/types/inbox.ts` defines the inbox item fields and UI labels.
- `server/database.ts` persists inbox records and analysis metadata in SQLite.
- `server/ollama.ts` implements company, department, urgency, category, entity,
  summary, and recommendation analysis, plus local assistant responses. It
  rejects cloud-tagged models and verifies the selected model is already
  installed before generation, avoiding implicit downloads.
- The exported workflows were used to recover behavior requirements and then
  removed from the runtime repository.
- `server/index.ts` provides local REST endpoints and serves the built UI.
- Assistant requests include at most 20 bounded records and explicit matching,
  included, and omitted counts; the largest bounded control-character payload
  measured 1,004,327 bytes, below Express's 1 MiB JSON limit.

## Files Deeply Reviewed
- `apps/default/src/types/inbox.ts` (`InboxItem`, `FilterState`.)
- `apps/default/src/services/api.ts` (Local REST client for database operations,
  item creation, analysis, and assistant queries.)
- `server/database.ts` (SQLite schema, filter indexes, and typed row mapping.)
- `server/ollama.ts` (JSON schema analysis and local assistant generation.)
- `server/index.ts` (CRUD, search/filter, validation, and local server setup.)
- `apps/default/src/components/AIAssistant.tsx` (Assistant search result coverage
  and separation of displayed versus sent records.)
- `apps/default/src/components/InboxGrid.tsx` and `apps/default/src/index.css`
  (Refresh rendering and active modal styles.)
- `vite.config.ts` (Root environment loading and configurable API proxy.)

## Open Questions & Areas Needing Investigation
- No implementation questions remain. Follow-up PR creation, merge, review
  thread resolution, and merged-branch cleanup are pending.

## Decisions Made & Rationale
- Decision: Build a local Express, better-sqlite3, and Ollama application.
  Rationale: Explicit user requirements.
- Decision: Remove unmounted cloud setup components and imported workflow exports.
  Rationale: Eliminate unavailable integrations and external runtime paths.
- Decision: Require an installed local Ollama model before generating.
  Rationale: Prevent cloud model use and keep missing-model handling from
  triggering downloads during offline runtime.
- Decision: Use better-sqlite3 12.5 with Node 20, 22, and 24 support.
  Rationale: The previous release had no Node 24 Windows prebuilt in this
  environment; version 12.5 installs and runs without a C++ toolchain.

## Next Immediate Steps
1. Commit and push `fix-review-feedback`, then create a follow-up PR to `main`.
2. Merge the follow-up PR and reply to/resolve all 11 threads on merged PR #1.
3. Delete merged local/remote feature branches while preserving `main`.

## Patterns & Recurring Issues Noticed
- AI requests and local database access are isolated in the backend; frontend
  queries use REST and preserve the existing item card/filter UX.

## Session Log
- [2026-10-16] Initialized index and memory; completed backend and frontend
  conversion and began build/API validation.
- [2026-10-16] Added Ollama local model preflight and cloud-model rejection;
  dependency installation and validation are still running.
- [2026-10-16] Typecheck and production build passed; exercised SQLite CRUD,
  search/filters, validation, production static hosting, and expected missing
  local-model error handling through the running API.
- [2026-10-17] Found 11 unresolved review threads on merged PR #1; created
  `fix-review-feedback` from current `origin/main` to address each one.
- [2026-10-17] Typecheck and production build passed in an isolated clean
  dependency copy. Mock-Ollama API verification passed for host validation,
  CRUD/filtering, company redetection, concurrent edits, assistant metadata and
  maximum bounded body size, and Vite's custom `PORT` proxy.
