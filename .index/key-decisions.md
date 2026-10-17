# Key decisions

| Date | Decision | Rationale |
| --- | --- | --- |
| 2026-10-16 | Use local Express, better-sqlite3, and Ollama only | Explicit standalone app requirements |
| 2026-10-16 | Require an already-installed, non-cloud Ollama model before generation | Preserve offline runtime and prevent cloud-tagged model use or implicit pulls |
| 2026-10-16 | Use better-sqlite3 12.5 with Node 20, 22, and 24 support | The prior release lacked a Node 24 Windows prebuilt; the supported release installs and runs without a local C++ toolchain |
