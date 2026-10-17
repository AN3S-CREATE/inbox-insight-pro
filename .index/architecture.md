# Architecture

The application contains a Vite React + TypeScript frontend under
`apps/default/src` and an Express API under `server/`. The frontend calls local
REST endpoints through the Vite development proxy. The server validates input,
stores inbox records in SQLite using better-sqlite3, and sends AI requests only
to a loopback Ollama endpoint. Before generation, it checks that the configured
non-cloud model is already present in Ollama's local model list, preventing
implicit downloads or cloud-model use. The API also rejects non-loopback Host
headers, and assistant context is size-bounded before parsing and generation.

`server/database.ts` owns the indexed inbox schema and row mapping;
`server/ollama.ts` provides structured item analysis and assistant responses;
`server/index.ts` wires REST routes, validation, logging, and static production
hosting. Assistant queries carry bounded record fields and explicit match and
omission counts so responses can distinguish exact totals from partial context.
Runtime data lives under `data/` by default.
