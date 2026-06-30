# Sheetfy

Sheetfy é um criador de personagens de D&D feito em HTML, CSS e JavaScript puro, com foco em montar fichas jogáveis sem transformar a preparação da aventura em uma maratona de planilha.

O projeto nasceu de um sonho bem claro: fazer uma ficha da forma como a WotC planejou que as fichas fossem feitas da forma mais oficial possível. E também para resolver uma dor bem prática: escolher raça/espécie, classe, antecedentes, talentos, magias, equipamentos e detalhes de progressão com ajuda visual, resumo automático e exportação para PDF preenchível.

## O Que Ele Faz

- Cria personagens para D&D 5e tradicional.
- Oferece uma experiência em evolução para D&D 5.5e / regras de 2024.
- Calcula e organiza atributos, proficiências, perícias, recursos de classe, magias, equipamentos e dados de combate.
- Gera uma prévia legível da ficha durante o preenchimento.
- Exporta a ficha preenchida para PDF.
- Permite salvar personagens em conta local/servidor.
- Inclui fluxo de migração de personagens da 5e para a 5.5e.
- Tem assistente de avanço de nível, multiclasse e escolhas guiadas.

## Por Que Esse Projeto Existe

Criar personagem é uma das partes mais divertidas de D&D, mas também pode virar um labirinto de abas abertas, anotações soltas e dúvidas pequenas que quebram o ritmo. A ideia deste app é deixar a parte burocrática mais leve:

- você escolhe as opções;
- o app mostra o impacto na ficha;
- as pendências aparecem no resumo;
- no fim, você sai com um PDF pronto para jogar.

A meta não é substituir a mesa, o livro ou a conversa com o mestre. É tirar peso operacional do caminho para sobrar mais energia para personagem, história e jogo.

## Edições Disponíveis

### D&D 5e

Editor mais completo do projeto no momento.

Inclui criação de personagem, escolhas de classe/subclasse, magias, equipamentos, aleatorização, salvamento em conta e geração de PDF.

### D&D 5.5e / 2024

Editor baseado nas regras de 2024, com recursos em expansão contínua.

Já possui criação guiada, espécies, antecedentes, classes, talentos, magias, pacotes iniciais, avanço de nível, migração a partir da 5e e geração de PDF 5.5e. Ainda assim, esta parte deve ser tratada como uma área em amadurecimento.

## Principais Telas

- `index.html`: tela inicial e escolha da edição.
- `5e.html`: editor de D&D 5e com exportação para PDF.
- `5.5e-2024.html`: editor de D&D 5.5e / 2024.
- `conta.html`: entrada e criação de conta.
- `minha-conta.html`: gerenciamento de conta, personagens salvos e migração.

## Estrutura Do Projeto

```text
.
├── api/                  # Rotas serverless usadas na Vercel
├── assets/pdf/           # Templates PDF e mapas de campos
├── scripts/              # Servidor local, validações e utilitários
├── server-data/          # Dados locais ignorados pelo Git
├── src/                  # Aplicação, estilos e catálogos de dados
│   ├── data/             # Catálogos de regras e opções
│   ├── editors/          # Motores dos editores 5e e 2024, divididos por edição
│   ├── shared/           # Utilitários compartilhados entre editores
│   └── styles/           # CSS dividido por área do produto
├── 5e.html               # Editor 5e
├── 5.5e-2024.html        # Editor 5.5e / 2024
├── conta.html            # Login/cadastro
├── index.html            # Home
├── minha-conta.html      # Área do usuário
└── vercel.json           # Configuração de deploy
```

## Tecnologias

- HTML, CSS e JavaScript puro.
- `pdf-lib` para preencher e gerar PDFs.
- `pdfjs-dist` e `pdf-parse` em utilitários de PDF.
- API serverless na Vercel.
- Upstash Redis em produção.
- Armazenamento JSON local para desenvolvimento.

## Identidade De Marca E Deploy

A separação entre marca pública e identidade de deploy é intencional:

- `Sheetfy` é a marca pública. Use esse nome em títulos HTML, textos de interface, remetentes/assuntos de e-mail de conta e cadastros públicos de OAuth.
- `https://sheetfy.vercel.app` é o domínio público canônico. Use esse domínio em `ACCOUNT_PUBLIC_BASE_URL`, links de e-mail e callbacks de OAuth em produção.
- `criador-ficha-dnd` é a identidade de infraestrutura: slug do repositório, projeto Vercel canônico e guardrails de deploy. Não use esse slug como marca pública, título HTML, nome de app OAuth ou URL pública de e-mail.
- `https://criador-ficha-dnd.vercel.app`, se existir, é apenas alias técnico do projeto Vercel e deve redirecionar para o domínio público `https://sheetfy.vercel.app`.

## Organização Do Frontend

Os entrypoints mantidos para compatibilidade com o HTML são:

- `src/script.js`: carrega o editor D&D 5e.
- `src/script-2024.js`: carrega o editor D&D 5.5e / 2024.

Os motores principais vivem em:

- `src/editors/5e/main.js`: fluxo do editor D&D 5e.
- `src/editors/2024/main.js`: fluxo do editor D&D 5.5e / 2024.

Cada motor foi quebrado em módulos por responsabilidade:

- `main.js`: orquestra estado, leitura do formulário, renderização e exportação.
- `static-options.js`: listas simples de opções, rótulos e valores fixos.
- `rules-config.js`: tabelas de XP, slots, conjuração, perícias, idiomas, moedas e regras gerais.
- `feature-config.js`: escolhas guiadas de classe, subclasse, companheiros e magias concedidas.
- `class-progressions.js`: progressões estáticas específicas do editor 2024.
- `default-pdf-map.js`: fallback do mapa de campos do PDF 5e.

Para reduzir duplicação entre os editores, utilitários compartilhados ficam em `src/shared/`, como helpers de texto e layout de PDF. As validações em `scripts/check.mjs` leem os módulos de cada edição como um conjunto, então as checagens estruturais continuam cobrindo os motores mesmo depois da separação.

As entradas CSS são separadas por superfície para manter o carregamento inicial enxuto: `src/styles/editor.css` atende os editores, `src/styles/home.css` atende a home, `src/styles/account.css` cobre conta, usuário, admin e páginas legais, e `src/styles/community-stats.css` cobre estatísticas. `src/style.css` fica apenas como índice legado e não deve voltar para os HTMLs públicos.

## Rodando Localmente

Instale as dependências:

```powershell
npm install
```

Suba o servidor local:

```powershell
npm run serve
```

Acesse:

- Home: `http://127.0.0.1:8000/`
- Editor 5e: `http://127.0.0.1:8000/5e.html`
- Editor 5.5e: `http://127.0.0.1:8000/5.5e-2024.html`
- Minha conta: `http://127.0.0.1:8000/minha-conta.html`

## Scripts Úteis

```powershell
npm run check
```

Valida a sintaxe dos arquivos `.js` e `.mjs` e roda checagens estruturais dos catálogos e motores de regra.

```powershell
npm run perf:budget
```

Valida o orçamento de carregamento inicial dos editores, somando os imports estáticos de JS/CSS e bloqueando catálogos pesados que devem continuar sob demanda, como magias, resumos de recursos 2024 e `pdf-lib`.

```powershell
npm run test:unit
```

Roda testes unitários pequenos para funções puras de regras e dados das edições 5e e 2024: proficiência, slots de magia, HP, maestria em arma e migração/normalização de snapshots.

```powershell
npm run smoke:dom
```

Executa um smoke test das principais telas e fluxos de DOM.

```powershell
npm run test:e2e
```

Executa um teste de fluxo real da API local: cadastro, sessão, salvamento, overwrite, migração 5e para 5.5e, exclusão de personagem, troca de senha e exclusão de conta.

```powershell
npm run test:pdf
```

Executa os E2Es de exportação para PDF nas duas edições. O teste 5e cobre Artífice com Armadura Resistente; o teste 2024 cobre maestrias de arma e magias concedidas do Druida do Círculo da Terra.

Também é possível rodar cada edição separadamente:

```powershell
npm run test:pdf:5e
npm run test:pdf:2024
```

```powershell
npm test
```

Roda a bateria principal: validação estrutural, orçamento de performance inicial, testes unitários, smoke DOM, E2E de conta/API e E2E de PDF das duas edições.

Os testes de DOM/PDF usam Chrome ou Edge em modo headless. Se o executável não for encontrado automaticamente, defina `CHROME_PATH` conforme o exemplo em `.env.example`.

Para evitar que o GitHub CI quebre depois de um `Commit & Sync`, ative o hook local de pre-push:

```powershell
npm run hooks:install
```

Depois disso, qualquer push feito pelo VS Code ou pelo terminal roda `npm test` antes de enviar commits. Se a suíte falhar, o push é bloqueado localmente e o log mostra o mesmo tipo de erro que apareceria no GitHub Actions.

```powershell
npm run serve:watchdog
```

Mantém o servidor local ativo e reinicia automaticamente se ele cair.

```powershell
npm run server:install-startup
```

Instala uma tarefa agendada do Windows para iniciar o servidor ao fazer login.

```powershell
npm run server:status
```

Mostra se a tarefa agendada existe e se a API local está respondendo.

## Contas E Salvamento

O projeto salva personagens no servidor, não no `localStorage` do navegador. A sessão usa cookie `HttpOnly`.

No desenvolvimento local, os dados ficam em:

```text
server-data/accounts.json
```

Esse arquivo é ignorado pelo Git.

Os personagens são persistidos com versionamento de snapshot:

```json
{
  "schemaVersion": 1,
  "dados": {}
}
```

Ao carregar uma ficha, o app passa o snapshot por `src/shared/character-schema.js`, que migra formatos antigos antes de entregar os dados ao editor. Novas mudanças de formato devem adicionar uma migração nesse módulo.

Para rodar uma instância isolada sem tocar nos dados locais padrão, use:

```powershell
$env:SERVER_DATA_DIR="C:\caminho\temporario\server-data"
npm run serve
```

Em produção na Vercel, as rotas em `api/` usam Upstash Redis. Configure as variáveis abaixo no ambiente:

```text
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

Também há compatibilidade com os nomes:

```text
KV_REST_API_URL
KV_REST_API_TOKEN
```

### Administradores

O primeiro acesso administrativo é definido por variável de ambiente, não por e-mail fixo no código. Configure uma lista separada por vírgulas:

```text
ADMIN_EMAILS=admin@example.com,outro-admin@example.com
```

Quando uma conta é criada ou carregada com e-mail listado em `ADMIN_EMAILS`, ela recebe papel `admin` e não pode ter esse papel removido enquanto continuar na lista. Contas já salvas com `role: "admin"` continuam administradoras mesmo que a lista mude; para revogar uma conta existente, remova o e-mail da variável e altere o papel pelo painel admin. O alias legado `ACCOUNT_ADMIN_EMAILS` ainda é aceito por compatibilidade.

### E-mails De Conta

Recuperação de senha e validação de conta usam links enviados por e-mail. O envio é feito pela API HTTP do Resend; configure:

```text
RESEND_API_KEY
ACCOUNT_EMAIL_FROM
ACCOUNT_EMAIL_NAME
ACCOUNT_PUBLIC_BASE_URL
```

`ACCOUNT_PUBLIC_BASE_URL` define a URL pública usada nos links e callbacks de OAuth. Fora de `localhost`, ela é obrigatória e, em produção, deve apontar para `https://sheetfy.vercel.app`, não para o slug do projeto Vercel. Sem `RESEND_API_KEY` ou remetente, o cadastro e a recuperação continuam funcionando, mas o servidor apenas registra aviso nos logs. `ACCOUNT_EMAIL_DEBUG_RESPONSE=1` existe só para testes locais e não deve ser usado em produção.
Use `ACCOUNT_EMAIL_NAME=Sheetfy` para que remetente e assuntos dos e-mails de conta carreguem a marca pública.

### Login Social

O app também oferece login com Google e Facebook via OAuth. Configure, no painel de cada provedor, a URL de callback. Em produção, o callback usa o domínio público da marca mesmo que o projeto Vercel canônico seja `criador-ficha-dnd`:

```text
http://127.0.0.1:8000/api/accounts/oauth/callback
https://sheetfy.vercel.app/api/accounts/oauth/callback
```

Nos cadastros públicos dos aplicativos de OAuth, especialmente Google e Facebook, use `Sheetfy` como nome do app/produto para que a tela de consentimento acompanhe a marca do site.

Variáveis aceitas:

```text
GOOGLE_OAUTH_CLIENT_ID
GOOGLE_OAUTH_CLIENT_SECRET
FACEBOOK_OAUTH_CLIENT_ID
FACEBOOK_OAUTH_CLIENT_SECRET
FACEBOOK_GRAPH_VERSION
ACCOUNT_PUBLIC_BASE_URL
```

Na página do usuário, provedores sociais vinculados podem ser desvinculados com segurança. Contas com senha precisam confirmar a senha atual; contas somente sociais só podem remover um provedor se outro provedor social permanecer ativo ou depois de definir uma senha.

## Deploy Na Vercel

O projeto Vercel canônico de produção é `criador-ficha-dnd` (`prj_loq25T1SeNYEx5LkJn12UQ5EBQmo`) e a produção deve sair somente da Git Integration desse projeto na branch `main`. Essa identidade de infraestrutura não muda a marca pública `Sheetfy` nem o domínio público `https://sheetfy.vercel.app`. Antes de publicar, conecte um Redis persistente ao projeto e configure as variáveis `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN` no ambiente da Vercel. Depois, valide localmente:

```powershell
vercel env pull .env.local --yes
vercel dev
npm test
npm audit --omit=dev
```

Publique produção com `git push origin main` e deixe a Git Integration criar o deploy. O repositório versiona `.vercel/project.json` de propósito para que `npm run deploy:guardrails` e o CI falhem se a metadata local sair do projeto canônico ou se o fluxo voltar a sugerir produção manual ambígua.

O repositório consegue validar metadata local, branch permitida e ausência de comandos de deploy manual no CI. A verificação de que nenhum outro projeto Vercel está conectado ao mesmo repositório/branch depende do painel ou da API da Vercel e deve ser conferida fora do código antes de mudanças de infraestrutura.

As telas consomem estas rotas:

- `/api/account/current`
- `/api/accounts/login`
- `/api/accounts/register`
- `/api/accounts/logout`
- `/api/accounts/migrate` (desativada para importação pública de contas legadas)
- `/api/accounts/oauth/start`
- `/api/accounts/oauth/callback`
- `/api/accounts/oauth/providers`
- `/api/account/current/auth-providers`
- `/api/characters`
- `/api/community-stats`

## Segurança

Alguns cuidados já implementados:

- senha com hash `scrypt` para contas novas;
- migração de hashes legados quando possível;
- cookie de sessão `HttpOnly` e `SameSite=Lax`;
- validação de origem para rotas sensíveis;
- limite de tamanho de payload;
- rate limit básico para login, cadastro e migração;
- armazenamento persistente fora do navegador.

Para publicar na internet, use HTTPS e revise as variáveis de ambiente antes do deploy.

Veja também:

- [Checklist de produção](docs/production-hardening.md)
- [Modelo simples de política de privacidade](docs/privacy-policy-template.md)

## Status Do Projeto

O projeto já é funcional para uso local, testes fechados e preparação de deploy com Redis persistente. A parte 5e está mais madura; a parte 5.5e/2024 já cobre criação, migração, maestrias, magias e exportação para PDF, mas ainda é o principal território de evolução.

Próximos pontos naturais:

- revisar cobertura e atribuição de conteúdo SRD;
- ampliar QA visual em desktop e mobile;
- quebrar arquivos grandes em módulos menores;
- definir licença do código e política final de uso de dados antes de distribuição pública.

## Nota Sobre Conteúdo E Marcas

Este é um projeto independente, feito para estudo, uso pessoal e apoio de mesa. Ele não é afiliado, endossado ou patrocinado pela Wizards of the Coast.

Dungeons & Dragons, D&D e nomes relacionados pertencem aos seus respectivos detentores. Ao publicar, distribuir ou adaptar este projeto, revise cuidadosamente as regras de uso de marca, conteúdo SRD, OGL/Creative Commons e qualquer material que não esteja coberto por licença aberta.

## Licença

Ainda não há uma licença definida para o código do projeto. Antes de redistribuir, publicar como pacote ou aceitar contribuições externas, vale escolher uma licença para o código e documentar separadamente a origem/licença dos dados de regras usados pelo app.
