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

- [ ] Package name prüfen: `bkg-oc-plugin-stop-4uck-m3-agen1s`
- [ ] `npm run typecheck` sicherstellen
- [ ] CI für typecheck hinzufügen
- [ ] README auf plugin-ready Ziel aktualisieren
- [ ] Lizenz/Attribution prüfen

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

- [ ] Rule discovery für `.mdc` Dateien
- [ ] Rule metadata parser
- [ ] Install/copy helper
- [ ] Rule validation
- [ ] Tests oder minimaler validation script

**Done wenn:**

- Rules werden gefunden, validiert und installierbar gemacht.
- Missing/invalid rules erzeugen klare Fehler.

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

- [ ] Identity schema definieren
- [ ] Profile für Builder/Reviewer/Product/Rat/Vote Agents
- [ ] Personality-Presets definieren
- [ ] Tool scopes dokumentieren
- [ ] Export `getAgentIdentity(name)`

**Done wenn:**

- Agentenprofile maschinenlesbar sind.
- Orchestrator kann Identity abrufen.

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

- [ ] Memory record schema
- [ ] append/read/list/search
- [ ] worktree keying
- [ ] export/import sync
- [ ] optional external recall adapter placeholder

**Done wenn:**

- Memory funktioniert lokal ohne externen Dienst.
- Worktree-getrennte Memories sind möglich.
- Externe Recall-API kann später angeschlossen werden.

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

- [ ] Existing delegation shim refactoren
- [ ] Subtask schema
- [ ] `delegate()` tool stabilisieren
- [ ] `delegation_read()` und `delegation_list()` verbessern
- [ ] Output capture per agent/run

**Done wenn:**

- Delegation erzeugt stabile IDs und Artefakte.
- Subtasks können gespeichert und gelesen werden.
- Subagent Output kann in Reports übernommen werden.

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

- [ ] Rat session schema
- [ ] blocker -> rat autostart
- [ ] vote table schema
- [ ] approval threshold rules
- [ ] user approval state
- [ ] fourth voice slot

**Done wenn:**

- Blocker kann Rat-Session starten.
- Vote result kann `approved`, `rejected`, `revise`, `blocked` sein.
- Fourth voice kann als externe API-Stimme ergänzt werden.

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

- [ ] HTTP server
- [ ] `/api/state`
- [ ] `/api/blocker`
- [ ] `/api/rat/start`
- [ ] `/api/vote`
- [ ] `/api/user/approve`
- [ ] `/api/user/reject`
- [ ] browser UI

**Done wenn:**

- Dashboard zeigt Blocker, Agenten, Votes, Reports.
- User kann approve/reject/revise klicken.
- State wird persistiert.

## Lane 7 — TTS / Vorlesen

**Quelle:** `StefanoChiodino/opencode-tts`

**Ziel:** Dashboard kann aktuellen Blocker, Rat-Summary oder Vote vorlesen.

**Files:**

- `src/dashboard/tts.ts`
- `src/dashboard/static/app.js`

**Tasks:**

- [ ] Browser SpeechSynthesis fallback
- [ ] optional TTS backend endpoint
- [ ] `/api/tts/read`
- [ ] Button im Dashboard

**Done wenn:**

- Klick auf “Vorlesen” liest aktuelle Zusammenfassung vor.
- Kein externer Dienst zwingend erforderlich.

## Lane 8 — BitShit Adapter

**Ziel:** stabile API, die BitShit später nutzen kann.

**Files:**

- `src/bitshit/adapter.ts`
- `src/bitshit/types.ts`

**Tasks:**

- [ ] Adapter Interface
- [ ] reportBlocker
- [ ] startRat
- [ ] recordVote
- [ ] requestApproval
- [ ] remember

**Done wenn:**

- BitShit kann gegen Types kompilieren.
- Adapter ist unabhängig vom OpenCode-Asset-Installer.

## Lane 9 — Assets completion

**Ziel:** Alle OpenCode Assets vollständig im Repo.

**Files:**

- `assets/opencode/commands/`
- `assets/opencode/agents/`
- `assets/opencode/skills/`
- `assets/opencode/rules/`

**Tasks:**

- [ ] Alle six commands
- [ ] Orchestrator agent
- [ ] 4ucker team agents
- [ ] Rat agents
- [ ] Vote agents
- [ ] Skills vollständig
- [ ] Rules vollständig

**Done wenn:**

- `npm run install:assets` installiert ein vollständiges OpenCode Pack.

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
Implement Lane 0 and Lane 8 first: make the package plugin-ready, add CI, add stable BitShit adapter types, and keep all current plugin tools compiling.
```
