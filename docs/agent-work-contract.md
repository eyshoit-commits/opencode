# Agent Work Contract

This file is mandatory for every agent that works on `bkg-oc-plugin-stop-4uck-m3-agen1s`.

Purpose: prevent five agents from editing the same file, claiming the same task, or producing beautiful garbage that somebody else has to debug 100 times.

## Hard rules

1. Every agent must claim exactly one task lane before editing.
2. Every agent must declare touched files before editing.
3. Every agent must not edit files outside its claimed lane unless explicitly allowed.
4. Every agent must write a status record before and after work.
5. Every agent must write evidence: commands, tests, files changed, and remaining blockers.
6. No task claim, no work.
7. No evidence, no done.
8. If a blocker appears, stop and write it. Do not silently “fix around it”.
9. If two agents need the same file, the later agent must wait or ask for handoff.
10. Integration agent is the only one allowed to reconcile cross-lane conflicts.

## Directory

Agent coordination lives under:

```text
.agent-work/
  claims/
  status/
  handoffs/
  blockers/
  evidence/
```

## Claim format

Before work, create:

```text
.agent-work/claims/<agent-id>.md
```

Template:

```markdown
# Claim: <agent-id>

## Agent

<agent name>

## Lane

<Lane number and name>

## Task

<short task title>

## Files claimed

- path/to/file.ts
- path/to/file.md

## Files read-only

- path/to/context.md

## Start time

<ISO timestamp>

## Expected output

- concrete deliverable 1
- concrete deliverable 2

## Not doing

- anything outside the lane
```

## Status format

During work, update:

```text
.agent-work/status/<agent-id>.md
```

Template:

```markdown
# Status: <agent-id>

## Current state

planned / in_progress / blocked / ready_for_review / done

## Progress

- ...

## Files changed

- ...

## Commands run

```bash
npm run typecheck
```

## Evidence

- ...

## Blockers

- none

## Next handoff

- ...
```

## Blocker format

If blocked, create:

```text
.agent-work/blockers/<agent-id>.<slug>.md
```

Template:

```markdown
# Blocker: <short title>

## Agent

<agent-id>

## Lane

<lane>

## Problem

...

## Impact

...

## Tried

...

## Needed decision

...

## Should Agent Rat start?

yes/no
```

If `Should Agent Rat start? yes`, dashboard/rat flow must be triggered before continuing.

## Evidence format

At the end, create:

```text
.agent-work/evidence/<agent-id>.<slug>.md
```

Template:

```markdown
# Evidence: <task title>

## Agent

<agent-id>

## Lane

<lane>

## Summary

...

## Files changed

- ...

## Commands run

```bash
...
```

## Test result

pass/fail/not run

## Remaining risks

- ...

## Handoff

- ...
```

## Merge rule

A lane is mergeable only if:

- claim exists
- status is `ready_for_review` or `done`
- evidence exists
- no unresolved blocker exists
- changed files match the claim

## Recommended lane assignment

- Agent A: Lane 0 + Lane 8, Core and BitShit Adapter
- Agent B: Lane 1 + Lane 9, Rules and Assets
- Agent C: Lane 3 + Lane 4, Memory and Delegation
- Agent D: Lane 5, Rat, Vote and Blocker
- Agent E: Lane 6 + Lane 7, Dashboard and TTS
- Integration Agent: merge pass only after all lane evidence exists
