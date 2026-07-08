---
description: BKG 4ucker. Team debates, Agent Rat, votes and background delegation.
agent: bkg-six-main-orchestrator
---

Use skills:

- bkg-six-main-flow
- 4ucker-debate
- agent-rat
- vote-core
- vote-team
- vote-council
- vote-release
- vote-post

Run shell/helper or plugin tools as needed.

Subcommands:

- `team "problem"` visible 3-agent debate
- `rat <plan|problem|feature|post|decide> "topic"` council
- `vote <team|council|release|post|feature> "decision"` vote protocol
- `delegate "prompt" "agent"` persistent background delegation

Required visible agents for team:

- `@bkg-4ucker-builder`
- `@bkg-4ucker-reviewer`
- `@bkg-4ucker-product`

Required vote agents:

- `@bkg-vote-chair`
- `@bkg-vote-recorder`
- `@bkg-vote-auditor`

No visible vote record, no approval.
