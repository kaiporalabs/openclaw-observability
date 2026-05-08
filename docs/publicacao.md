# Publicação no npm

Este pacote é [**escopado**](https://docs.npmjs.com/about-scopes) (`@kaiporalabs/...`). A primeira publicação precisa ser **pública** (`--access public`), salvo se a org npm for exclusivamente privada.

## Pré-requisitos

1. Conta no [npmjs.com](https://www.npmjs.com/).
2. Permissão de **publicação** na organização `@kaiporalabs` (ou altere o campo `name` em `package.json` para o seu escopo).
3. Node **22+** e npm recente (recomendado).
4. `pnpm check` / `npm run check` (TypeScript) verde antes de publicar.

## Checklist antes do `publish`

- [ ] Versão correta em `package.json` (`version`).
- [ ] Changelog ou tag Git alinhados à versão (opcional, recomendado).
- [ ] `README.md` e `openclaw.plugin.json` atualizados.
- [ ] Teste local do tarball:

  ```bash
  npm pack --dry-run
  ```

  Confira se entram `dist/` (JavaScript compilado), `openclaw.plugin.json`, `README.md`, `LICENSE`.

## Login no npm (uma vez por máquina)

```bash
npm login
```

## Publicar

Na raiz do repositório:

```bash
npm publish --access public
```

**Primeira vez** com escopo `@kaiporalabs`: o `--access public` é obrigatório para pacotes scoped gratuitos.

### Dry-run (sem enviar ao registry)

```bash
npm publish --access public --dry-run
```

## Depois de publicar

Instalação pelos usuários:

```bash
openclaw plugins install @kaiporalabs/openclaw-observability
```

Ou com npm direto no projeto do gateway:

```bash
npm add @kaiporalabs/openclaw-observability
```

Ative em `plugins.entries` conforme o [README principal](../README.md).

## Nova versão (semver)

```bash
npm version patch   # ou minor | major
git push --follow-tags
npm publish --access public
```

Ou edite `version` manualmente, faça commit/tag e rode `npm publish --access public`.

## ClawHub (opcional)

Se usarem [ClawHub](https://docs.openclaw.ai/tools/clawhub) para descoberta além do npm, sigam o fluxo da documentação OpenClaw para `clawhub package publish` após o pacote estar no registry npm.

## Referências OpenClaw

- [Building plugins](https://docs.openclaw.ai/plugins/building-plugins)
- [Plugin manifest](https://docs.openclaw.ai/plugins/manifest)
