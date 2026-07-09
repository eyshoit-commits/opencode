# Plugin-ready implementation plan

## Ziel

`bkg-oc-plugin-bkg-dfma` wird zuerst als eigenständiges OpenCode-Plugin fertig gemacht und danach als wiederverwendbarer Kern für BitShit übernommen.

Das Plugin soll nicht nur Commands und Prompt-Dateien installieren. Es soll eine echte lokale Kontrollschicht liefern:

- Agent Identity
- Background Delegation
- Subagent Output Capture
- Agent Rat / Ensemble
- Rules Loader
- Short-Term Memory
- Worktree Memory Sync
- Dashboard / Visualiser
- Blocker Detection
- Approve / Reject / Revise Gate
- TTS / Vorlesen
- Fourth Voice API für ChatGPT / externen Reviewer

## Warum zuerst Plugin-ready?

BitShit braucht später dieselben Fähigkeiten:

- Admin-/Runtime-Entscheidungen sichtbar prüfen
- Subagenten sauber koordinieren
- Blocker nicht wegreden
- Entscheidungen voten
- Reports und Memory persistieren
- UI/Dashboard für menschliche Freigabe
- externe Stimme über API zuschalten

Wenn wir das im Plugin sauber bauen, kann BitShit später darauf aufsetzen statt denselben Kram nochmal zu bauen. Software-Wiederverwendung, dieses sagenumwobene Konzept, das Menschen ständig erwähnen und dann ignorieren.

## Aktuelle Hauptcommands

Die sichtbaren Workflow-Commands sind sprechend und beginnen alle mit `bkg-`:

- `/bkg-project-check`
- `/bkg-memory`
- `/bkg-git`
- `/bkg-tasks`
- `/bkg-rules`
- `/bkg-debate`

Die genaue Command-Referenz steht in `docs/commands.md`.

## Quellen und was wir daraus ziehen

| Quelle | Pattern, das wir übernehmen | Kein blindes Vendoring |
|---|---|---|
| `kdcokenny/opencode-background-agents` | persistente Delegation, Background-Task-Artefakte | keine 1:1-Kopie |
| `zenobi-us/opencode-plugin-template` | Package-/Plugin-Struktur | nur Layout-Idee |
| `frap129/opencode-rules` | Rules Loader / Rule Discovery | refactored BKG Rules Loader |
| `supermemoryai/opencode-supermemory` | Recall-/Memory-Anbindung | lokale + optionale externe Memory API |
| `andrejtonev/opencode-short-term-memory` | sessionnahes Kurzzeitgedächtnis | BKG Short-Term Store |
| `Edison-A-N/opencode-worktree-memory-sync` | Worktree/Memory Sync | Git-/Worktree-aware Memory Sync |
| `gotgenes/opencode-agent-identity` | Agent Identity / Role Metadata | BKG Identity Registry |
| `hueyexe/opencode-ensemble` | Ensemble-/Rat-Pattern | Agent Rat Orchestration |
| `raisbecka/opencode-subagent-output` | Subagent Output Capture | Debate/Report Capture |
| `spoons-and-mirrors/subtask2` | Subtask-Decomposition | task/delegation flow |
| `StefanoChiodino/opencode-tts` | Vorlesen/TTS | TTS adapter, optional local/server backend |
| `psinetron/opencode-visualiser` | Dashboard/Visualisierung | BKG dashboard |
| `joostvanwollingen/opencode-personality` | Agent tone/personality | per-agent personality profiles |
| `kdcokenny/ocx` | OpenCode UX/CLI extension ideas | optional CLI/API patterns |
| `vtemian/octto` | task/orchestration ideas | optional workflow ideas |

## Zielarchitektur

Core layout:

- `src/index.ts`
- `src/background-agents.ts`
- `src/rules-loader.ts`
- `src/identity.ts`
- `src/memory/`
- `src/ensemble/`
- `src/subagents/`
- `src/dashboard/`
- `src/bitshit/`
- `assets/opencode/commands/`
- `assets/opencode/agents/`
- `assets/opencode/skills/`
- `assets/opencode/rules/`
- `docs/`

## Runtime Flow

### Normal work

1. `/bkg-project-check` inspects repository, docs, state and starting context.
2. `/bkg-tasks` creates or selects a concrete task.
3. Agent works only inside the claimed scope.
4. Subagent output capture stores evidence.
5. `/bkg-rules` validates the done claim.
6. `/bkg-memory` stores the result, decision and remaining risks.
7. `/bkg-git` is used for explicit status, commit and push actions.

### Blocker flow

1. A blocker is detected by tool, agent, test failure, or explicit user message.
2. Dashboard opens or updates.
3. `/bkg-debate` starts a team debate, Agent Rat session or vote.
4. Required agents speak with visible positions.
5. Vote begins.
6. User approves, rejects or requests revision in dashboard/API.
7. Decision is persisted.
8. Memory is synced.

### Human approval flow

Dashboard exposes:

- current blocker
- agent positions
- vote table
- evidence links
- Approve button
- Reject button
- Request revision button
- Read aloud button
- API endpoint for fourth reviewer voice

Annotation and line-edit support are planned, not current release behavior.

## Dashboard endpoints

Current endpoints:

- `GET /api/state`
- `GET /api/summary`
- `GET /api/live-output?after=<sequence>`
- `POST /api/blocker`
- `POST /api/rat/start`
- `POST /api/vote`
- `POST /api/user/approve`
- `POST /api/user/reject`
- `POST /api/user/revise`
- `GET /api/vote/tally?ratSessionId=...`
- `POST /api/tts/read`
- `POST /api/fourth-voice/request`

## BitShit Adapter

BitShit should later call the plugin layer through a small adapter with these capabilities:

- report blocker
- start Rat session
- record vote
- request approval
- remember result/context

The compatibility stub must stay deterministic and marked with `isStub: true`.

The runtime adapter must delegate to real local stores.

## Acceptance Criteria

Plugin-ready means:

- `npm run typecheck` passes.
- `npm test` passes.
- `npm run ci` passes.
- Plugin exposes tools for delegation, memory, rat, vote, blocker and dashboard.
- Assets install with `npm run install:assets`.
- Dashboard can show blocker and vote state.
- User can approve/reject/revise through API or UI.
- TTS endpoint can read current blocker/rat summary.
- Subagent output is captured into durable artifacts.
- Memory can sync per worktree.
- BitShit adapter exports stable interfaces.
- Runtime state defaults to `bkg-oc-plugin-bkg-dfma` path.
- Commands visible under `/` use the explicit `bkg-*` command names from `docs/commands.md`.

## Build strategy

Do not build everything at once.

Use lanes:

1. Core API + types
2. Rules + identity
3. Memory + sync
4. Ensemble/Rat + votes
5. Dashboard + TTS + approval
6. Assets + docs + tests

Each lane must ship a concrete commit with files and acceptance notes.

## Next real feature

After the current productive baseline is verified, the next real feature is review-gate annotation support:

- annotation API
- line-range comments
- revise feedback payloads
- dashboard UI for annotations
- tests proving annotation persistence
