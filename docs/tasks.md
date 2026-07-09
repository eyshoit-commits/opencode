# Plugin-ready task backlog

## Arbeitsmodus

Das Repo bleibt öffentlich sichtbar und wird nicht wieder versteckt oder privat gemacht. Private Nutzung ist erlaubt, aber die Struktur muss trotzdem sauber bleiben.

Keine Lane darf heimlich das komplette Projekt umbauen. Sonst haben wir wieder Architektur-Konfetti und alle tun überrascht.

## Aktueller Produktionsstand

Aktueller Hauptzweck:

- OpenCode-Assets installieren
- `opencode.json` mit Plugin-Referenz aktualisieren
- lokale Agent-Kontrollschicht bereitstellen
- Dashboard, Blocker, Rat, Votes, User-Entscheidung und Memory verbinden
- BitShit später über stabile Adapterfläche anbinden

## Command-Standard

Alle sichtbaren Hauptcommands beginnen mit `bkg-` und sagen klar, was sie tun. Keine Zahlencodes, keine Insider-Witze, keine doppeldeutigen Kurzformen.

Aktuelle Hauptcommands:

- `/bkg-project-check` — Projekt, Repo, Docs und Startkontext prüfen
- `/bkg-memory` — Memory lesen, schreiben und validieren
- `/bkg-git` — Git-Status, Pull, Commit und Push bewusst ausführen
- `/bkg-tasks` — Tasks anlegen, anzeigen, starten und aktualisieren
- `/bkg-rules` — Workflow-Regeln, Done-Kriterien und Release-Gates prüfen
- `/bkg-debate` — Team-Debatten, Rat-Sessions, Votes und Delegation starten

Legacy-Hauptcommands wie `/0ero`, `/1brain`, `/2hit`, `/3some`, `/4ever`, `/4ucker`, `/bkg-zero`, `/bkg-brain`, `/bkg-hit`, `/bkg-some`, `/bkg-ever` und `/bkg-fucker` werden nicht mehr als primäre Commands geführt.

## Lane 0 — Repo hygiene / baseline

**Ziel:** Das Plugin muss sauber installierbar und typprüfbar sein.

**Files:**

- `package.json`
- `tsconfig.json`
- `src/index.ts`
- `README.md`
- `.gitignore`
- `.github/workflows/ci.yml`
- `update.md`

**Tasks:**

- [x] Package name geprüft: `bkg-oc-plugin-bkg-dfma`
- [x] `npm run typecheck` sichergestellt
- [x] CI für typecheck hinzugefügt
- [x] README auf plugin-ready Ziel aktualisiert
- [x] Lizenz/Attribution geprüft
- [x] Runtime-State-Pfad auf neuen Paketnamen korrigiert
- [x] `update.md` als produktiver Update-Plan angelegt
- [x] README auf sprechende Commands aktualisiert

**Done wenn:**

- TypeScript kompiliert ohne Fehler.
- CI läuft auf PRs.
- README beschreibt Plugin, Assets, Dashboard und BitShit Adapter.

## Lane 1 — Rules Loader

**Ziel:** BKG Rules Loader, der Rules aus `assets/opencode/rules` lädt und für OpenCode installierbar macht.

**Tasks:**

- [x] Rule discovery für `.mdc` Dateien
- [x] Rule metadata parser
- [x] Install/copy helper
- [x] Rule validation
- [x] Tests (`tests/rules-loader.test.ts`)
- [x] Six-main-Regel auf sprechende Commands aktualisiert

## Lane 2 — Agent Identity + Personality

**Ziel:** Jeder Agent hat Identität, Rolle, Stimme, Personality und Tool-Grenzen.

**Tasks:**

- [x] Identity schema definiert
- [x] Profile für Builder/Reviewer/Product/Rat/Vote Agents
- [x] Personality-Presets definiert
- [x] Tool scopes dokumentiert
- [x] Export `createIdentityRegistry()` und `getPersonality()`
- [x] Six-main-Orchestrator auf sprechende Commands aktualisiert

## Lane 3 — Memory Core

**Ziel:** Lokales Short-Term Memory plus optional externe Memory/Recall-Anbindung.

**Tasks:**

- [x] Memory record schema
- [x] append/read/list/search
- [x] worktree keying
- [x] export/import sync
- [x] optional external recall adapter placeholder

## Lane 4 — Background Delegation + Subtasks

**Ziel:** Delegations-API mit persistenten Artefakten und Subtask-Zerlegung.

**Tasks:**

- [x] Existing delegation shim refactored
- [x] Subtask schema
- [x] `delegate()` tool stabilisiert
- [x] `delegation_read()` und `delegation_list()` verbessert
- [x] Output capture per agent/run

## Lane 5 — Ensemble / Agent Rat / Votes

**Ziel:** Rat startet bei Planung, Features und Blockern automatisch.

**Tasks:**

- [x] Rat session schema
- [x] blocker -> rat autostart
- [x] vote table schema
- [x] approval threshold rules
- [x] user approval state
- [x] fourth voice slot

## Lane 6 — Dashboard / Visualiser / Approval Gate

**Ziel:** Dashboard öffnet/aktualisiert bei Fragen oder Blockern; User kann Approve/Reject/Revise klicken.

**Tasks:**

- [x] HTTP server
- [x] `/api/state` und `/api/summary`
- [x] `/api/blocker`
- [x] `/api/rat/start`
- [x] `/api/vote` und `/api/vote/tally`
- [x] `/api/user/approve`, `/api/user/reject`, `/api/user/revise`
- [x] browser UI
- [x] README auf approve/reject/revise korrigiert; Annotationen als geplant markiert

## Lane 7 — TTS / Vorlesen

**Ziel:** Dashboard kann aktuellen Blocker, Rat-Summary oder Vote vorlesen.

**Tasks:**

- [x] Browser SpeechSynthesis fallback
- [x] optional TTS backend endpoint
- [x] Button im Dashboard

## Lane 8 — BitShit Adapter

**Ziel:** stabile API, die BitShit später nutzen kann.

**Tasks:**

- [x] Adapter Interface
- [x] `reportBlocker`
- [x] `startRat`
- [x] `recordVote`
- [x] `requestApproval`
- [x] `remember`

## Lane 9 — Assets completion

**Ziel:** Alle OpenCode Assets vollständig im Repo.

**Tasks:**

- [x] Six commands auf klare Namen normalisiert: `bkg-project-check`, `bkg-memory`, `bkg-git`, `bkg-tasks`, `bkg-rules`, `bkg-debate`
- [x] Legacy-Zahlencommands aus `assets/opencode/commands/` entfernt
- [x] Kurze halbdeutige Zwischencommands aus `assets/opencode/commands/` entfernt
- [x] Orchestrator agent aktualisiert
- [x] Rules aktualisiert
- [x] Installer-Permissions aktualisiert
- [x] 4ucker team agents vorhanden
- [x] Rat agents vorhanden
- [x] Vote agents vorhanden
- [x] Skills vorhanden

## Jetzt produktiv weiterarbeiten

**Sofort nächste Tasks:**

- [ ] Lokal ziehen: `git pull`
- [ ] Assets neu installieren: `npm run install:assets`
- [ ] OpenCode neu starten
- [ ] Unter `/` prüfen, ob nur die neuen sprechenden Commands sichtbar sind
- [ ] CI auf aktuellem Head laufen lassen: `npm run ci`
- [ ] Dependency-Baum prüfen: `npm ls --depth=0`
- [ ] Whitespace/Format prüfen: `git diff --check`
- [ ] Falls `postinstall` für öffentliche Nutzung zu aggressiv ist: Env-Gate oder Notice nachziehen
- [ ] Annotationen entweder implementieren oder weiter klar als geplant führen
- [ ] Danach Version-Bump vorbereiten

## Agent-Einsatz ab jetzt

Starte nur noch zielgerichtete Agents:

1. **Agent A — Release Gate**: CI, npm ls, diff check, package dry-run
2. **Agent B — Command UX**: `/bkg-*` Sichtbarkeit lokal prüfen
3. **Agent C — Postinstall Policy**: privat behalten oder public-safe gaten
4. **Agent D — Review Gate Next**: Annotationen/Line-Edits als nächstes echtes Feature

## Merge-/Arbeitsregel

Keine neuen Großideen in diesen Stand kippen.

Erst prüfen:

1. Commands sichtbar
2. CI grün
3. State-Pfad korrekt
4. README ehrlich
5. Produktiver Start möglich

Danach weiterbauen.
