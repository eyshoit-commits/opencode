# BKG OpenCode Plugin DFMA

BKG OpenCode Plugin DFMA is a plugin-ready OpenCode package for coordinated agent work. It bundles the BKG six-command workflow assets, background delegation, Agent Rat voting, dashboard review gates, local memory, sync manifests, update-notifier parsing, Conclave-style debate sessions, and a stable BitShit adapter surface.

The package is intentionally local-first. It writes runtime state under the user account, exposes browser-based control surfaces, and keeps user approval explicit instead of letting agents quietly decide important things because apparently civilization needed another way to create paperwork.

## Package

```json
{
  "plugin": ["bkg-oc-plugin-bkg-dfma@0.1.0"]
}
```

For local development, install from this repository or use the generated package tarball after `npm pack`.

## Core features

- **Background agents**: delegate work and store delegation artifacts.
- **Live subagent output**: stream nested agent sessions, tools, reasoning and results into the dashboard.
- **Agent Rat**: escalate blockers into structured multi-agent review.
- **Vote engine**: record approve, reject, abstain and tally decisions.
- **Dashboard**: local HTTP UI for blockers, Rat sessions, votes, memory, TTS and fourth-voice requests.
- **Review gate direction**: Plannotator-inspired local browser approval flow is planned for blocker/plan review.
- **Conclave model**: Captain plus Facts, Logic and Alternative perspectives with consensus threshold support.
- **Sync manifest**: OpenCode config, skills, agents, model favorites and BKG plugin state path planning inspired by opencode-synced.
- **Update notifier parser**: detects pinned plugin refs so updates can be surfaced without auto-updating.
- **BitShit adapter**: stable interface for future BitShit integration, with both stub and runtime-backed implementations.

## Commands and assets

The install helper copies packaged OpenCode assets into the user's config directory:

```bash
npm run install:assets
```

The BKG six-main command model is:

```text
/0ero
/1brain
/2hit
/3some
/4ever
/4ucker
```

Everything else should remain a subcommand, skill, rule or internal tool. Humans keep inventing menu sprawl; this repo tries not to join them.

## Dashboard

Start the local dashboard during development:

```bash
npm run dashboard:start
```

Default URL:

```text
http://127.0.0.1:4774
```

Environment variables:

```bash
BKG_OC_DASHBOARD_HOST=127.0.0.1
BKG_OC_DASHBOARD_PORT=4774
```

Dashboard API endpoints currently include:

```text
GET  /api/state
GET  /api/summary
GET  /api/live-output?after=<sequence>
POST /api/blocker
POST /api/rat/start
POST /api/vote
POST /api/user/approve
POST /api/user/reject
POST /api/user/revise
GET  /api/vote/tally?ratSessionId=...
POST /api/tts/read
POST /api/fourth-voice/request
```

The **Subagent Output** panel updates roughly every 800 ms. OpenCode plugin
events are normalized, deduplicated, and written to a bounded local JSONL feed
so a separately started dashboard process can follow them live. The feed keeps
agent names, instance numbers, nesting depth, tool details, final text and a
clear finished state.

This behavior is inspired by the GPL-3.0 project
[`raisbecka/opencode-subagent-output`](https://github.com/raisbecka/opencode-subagent-output).
No third-party source file is vendored; the dashboard integration, event model,
storage bridge and UI are implemented in this package.

## BitShit adapter

Two adapter entry points exist:

```ts
import { createBitshitAdapter } from "./src/bitshit/adapter.js"
import { createRuntimeBitshitAdapter } from "./src/bitshit/runtime-adapter.js"
```

Use `createRuntimeBitshitAdapter()` for real plugin state. It delegates blockers, Rat sessions, votes and memory to the local runtime modules.

`createBitshitAdapter()` remains a compatibility stub and marks approval decisions with `isStub: true`.

## Agent coordination rules

Every helper agent must follow:

```text
docs/agent-work-contract.md
```

Lane prompts live in:

```text
docs/agent-lane-prompts.md
```

Hard rule:

```text
No claim, no work.
No evidence, no done.
No silent blocker.
```

This prevents five agents from simultaneously editing the same file and then acting surprised when Git turns into a crime scene.

## Development

Install dependencies:

```bash
npm ci
```

Run checks:

```bash
npm run lint:readme
npm run typecheck
npm run test
npm run build
npm pack --dry-run
```

Full CI-equivalent command:

```bash
npm run ci
```

## Test scope

The current test suite is intentionally small and contract-focused:

- update-notifier pinned plugin parsing
- Conclave session early-stop behavior
- BitShit runtime adapter smoke contract

More integration tests should be added as the dashboard review gate becomes executable.

## Security and release posture

- Dependencies are pinned to semver ranges, not `latest`.
- The package name avoids profanity and leetspeak to stay publishable and corporate-proxy-safe.
- The plugin does not auto-update dependencies or plugin refs.
- Update detection should only notify and never mutate config without explicit approval.
- Runtime decisions that affect work should flow through Rat, vote or user approval state.

## License

MIT. See `LICENSE`.
