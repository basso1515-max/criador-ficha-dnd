# Habilidades A Aprofundar Com Base Nos PRs

Analise feita em 2026-06-05 sobre os PRs `#1`, `#2`, `#3`, `#4` e `#5` do repositorio `basso1515-max/criador-ficha-dnd`.

## Atualizacao De Execucao

- `#2` e `#4` foram fechados em 2026-06-05 como duplicados/obsoletos do `#3`, que ja tinha instalado o Vercel Web Analytics.
- `#5` foi fechado em 2026-06-05 como obsoleto. A branch ainda mirava `codex/user-accounts-saves` e o diff contra `main` reverteria partes atuais do projeto, incluindo admin, testes, docs e a arquitetura dividida dos editores.
- A funcionalidade central do `#5` ja existe em `main`: `src/data/warlock-invocations.js`, paineis de Invocacoes Misticas em `5e.html` e `5.5e-2024.html`, validacoes em `scripts/check.mjs` e cobertura em `scripts/smoke-dom.mjs`/e2e PDF.
- Foi adicionada cobertura unitária dedicada em `scripts/unit/warlock-invocations.test.mjs` para contratos de catalogo, progressao, prerequisitos e filtros de opcoes.
- `scripts/check.mjs` passou a validar os catalogos `FEATURE_CHOICE_DEFINITIONS_5E` e `FEATURE_CHOICE_DEFINITIONS_2024`, incluindo vinculo com classes/subclasses existentes, campos obrigatorios, options/optionSet e tabelas por nivel.
- `scripts/unit/feature-config.test.mjs` agora tambem cobre o contrato estrutural desses catalogos de escolhas de recurso na suite unitária.

## Evidencias Usadas

- `#1` (`[codex] Add local account character saves`) juntou area do usuario, contas locais, persistencia de personagens e parte das escolhas de Bruxo. O PR terminou com `+1639/-11647`, tocou `src/account-storage.js`, `src/script.js`, `src/script-2024.js`, dados de classe e arquivos temporarios removidos.
- `#5` (`Add warlock invocation choices`) esta aberto, baseado em `codex/user-accounts-saves`, com `+2771/-25`. O tema e regras de classe orientadas por catalogo, mas o PR tambem mexe em HTML, `scripts/check.mjs`, dados e dois editores.
- `#3` (`Install Vercel Web Analytics`) foi mesclado e adicionou Analytics em quatro HTMLs que existiam no fluxo principal da epoca. Depois o projeto ganhou paginas como `admin.html`, `estatisticas.html`, `minha-conta.html`, `privacidade.html`, `termos.html` e `usuario.html`.
- `#2` e `#4` continuam abertos com tema duplicado de Vercel Analytics, enquanto `#3` ja foi mesclado.
- Os PRs analisados nao tem revisoes humanas registradas; os comentarios visiveis sao comentarios automaticos da Vercel com preview/deploy.

## Proximas Habilidades

1. **Arquitetura de regras orientada por dados para features de classe**

   Evidencia: `#5` concentra invocacoes, pactos, validacao estrutural, UI 5e/2024 e exportacao em um unico PR grande. Isso indica que o proximo aprofundamento deve ser transformar novas escolhas de classe em dados pequenos, validadores e adaptadores de UI por edicao.

   Executado: `scripts/check.mjs` e `scripts/unit/feature-config.test.mjs` agora falham cedo quando uma escolha de recurso referencia classe/subclasse ausente, mistura `options` e `optionSet`, omite campos obrigatorios, duplica ids ou usa `picksByLevel` fora do contrato de niveis 0 a 20.

2. **Observabilidade com cobertura de paginas**

   Evidencia: `#3` instalou Analytics nas paginas existentes naquele momento, mas a superficie HTML cresceu depois. O projeto ja estava manualmente coberto, porem faltava um guardrail para nao regredir.

   Executado agora: `scripts/check.mjs` valida que todo HTML raiz carrega exatamente uma vez `./src/analytics.js` como `type="module"` e `defer`.

3. **Higiene de PR e qualidade de revisao**

   Evidencia: os PRs tem comentarios automaticos de deploy, mas nenhuma revisao humana registrada. Alem disso, `#5` declara apenas `npm run check` como validacao para uma mudanca grande de fluxo.

   Executado agora: `.github/pull_request_template.md` pede evidencia do historico, tema recorrente, superficies afetadas, riscos, validacao e pontos para review. A ideia e fazer cada PR carregar o contexto que hoje precisei reconstruir via GitHub.

4. **Gestao de PRs obsoletos e base branch**

   Evidencia: `#2` e `#4` parecem duplicar o Analytics ja mesclado em `#3`; `#5` ainda mira `codex/user-accounts-saves`, embora `#1` ja tenha sido mesclado em `main`.

   Executado: `#2`, `#4` e `#5` foram fechados. Para `#5`, a decisao foi nao recriar um PR limpo porque o `main` ja contem a funcionalidade de Bruxo em uma arquitetura mais atual e testada.

5. **Validador antes de feature, nao depois**

   Evidencia: `#5` adicionou `Add warlock structural validation` como commit separado apos a primeira implementacao. Esse e um bom sinal, mas o padrao pode ficar ainda melhor se o validador nascer antes ou junto com o catalogo.

   Executado: alem da validacao estrutural em `scripts/check.mjs`, o catalogo de Bruxo agora tem teste unitario dedicado cobrindo duplicidade, referencias ausentes, progressao por nivel, Arcanum Mistico e filtros por pacto, truque e invocacao previa.
