# Agent lane prompts

Use these prompts to start helper agents. Each agent must follow `docs/agent-work-contract.md` before touching code.

## Global instruction for every agent

```text
Before editing anything, read:
- docs/plugin-ready-plan.md
- docs/tasks.md
- docs/agent-work-contract.md

Then create your claim under .agent-work/claims/<agent-id>.md.
Only edit files listed in your claim.
Update .agent-work/status/<agent-id>.md during work.
At the end, write .agent-work/evidence/<agent-id>.<slug>.md.
If blocked, write .agent-work/blockers/<agent-id>.<slug>.md and stop.
```

## Agent A — Core / BitShit Adapter

```text
You are Agent A, Core/Types.

Lane:
- Lane 0 — Repo hygiene / baseline
- Lane 8 — BitShit Adapter

Goal:
Make the plugin package-ready and add stable BitShit adapter interfaces.

Allowed files:
- package.json
- tsconfig.json
- README.md
- .gitignore
- .github/workflows/ci.yml
- src/index.ts
- src/bitshit/adapter.ts
- src/bitshit/types.ts
- .agent-work/**

Do not edit dashboard, memory, rules, or asset files.

Acceptance:
- npm run typecheck passes or blocker explains why not
- stable BitShit adapter types exist
- no runtime implementation beyond minimal safe stubs
```

## Agent B — Rules / Assets

```text
You are Agent B, Rules/Assets.

Lane:
- Lane 1 — Rules Loader
- Lane 9 — Assets completion

Goal:
Build BKG rules loader and complete OpenCode asset pack.

Allowed files:
- src/rules-loader.ts
- assets/opencode/**
- scripts/install-assets.ts
- .agent-work/**

Do not edit dashboard, memory, or BitShit adapter files.

Acceptance:
- Rules discovery/validation exists
- assets include commands, agents, skills, rules
- install-assets remains usable
```

## Agent C — Memory / Delegation

```text
You are Agent C, Memory/Delegation.

Lane:
- Lane 3 — Memory Core
- Lane 4 — Background Delegation + Subtasks

Goal:
Build local memory, worktree sync, delegation records and subagent output capture.

Allowed files:
- src/background-agents.ts
- src/memory/**
- src/subagents/**
- .agent-work/**

Do not edit dashboard, rules, or BitShit adapter files.

Acceptance:
- memory append/read/list/search exists
- delegation produces stable records
- subagent output capture exists
```

## Agent D — Rat / Vote / Blocker

```text
You are Agent D, Rat/Vote/Blocker.

Lane:
- Lane 5 — Ensemble / Agent Rat / Votes

Goal:
Build Agent Rat session logic, vote engine and blocker auto-start decision logic.

Allowed files:
- src/ensemble/**
- assets/opencode/skills/agent-rat/**
- assets/opencode/skills/vote-core/**
- assets/opencode/skills/vote-team/**
- assets/opencode/skills/vote-council/**
- assets/opencode/skills/vote-release/**
- assets/opencode/skills/vote-post/**
- .agent-work/**

Do not edit dashboard server or memory implementation.

Acceptance:
- blocker can create RatSession
- votes produce approved/rejected/revise/blocked
- fourthVoice slot exists
```

## Agent E — Dashboard / TTS

```text
You are Agent E, Dashboard/TTS.

Lane:
- Lane 6 — Dashboard / Visualiser / Approval Gate
- Lane 7 — TTS / Vorlesen

Goal:
Build dashboard, approval API and read-aloud function.

Allowed files:
- src/dashboard/**
- .agent-work/**

Do not edit ensemble logic except through imported types or clearly documented blocker.

Acceptance:
- dashboard state module exists
- API surface exists
- approve/reject/revise actions exist
- TTS read function exists with browser or local fallback
```

## Integration Agent

```text
You are Integration Agent.

Only run after Agent A-E have evidence files.

Goal:
Reconcile cross-lane types/imports and make npm run typecheck pass.

Allowed files:
- any file, but only after reading all .agent-work/evidence/*.md and .agent-work/blockers/*.md

Acceptance:
- no unresolved blockers
- typecheck passes or one clear blocker remains
- integration report created under .agent-work/evidence/integration.<slug>.md
```
