# Install and local verification

This package is local-first. It installs OpenCode assets and updates the local OpenCode configuration so the BKG workflow is available from `/` command search.

## Private/local install flow

Use this flow for the current private productive setup:

1. Pull the repository.
2. Install dependencies with `npm ci`.
3. Build the package with `npm run build`.
4. Install OpenCode assets with `npm run install:assets`.
5. Restart OpenCode.
6. Open `/` command search and verify the BKG commands.

## Expected commands

The command search should show these current commands:

- `/bkg-project-check`
- `/bkg-memory`
- `/bkg-git`
- `/bkg-tasks`
- `/bkg-rules`
- `/bkg-debate`

Old numeric or ambiguous commands should not be treated as active commands.

## What install-assets does

`npm run install:assets` copies `assets/opencode/` into the local OpenCode config directory.

Default target:

- `~/.config/opencode`

Override target:

- `OPENCODE_CONFIG_DIR=/custom/path`

The JavaScript installer also updates `opencode.json` with:

- plugin reference
- agents
- skills
- bash permissions for BKG helper commands

## Postinstall behavior

The package currently has a `postinstall` script that runs the JavaScript installer.

For private use, this is intentional convenience.

For public npm release, this must be reviewed because install scripts that mutate user config are aggressive. Acceptable public-release options are:

- keep it and document it loudly
- gate it behind an environment variable
- replace it with a notice and require explicit `npm run install:assets`

## Update checks

The plugin now exposes an `update_check` tool.

What it does:

- reads local OpenCode config from `opencode.json` and `opencode.jsonc`
- parses pinned plugin refs such as `some-plugin@1.2.3`
- checks npm packages with `npm view`
- checks GitHub git refs through semver tags
- returns suggested prompts like `Update package from current to latest?`
- writes an update cache under the BKG plugin state directory

What it does not do:

- it does not silently edit `opencode.json`
- it does not auto-update plugins
- it does not ask the user unless an agent/tool flow calls `update_check` and surfaces the prompt

Reason: config mutation must stay explicit. Silent auto-updates are how tools become haunted furniture.

## Sync behavior

The plugin exposes these sync tools:

- `sync_status`
- `sync_push`
- `sync_pull`

Sync only works when a sync repository is configured through environment variables.

Important environment variables:

- `BKG_OPENCODE_SYNC_REPO`
- `BKG_OPENCODE_SYNC_BRANCH`
- `BKG_OPENCODE_SYNC_LOCAL_PATH`

Without `BKG_OPENCODE_SYNC_REPO`, sync can build status and manifests, but it cannot push or pull from a remote repository.

Sync does not automatically run on every startup. It must be called by an agent/tool flow so the user can see what changes are moving.

## State directory

Runtime state defaults to:

- `~/.local/share/bkg-oc-plugin-bkg-dfma/state.json`

Override:

- `BKG_OC_PLUGIN_STATE_DIR=/custom/state/path`

The old package-name path must not be used for new runtime state.

## Verification gate

Before productive use, run:

- `npm run ci`
- `npm ls --depth=0`
- `git diff --check`

Then restart OpenCode and verify the command list manually.
