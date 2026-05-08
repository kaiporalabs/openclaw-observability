# Changelog

Todas as alterações notáveis neste projeto serão documentadas aqui.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/), e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.1.1] - 2026-05-06

### Adicionado

- Metadados de build OpenClaw em `package.json`: `openclaw.build.openclawVersion` e `openclaw.build.pluginSdkVersion` (versão alinhada ao pacote `openclaw` em dev).
- `openclaw.compat.minGatewayVersion` conforme o guia [Building plugins](https://docs.openclaw.ai/plugins/building-plugins).

## [1.1.0] - 2026-05-06

### Alterado

- **Id do plugin** no manifesto e no código: de `openclaw-observability` para `kaiporalabs-observability`. Atualize a chave em `plugins.entries` no `openclaw.json` após atualizar o pacote.
- Nome de exibição no manifesto: **KaiporaLabs OpenClaw Observability**.
- Mensagens de log e erros de validação passam a usar o prefixo `kaiporalabs-observability`.
- Documentação (`README`) alinhada ao novo id e ao campo `pluginId` nos eventos.

## [1.0.0] - 2026-05-06

### Adicionado

- Lançamento inicial: hooks configuráveis, exportadores ficheiro (NDJSON) e webhook, sanitização de dados.

[1.1.1]: https://github.com/kaiporalabs/openclaw-observability/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/kaiporalabs/openclaw-observability/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/kaiporalabs/openclaw-observability/releases/tag/v1.0.0
