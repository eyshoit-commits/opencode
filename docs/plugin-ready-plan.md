# Plugin-ready implementation plan

## Ziel

`bkg-oc-plugin-bkg-dfma` wird zuerst als eigenständiges OpenCode-Plugin fertig gemacht und danach als wiederverwendbarer Kern für BitShit übernommen.

Das Plugin soll nicht nur Commands und Prompt-Dateien installieren. Es soll eine echte Kontrollschicht liefern:

- Agent Identity
- Background Delegation
- Subagent Output Capture
- Agent Rat / Ensemble
- Rules Loader
- Short-Term Memory
- Worktree Memory Sync
- Dashboard / Visualiser
- Blocker Detection
- Approve / Reject Gate
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
| `spoons-and-mirrors/subtask2` | Subtask-Decomposition | 3some/Delegation Tasks |
| `StefanoChiodino/opencode-tts` | Vorlesen/TTS | TTS adapter, optional local/server backend |
| `psinetron/opencode-visualiser` | Dashboard/Visualisierung | BKG dashboard |
| `joostvanwollingen/opencode-personality` | Agent tone/personality | per-agent personality profiles |
| `kdcokenny/ocx` | OpenCode UX/CLI extension ideas | optional CLI/API patterns |
| `vtemian/octto` | task/orchestration ideas | optional workflow ideas |

## Zielarchitektur

```text
src/
  index.ts
  background-agents.ts
  rules-loader.ts
  identity.ts
  memory/
    short-term.ts
    worktree-sync.ts
    recall.ts
  ensemble/
    rat.ts
    votes.ts
    blockers.ts
  subagents/
    output-capture.ts
    delegation.ts
  dashboard/
    server.ts
    state.ts
    tts.ts
    api.ts
  bitshit/
    adapter.ts
assets/opencode/
  commands/
  agents/
  skills/
  rules/
docs/
  plugin-ready-plan.md
  tasks.md
```

## Runtime Flow

### Normal work

1. `3some add` creates task.
2. Agent works.
3. Output capture stores evidence.
4. `1brain remember` stores result.
5. `4ever check` validates done claim.

### Blocker flow

1. A blocker is detected by tool, agent, test failure, or explicit user message.
2. Dashboard opens / updates.
3. Agent Rat starts automatically.
4. Required agents speak:
   - Architect
   - Builder
   - Reviewer
   - Product
   - Contrarian
5. Vote begins.
6. User approves or rejects in dashboard.
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

## Dashboard endpoints

```text
GET  /api/state
POST /api/blocker
POST /api/rat/start
POST /api/vote
POST /api/user/approve
POST /api/user/reject
POST /api/tts/read
POST /api/fourth-voice/request
```

## BitShit Adapter

BitShit should later call the plugin layer through a small adapter:

```ts
export interface BitshitControlAdapter {
  reportBlocker(input: BlockerInput): Promise<BlockerRecord>
  startRat(input: RatInput): Promise<RatSession>
  recordVote(input: VoteInput): Promise<VoteRecord>
  requestApproval(input: ApprovalInput): Promise<ApprovalDecision>
  remember(input: MemoryInput): Promise<void>
}
```

## Acceptance Criteria

Plugin-ready means:

- `npm run typecheck` passes.
- Plugin exposes tools for delegation, memory, rat, vote, blocker, dashboard.
- Assets install with `npm run install:assets`.
- Dashboard can show blocker and vote state.
- User can approve/reject through API or UI.
- TTS endpoint can read current blocker/rat summary.
- Subagent output is captured into durable artifacts.
- Memory can sync per worktree.
- BitShit adapter exports stable interfaces.

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
