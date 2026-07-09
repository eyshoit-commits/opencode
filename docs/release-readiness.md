# Release readiness

This document defines the gate for a productive private release and the stricter gate for any later public npm release.

## Current release posture

Current target:

- private productive use
- public repository remains visible
- no hiding the repo again just because the docs were embarrassing for five minutes

Public npm release is a separate decision and needs the public-release checks below.

## Private productive gate

Private productive use is allowed when all of these are true:

- `npm run ci` passes.
- `npm ls --depth=0` is clean.
- `git diff --check` is clean.
- `npm run install:assets` installs the OpenCode asset pack.
- OpenCode `/` command search shows the six current commands from `docs/commands.md`.
- Runtime state uses `bkg-oc-plugin-bkg-dfma` by default.
- README and docs describe approve/reject/revise accurately.
- Annotation support is described as planned unless implemented and tested.

## Current command gate

The only documented top-level BKG workflow commands are:

- `/bkg-project-check`
- `/bkg-memory`
- `/bkg-git`
- `/bkg-tasks`
- `/bkg-rules`
- `/bkg-debate`

Numeric or ambiguous legacy commands must not be shown as primary commands.

## Dependency lock

The committed lockfile currently resolves `esbuild` to `0.28.1`. It is a transitive dependency selected by `tsx` and by `vitest` through `vite`; this package has no direct `esbuild` dependency or version override.

Any future lockfile change that selects a different `esbuild` version must be explained and validated in the corresponding pull request.

## Runtime state gate

Default runtime state must be:

- `~/.local/share/bkg-oc-plugin-bkg-dfma/state.json`

Allowed override:

- `BKG_OC_PLUGIN_STATE_DIR=/custom/path`

The old package-name state path must not be used for new runtime state.

## Review-gate truth gate

Current behavior:

- approve
- reject
- revise
- vote tally
- blocker reporting
- Rat session start
- fourth voice request
- TTS read endpoint

Planned, not current:

- annotations
- line-range comments
- structured revise edits
- browser-based diff patching

Docs must keep this distinction clear.

## Public npm release gate

Before public npm release, decide and document `postinstall` behavior.

The current `postinstall` mutates local OpenCode config by installing assets and updating `opencode.json`. That is acceptable for private productive use, but public npm release needs one of these choices:

- keep the behavior and document it loudly
- gate the behavior behind an environment variable
- replace `postinstall` with a notice and require explicit `npm run install:assets`

## Final validation checklist

Run these before tagging or publishing:

- `npm ci`
- `npm run lint:readme`
- `npm run lint:lockfile`
- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run install:assets`
- `npm pack --dry-run`
- `npm ls --depth=0`
- `git diff --check`
- local OpenCode restart and `/` command verification

## Approval rule

Private productive use can proceed after the private productive gate passes.

Public npm release requires the public npm release gate plus a final review vote.
