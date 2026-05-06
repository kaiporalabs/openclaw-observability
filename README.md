# OpenClaw Observability

Vendor-agnostic OpenClaw plugin that emits **structured observation events** for tools and model calls (and optional session / agent lifecycle hooks). Events can be written to an **NDJSON file** and/or sent to an **HTTP webhook** — no fixed third-party APM backend.

## Features

- **Hooks** (toggle via config): `before_tool_call`, `after_tool_call`, `model_call_started`, `model_call_ended`, optional `agent_end`, `session_start`, `session_end`.
- **Exporters**: file (append NDJSON) and webhook (POST JSON per observation).
- **Sanitization**: depth/string/array limits and key-based redaction for secrets.

## Install

```bash
openclaw plugins install @kaiporalabs/openclaw-observability
```

Or add the package to your OpenClaw environment and enable it in config.

## Configuration

Enable at least **one** exporter with a valid `path` or `url`.

Example (`plugins.entries` style — exact shape follows your OpenClaw config):

```json
{
  "openclaw-observability": {
    "enabled": true,
    "config": {
      "hooks": {
        "beforeToolCall": true,
        "afterToolCall": true,
        "modelCallStarted": true,
        "modelCallEnded": true,
        "agentEnd": false,
        "sessionStart": false,
        "sessionEnd": false
      },
      "sanitization": {
        "maxDepth": 8,
        "maxStringLength": 8192,
        "maxArrayLength": 64,
        "redactKeys": ["password", "token", "authorization", "apiKey", "secret"]
      },
      "exporters": {
        "file": {
          "enabled": true,
          "path": "${OPENCLAW_STATE_DIR}/observability.ndjson",
          "mkdir": true
        },
        "webhook": {
          "enabled": true,
          "url": "https://example.com/openclaw-observability",
          "headers": {
            "Authorization": "Bearer …"
          },
          "timeoutMs": 15000
        }
      }
    }
  }
}
```

## Event envelope

Each line (file) or HTTP body (webhook) is one JSON object:

```json
{
  "schema": "openclaw.observability/v1",
  "pluginId": "openclaw-observability",
  "emittedAt": "2026-05-06T12:00:00.000Z",
  "hook": "after_tool_call",
  "correlation": {
    "agentId": "…",
    "sessionKey": "…",
    "sessionId": "…",
    "runId": "…",
    "toolCallId": "…",
    "toolName": "…"
  },
  "data": {}
}
```

The `data` field is sanitized before export.

## Requirements

- OpenClaw `>= 2026.5.0` (peer dependency).

## License

MIT — see [LICENSE](./LICENSE).
