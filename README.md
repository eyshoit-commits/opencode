# bkg-oc-plugin-stop-4uck-m3-agen1s

OpenCode plugin pack that combines:

- persistent background delegation tools inspired by `kdcokenny/opencode-background-agents`
- plugin-template style package layout inspired by `zenobi-us/opencode-plugin-template`
- BKG six-main workflow commands
- visible 4ucker team debates
- Agent Rat planning council
- vote skills and vote audit
- installable OpenCode assets: commands, agents, skills and rules
- BitShit adapter interface
- Dashboard, memory, rules loader

## Package

```bash
npm install
npm run typecheck
npm run build
```

## OpenCode plugin

Main plugin entry: `src/index.ts`

The plugin exposes:

- **Background delegation** — `delegate()`, `delegation_read()`, `delegation_list()`
- **BitShit adapter** — `BitshitControlAdapter` with `reportBlocker`, `startRat`, `recordVote`, `requestApproval`, `remember`
- **Agent identity** — per-agent personality profiles
- **Memory** — short-term, worktree-sync, recall
- **Ensemble / Rat** — blocker-driven agent debates with votes
- **Dashboard** — blocker approval UI, TTS, fourth voice API
- **Rules loader** — `.mdc` rule discovery and validation

Delegation artifacts are persisted under:

```text
~/.local/share/opencode/delegations/
```

## BitShit Adapter

```ts
import { createBitshitAdapter, type BitshitControlAdapter } from "bkg-oc-plugin-stop-4uck-m3-agen1s"
const adapter = createBitshitAdapter()
await adapter.reportBlocker({ taskId, description, context })
await adapter.startRat({ blockerId, topic, agents })
await adapter.recordVote({ sessionId, agentId, choice, rationale })
```

## BKG workflow assets

Assets live under:

```text
assets/opencode/
  commands/
  agents/
  skills/
  rules/
```

Install them locally:

```bash
npm run install:assets
```

This copies the BKG commands, agents, skills and rules into `~/.config/opencode/`.

## Six main commands

Only these are main workflow commands:

- `0ero`
- `1brain`
- `2hit`
- `3some`
- `4ever`
- `4ucker`

Everything else is a subcommand.

## 4ucker system

`4ucker team` uses:

- `@bkg-4ucker-builder`
- `@bkg-4ucker-reviewer`
- `@bkg-4ucker-product`

`4ucker rat` uses:

- `@bkg-rat-architect`
- `@bkg-rat-builder`
- `@bkg-rat-reviewer`
- `@bkg-rat-product`
- `@bkg-rat-growth`
- `@bkg-rat-contrarian`

Votes use:

- `@bkg-vote-chair`
- `@bkg-vote-recorder`
- `@bkg-vote-auditor`

No visible vote record, no approval.

## Architecture

See `docs/plugin-ready-plan.md` for the full architecture and `docs/tasks.md` for the lane-based implementation plan.
