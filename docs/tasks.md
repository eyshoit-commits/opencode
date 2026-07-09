# Plugin-ready task backlog

## Arbeitsmodus

Die Arbeit kann parallel von mehreren Agents erledigt werden. Jeder Agent bekommt eine Lane mit klaren Dateien, Akzeptanzkriterien und Grenzen.

Wichtig: Keine Lane darf heimlich das komplette Projekt umbauen. Sonst haben wir wieder Architektur-Konfetti und alle tun überrascht.

## Lane 0 — Repo hygiene / baseline

**Ziel:** Das Plugin muss sauber installierbar und typprüfbar werden.

**Files:**

- `package.json`
- `tsconfig.json`
- `src/index.ts`
- `README.md`
- `.gitignore`
- `.github/workflows/ci.yml`

**Tasks:**

- [x] Package name geprüft: `bkg-oc-plugin-bkg-dfma`
- [x] `npm run typecheck` sicherstellen
- [x] CI für typecheck hinzufügen
- [x] README auf plugin-ready Ziel aktualisiert
- [x] Lizenz/Attribution geprüft (MIT, copyright 2026 eysho.dev)

**Done wenn:**

- TypeScript kompiliert ohne Fehler.
- CI läuft auf PRs.
- README beschreibt Plugin, Assets, Dashboard und BitShit Adapter.

## Lane 1 — Rules Loader

**Quelle:** `frap129/opencode-rules`

**Ziel:** BKG Rules Loader, der Rules aus `assets/opencode/rules` lädt und für OpenCode installierbar macht.

**Files:**

- `src/rules-loader.ts`
- `assets/opencode/rules/bkg-six-main.mdc`
- `assets/opencode/rules/bkg-rat-vote.mdc`
- `assets/opencode/rules/bkg-blocker-dashboard.mdc`

**Tasks:**

- [x] Rule discovery für `.mdc` Dateien
- [x] Rule metadata parser
- [x] Install/copy helper (rekursiv mit Unterverzeichnissen)
- [x] Rule validation
- [x] Tests (`tests/rules-loader.test.ts`, 13 Tests)

**Done wenn:**

- Rules werden gefunden, validiert und installierbar gemacht.
- Missing/invalid rules erzeugen klare Fehler.
- `npm run test` läuft grün für rules-loader.

## Lane 2 — Agent Identity + Personality

**Quellen:**

- `gotgenes/opencode-agent-identity`
- `joostvanwollingen/opencode-personality`

**Ziel:** Jeder Agent hat Identität, Rolle, Stimme, Personality und Tool-Grenzen.

**Files:**

- `src/identity.ts`
- `src/personality.ts`
- `assets/opencode/agents/*.md`

**Tasks:**

- [x] Identity schema definiert (`src/identity.ts`, `src/personality.ts`)
- [x] Profile für Builder/Reviewer/Product/Rat/Vote Agents in `assets/opencode/agents/*.md`
- [x] Personality-Presets definiert (orchestrator, builder, reviewer, product, architect, growth, contrarian, chair, recorder, auditor)
- [x] Tool scopes dokumentiert in Agent-Markdown-Files
- [x] Export `createIdentityRegistry()` und `getPersonality()`

**Done wenn:**

- Agentenprofile maschinenlesbar sind.
- Orchestrator kann Identity abrufen.
- `npm run test` läuft grün für personality.

## Lane 3 — Memory Core

**Quellen:**

- `supermemoryai/opencode-supermemory`
- `andrejtonev/opencode-short-term-memory`
- `Edison-A-N/opencode-worktree-memory-sync`

**Ziel:** Lokales Short-Term Memory plus optional externe Memory/Recall-Anbindung.

**Files:**

- `src/memory/short-term.ts`
- `src/memory/worktree-sync.ts`
- `src/memory/recall.ts`
- `src/memory/types.ts`

**Tasks:**

- [x] Memory record schema (`src/memory/types.ts`)
- [x] append/read/list/search (`src/memory/short-term.ts`)
- [x] worktree keying (`src/memory/worktree-sync.ts`)
- [x] export/import sync (`exportShortTermMemory`, `importShortTermMemory`)
- [x] optional external recall adapter placeholder (`src/memory/recall.ts`)

**Done wenn:**

- Memory funktioniert lokal ohne externen Dienst.
- Worktree-getrennte Memories sind möglich.
- Externe Recall-API kann später angeschlossen werden.
- `npm run test` läuft grün für memory-short-term und memory-worktree-sync.

## Lane 4 — Background Delegation + Subtasks

**Quellen:**

- `kdcokenny/opencode-background-agents`
- `spoons-and-mirrors/subtask2`
- `kdcokenny/ocx`

**Ziel:** Delegations-API mit persistenten Artefakten und Subtask-Zerlegung.

**Files:**

- `src/background-agents.ts`
- `src/subagents/delegation.ts`
- `src/subagents/subtasks.ts`
- `src/subagents/output-capture.ts`

**Tasks:**

- [x] Existing delegation shim refactored (`src/subagents/delegation.ts`)
- [x] Subtask schema (`src/subagents/subtasks.ts`)
- [x] `delegate()` tool stabilisiert (`src/background-agents.ts`)
- [x] `delegation_read()` und `delegation_list()` verbessert
- [x] Output capture per agent/run (`src/subagents/output-capture.ts`)

**Done wenn:**

- Delegation erzeugt stabile IDs und Artefakte.
- Subtasks können gespeichert und gelesen werden.
- Subagent Output kann in Reports übernommen werden.
- `npm run test` läuft grün für delegation-integration.

## Lane 5 — Ensemble / Agent Rat / Votes

**Quellen:**

- `hueyexe/opencode-ensemble`
- bisherige BKG Agent Rat/Vote Struktur

**Ziel:** Rat startet bei Planung, Features und Blockern automatisch.

**Files:**

- `src/ensemble/rat.ts`
- `src/ensemble/votes.ts`
- `src/ensemble/blockers.ts`
- `assets/opencode/skills/agent-rat/SKILL.md`
- `assets/opencode/skills/vote-core/SKILL.md`

**Tasks:**

- [x] Rat session schema (`src/ensemble/rat.ts`)
- [x] blocker -> rat autostart (`src/ensemble/blockers.ts`, `shouldStartRat`, `autoStartRatForBlocker`)
- [x] vote table schema (`src/ensemble/votes.ts`)
- [x] approval threshold rules (`determineOutcome`: majority of non-abstaining votes)
- [x] user approval state (`recordUserApproval`, `listUserApprovals`)
- [x] fourth voice slot (`setFourthVoice`, `/api/fourth-voice/request`)

**Done wenn:**

- Blocker kann Rat-Session starten.
- Vote result kann `approved`, `rejected`, `revise`, `blocked` sein.
- Fourth voice kann als externe API-Stimme ergänzt werden.
- `npm run test` läuft grün für ensemble-rat und ensemble-votes.

## Lane 6 — Dashboard / Visualiser / Approval Gate

**Quellen:**

- `psinetron/opencode-visualiser`
- bisherige Live Debate Dashboard Idee

**Ziel:** Dashboard öffnet/aktualisiert bei Fragen oder Blockern; User kann Approve/Reject klicken.

**Files:**

- `src/dashboard/server.ts`
- `src/dashboard/state.ts`
- `src/dashboard/api.ts`
- `src/dashboard/static/index.html`
- `src/dashboard/static/app.js`
- `src/dashboard/static/style.css`

**Tasks:**

- [x] HTTP server (`src/dashboard/server.ts`)
- [x] `/api/state` und `/api/summary`
- [x] `/api/blocker`
- [x] `/api/rat/start`
- [x] `/api/vote` und `/api/vote/tally`
- [x] `/api/user/approve`, `/api/user/reject`, `/api/user/revise`
- [x] browser UI (`src/dashboard/static/index.html`, `app.js`, `style.css`)

**Done wenn:**

- Dashboard zeigt Blocker, Agenten, Votes, Reports.
- User kann approve/reject/revise klicken.
- State wird persistiert.
- `npm run test` läuft grün für dashboard-api.

## Lane 7 — TTS / Vorlesen

**Quelle:** `StefanoChiodino/opencode-tts`

**Ziel:** Dashboard kann aktuellen Blocker, Rat-Summary oder Vote vorlesen.

**Files:**

- `src/dashboard/tts.ts`
- `src/dashboard/static/app.js`

**Tasks:**

- [x] Browser SpeechSynthesis fallback (`src/dashboard/tts.ts`, `createTtsResponse`)
- [x] optional TTS backend endpoint (`/api/tts/read`)
- [x] Button im Dashboard ("Vorlesen" in `index.html` und `app.js`)

**Done wenn:**

- Klick auf "Vorlesen" liest aktuelle Zusammenfassung vor.
- Kein externer Dienst zwingend erforderlich.

## Lane 8 — BitShit Adapter

**Ziel:** stabile API, die BitShit später nutzen kann.

**Files:**

- `src/bitshit/adapter.ts`
- `src/bitshit/types.ts`

**Tasks:**

- [x] Adapter Interface (`src/bitshit/types.ts`, `BitshitControlAdapter`)
- [x] `reportBlocker` (via `createRuntimeBitshitAdapter`)
- [x] `startRat` (via `createRuntimeBitshitAdapter`)
- [x] `recordVote` (via `createRuntimeBitshitAdapter`)
- [x] `requestApproval` (via `createRuntimeBitshitAdapter`)
- [x] `remember` (via `createRuntimeBitshitAdapter`)

**Done wenn:**

- BitShit kann gegen Types kompilieren.
- Adapter ist unabhängig vom OpenCode-Asset-Installer.
- `npm run test` läuft grün für bitshit-adapter und bitshit-runtime-adapter.

## Lane 9 — Assets completion

**Ziel:** Alle OpenCode Assets vollständig im Repo.

**Files:**

- `assets/opencode/commands/`
- `assets/opencode/agents/`
- `assets/opencode/skills/`
- `assets/opencode/rules/`

**Tasks:**

- [x] Alle six commands (`assets/opencode/commands/0ero.md` bis `4ucker.md`)
- [x] Orchestrator agent (`bkg-orchestrator.md`, `bkg-six-main-orchestrator.md`)
- [x] 4ucker team agents (`bkg-4ucker-builder.md`, `bkg-4ucker-product.md`, `bkg-4ucker-reviewer.md`)
- [x] Rat agents (`bkg-rat-architect.md`, `bkg-rat-builder.md`, `bkg-rat-contrarian.md`, `bkg-rat-growth.md`, `bkg-rat-product.md`, `bkg-rat-reviewer.md`)
- [x] Vote agents (`bkg-vote-chair.md`, `bkg-vote-recorder.md`, `bkg-vote-auditor.md`)
- [x] Skills vollständig (`4ucker-builder`, `4ucker-debate`, `4ucker-product`, `4ucker-reviewer`, `agent-rat`, `bkg-six-main-flow`, `vote-core`, `vote-council`, `vote-post`, `vote-release`, `vote-team`)
- [x] Rules vollständig (`bkg-six-main.mdc`, `bkg-rat-vote.mdc`, `bkg-blocker-dashboard.mdc`, `bkg-visible-agents-and-vote.mdc`)

**Done wenn:**

- `npm run install:assets` installiert ein vollständiges OpenCode Pack.
- `opencode.json` wird automatisch aktualisiert (Plugin-Referenz, Agenten, Skills, Permissions).

## Empfehlung: Welche Agents starten?

Starte 5 Agents parallel:

1. **Agent A — Core/Types**: Lane 0 + Lane 8
2. **Agent B — Rules/Assets**: Lane 1 + Lane 9
3. **Agent C — Memory/Delegation**: Lane 3 + Lane 4
4. **Agent D — Rat/Vote/Blocker**: Lane 5
5. **Agent E — Dashboard/TTS**: Lane 6 + Lane 7

## Merge-Reihenfolge

1. Core/Types
2. Rules/Assets
3. Memory/Delegation
4. Rat/Vote/Blocker
5. Dashboard/TTS
6. Integration pass

## Sofort nächste Aufgabe

```text
Alle Lanes sind implementiert. Nächster Schritt: Fourth Voice API an echten externen Dienst anbinden (z.B. OpenAI/Anthropic API für ChatGPT-Reviewer), dann Version bump und npm publish vorbereiten.
```
