# Dead code and technical debt

The exported cloud-integration setup components and workflow JSON files were
removed because the standalone app has no hosted integration routes.

| Path / symbol | Evidence | Risk / recommended action |
| --- | --- | --- |
| `apps/default/src/components/TestRunner.tsx`, `TestResults.tsx` | No imports found in `apps/default/src`; the views describe webhook/integration tests not wired to local routes | Low; remove or replace if a real local test dashboard is added |
| `apps/default/src/components/AIDetectionShowcase.tsx`, `ExecutiveOnboarding.tsx` | No imports found in `apps/default/src`; the active app entry is `App.tsx` -> `InboxDashboard` | Low; remove if no future onboarding/showcase route is planned |
| `apps/default/src/components/AIAssistant.tsx` `generateResponse` | No call site found; assistant messages are supplied by `askInboxAssistant` | Low; remove the obsolete heuristic response formatter |
| `apps/default/src/assets/react.svg` | No import found after replacing the starter screen | Low; remove as unused Vite starter artwork |
