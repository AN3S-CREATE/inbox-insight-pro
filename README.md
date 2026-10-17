# Inbox Insight Pro

A local-first inbox and document analyzer. The React dashboard talks to an
Express API, which stores items in SQLite and sends analysis and assistant
requests only to a local Ollama instance. No hosted database, account, or cloud
AI service is used.

## Requirements

- Node.js 20, 22, or 24 and npm
- [Ollama](https://ollama.com/download) installed and running locally
- A local model pulled once before first use (the default is `llama3.1`; cloud-tagged models are rejected)

```sh
ollama pull llama3.1
```

Ollama stays on `http://localhost:11434`. The application binds its API to
`127.0.0.1` and uses the Vite development server as a local frontend.
The API rejects requests with non-loopback `Host` headers to reduce DNS
rebinding exposure.

## Install and run

```sh
npm install
```

Copy `.env.example` to `.env` if you want to change defaults, then start the
app and Ollama:

```sh
npm run dev
```

Open `http://localhost:5173`. The `dev` command starts the frontend and local
API together. The API is also available at `http://127.0.0.1:3001`.

For a local production build:

```sh
npm run build
npm start
```

Then open `http://127.0.0.1:3001`. Keep Ollama running while creating items or
asking the assistant questions; saved inbox items remain available in SQLite
even when Ollama is stopped.

## Configuration

| Variable | Default | Description |
| --- | --- | --- |
| `OLLAMA_MODEL` | `llama3.1` | Locally installed model used for analysis and assistant answers |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Local Ollama endpoint; remote hosts are rejected |
| `PORT` | `3001` | Local application API and production web server port |
| `DATABASE_PATH` | `./data/inbox.sqlite` | SQLite database file path |

The first model download requires internet access through Ollama. After setup,
runtime app traffic is local only. The app does not automatically download
models or send content outside the machine. Before each AI request, it verifies
that the configured model is already present in Ollama's local model list.

## Data and API

SQLite creates `data/inbox.sqlite` on first start and maintains indexes for
company, urgency, date, item type, and department. Back up that file to preserve
your local inbox.

- `GET /api/items` — list; supports `company`, `department`, `urgency`,
  `itemType`, `dateRange`, and `search` query parameters
- `GET /api/items/:id` — read one item
- `POST /api/items` — analyze with Ollama by default and persist the item;
  pass `"analyze": false` only when analysis is intentionally skipped
- `PUT /api/items/:id` — update an item; pass `"reanalyze": true` with content
  to refresh its AI fields
- `DELETE /api/items/:id` — delete an item
- `POST /api/analyze` — analyze content without saving it
- `POST /api/query` — answer a question using a bounded set of supplied local
  inbox records and explicit metadata when matching results were omitted
- `GET /api/health` — local API health check

Voice recordings are not uploaded or transcribed automatically. Enter or paste
the transcript into the item's content field, and the local model will analyze
that text.
