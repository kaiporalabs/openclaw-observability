# Changelog

Todas as alterações notáveis neste projeto serão documentadas aqui.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/), e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.1.3] - 2026-05-07

### Corrigido

- Entrada do plugin alinhada ao [@kaiporalabs/openclaw-memory-zvec](https://www.npmjs.com/package/@kaiporalabs/openclaw-memory-zvec): **`src/index.ts`** (sem `index.ts` na raiz do pacote), evitando que o validador OpenClaw trate `./index.ts` como entrada TypeScript órfã.
- **`main`** e **`types`** apontam para `./dist/index.js` e `./dist/index.d.ts` (como no memory-zvec).
- `tsconfig` com `rootDir: src`, declarações `.d.ts` e maps de declaração.

## [1.1.2] - 2026-05-07

### Corrigido

- Pacote publicado com **runtime JavaScript**: `npm run build` gera `dist/`; `openclaw.extensions` aponta para `./dist/index.js`. O instalador OpenClaw exige entrada compilada (não apenas `.ts`).

### Alterado

- `files` do npm inclui `dist/` em vez de fontes TypeScript; `prepublishOnly` executa o build automaticamente.

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

[1.1.3]: https://github.com/kaiporalabs/openclaw-observability/compare/v1.1.2...v1.1.3
[1.1.2]: https://github.com/kaiporalabs/openclaw-observability/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/kaiporalabs/openclaw-observability/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/kaiporalabs/openclaw-observability/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/kaiporalabs/openclaw-observability/releases/tag/v1.0.0
