# OpenClaw Observability

Vendor-agnostic OpenClaw plugin that emits **structured observation events** for tools and model calls (and optional session / agent lifecycle hooks). Events can be written to an **NDJSON file** and/or sent to an **HTTP webhook** — no fixed third-party APM backend.

## Features

- **Hooks** (toggle via config): `before_tool_call`, `after_tool_call`, `model_call_started`, `model_call_ended`, optional `agent_end`, `session_start`, `session_end`.
- **Exporters**: file (append NDJSON) and webhook (POST JSON per observation).
- **Sanitization**: depth/string/array limits and key-based redaction for secrets.

## Install

1. **Pacote publicado no npm** (quando `@kaiporalabs/openclaw-observability` estiver no registry):

   ```bash
   openclaw plugins install @kaiporalabs/openclaw-observability
   ```

2. **ClawHub** (se publicar o pacote no ClawHub):

   ```bash
   openclaw plugins install clawhub:@kaiporalabs/openclaw-observability
   ```

3. **Desenvolvimento local**: instale a dependência no mesmo ambiente Node do OpenClaw (por exemplo `npm install` / `pnpm add` no projeto que empacota o gateway) e referencie o plugin pela entrada em `plugins.entries`, ou use o fluxo de plugins por caminho que o seu `openclaw` suportar.

Depois da instalação, **ative o plugin** em `plugins.entries.<id>` e reinicie o gateway se necessário para carregar o novo pacote.

Versão do host: OpenClaw **≥ 2026.5.0** (ver `peerDependencies` em `package.json`).

## Configuration

Enable at least **one** exporter with a valid `path` or `url`.

No arquivo de configuração do OpenClaw, a forma correta é sob **`plugins.entries`** (o id deve coincidir com o do manifest, `openclaw-observability`):

```json
{
  "plugins": {
    "entries": {
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
              "path": "/absolute/path/to/observability.ndjson",
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
  }
}
```

Use um **caminho absoluto** para `exporters.file.path` (ou o que o seu deploy documentar). Não assuma que `${OPENCLAW_STATE_DIR}` em JSON será expandido — confira na [referência de configuração do OpenClaw](https://docs.openclaw.ai/gateway/configuration-reference) se substituição de variáveis se aplica ao campo que você usar.

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
