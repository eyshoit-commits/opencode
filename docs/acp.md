# ACP compatibility

OpenCode already implements the Agent Client Protocol (ACP). This plugin does
not implement JSON-RPC or stdio framing itself. Instead, it remains compatible
by exposing normal OpenCode tools, commands, agents, rules, permissions, MCP
configuration, formatters, and linters.

Start OpenCode as an ACP subprocess with:

```bash
opencode acp
```

The editor launches that command and communicates with OpenCode through
JSON-RPC over stdin/stdout. The plugin is loaded through the normal OpenCode
configuration:

```json
{
  "plugin": ["bkg-oc-plugin-bkg-dfma@0.1.0"]
}
```

## Compatibility rules

- Prefer plugin tools as fallbacks for workflows otherwise reached through
  slash commands.
- OpenCode currently does not support the built-in `/undo` and `/redo`
  commands in ACP mode.
- Do not write protocol messages to stdout from plugin code. ACP owns stdio.
- Dashboard and review-gate output stays on local HTTP ports and must never be
  mixed into ACP's JSON-RPC stream.
- The dashboard can run as a separate process and follows live agent output
  through the local JSONL bridge.
- Browser launch is optional for remote or SSH sessions.

## Environment

```text
BKG_OC_ACP_ENABLED=1
BKG_OC_DASHBOARD_REMOTE=1
BKG_OC_DASHBOARD_PORT=4774
BKG_OC_DASHBOARD_BROWSER=/absolute/path/to/browser
BKG_OC_REVIEW_GATE_MODE=browser
BKG_OC_REVIEW_GATE_TIMEOUT_SECONDS=345600
```

`BKG_OC_REVIEW_GATE_TIMEOUT_SECONDS` defaults to 345600 seconds (96 hours).
Allowed review-gate modes are `browser` and `disabled`.

## Editor examples

### Zed

```json
{
  "agent_servers": {
    "OpenCode": {
      "command": "opencode",
      "args": ["acp"]
    }
  }
}
```

### JetBrains

```json
{
  "agent_servers": {
    "OpenCode": {
      "command": "/absolute/path/bin/opencode",
      "args": ["acp"]
    }
  }
}
```

### Avante.nvim

```lua
{
  acp_providers = {
    ["opencode"] = {
      command = "opencode",
      args = { "acp" }
    }
  }
}
```

### CodeCompanion.nvim

CodeCompanion can select OpenCode as its ACP chat adapter:

```lua
require("codecompanion").setup({
  interactions = {
    chat = {
      adapter = {
        name = "opencode",
        model = "claude-sonnet-4",
      },
    },
  },
})
```

See the official [OpenCode ACP documentation](https://opencode.ai/docs/de/acp/)
for the current editor-specific setup and support matrix.
