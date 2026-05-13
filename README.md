# Criador de Ficha D&D

Gerador de ficha preenchível de D&D com entradas separadas para `5e` e `5.5e (2024)`.

## Estrutura

- `index.html`: tela inicial com escolha da edição.
- `5e.html`: editor dedicado da versão 5e com geração de PDF.
- `5.5e-2024.html`: prévia dedicada da versão 5.5e/2024.
- `src/`: código da aplicação e módulos de dados.
- `assets/pdf/`: template PDF e configuração de mapeamento usada em runtime.
- `scripts/`: utilitários de desenvolvimento (`serve` e `check`).
- `out/`: saída gerada por utilitários locais, como PDFs de exemplo e logs do servidor. Não faz parte do código-fonte.

## Comandos

- `npm run serve`: sobe o servidor HTTP com API de contas em `http://127.0.0.1:8000`.
- `npm run serve:watchdog`: sobe o servidor e reinicia automaticamente se ele cair.
- `npm run server:install-startup`: instala uma tarefa agendada do Windows para manter o servidor ativo ao fazer login.
- `npm run server:status`: mostra se a tarefa agendada existe e se a API local esta respondendo.
- `npm run server:uninstall-startup`: remove a tarefa agendada.
- `npm run check`: valida a sintaxe dos arquivos `.js` e `.mjs` da aplicação.

## Navegação

- Home: `http://127.0.0.1:8000/`
- Editor 5e: `http://127.0.0.1:8000/5e.html`
- Prévia 5.5e: `http://127.0.0.1:8000/5.5e-2024.html`

## Contas no servidor

O cadastro, login, sessão e personagens salvos ficam no servidor. A sessão usa cookie `HttpOnly`; o navegador não guarda `accountId`, senha, personagens ou banco de contas no `localStorage`. Se houver contas antigas no navegador, elas são migradas uma vez quando o e-mail ainda não existe no servidor; registros conflitantes são ignorados para evitar que um cliente não autenticado altere dados de outra conta.

Os dados ficam em `server-data/accounts.json`, que está no `.gitignore`. Para acesso por outros equipamentos, execute em uma máquina pública ou VPS com disco persistente e defina o host:

```powershell
$env:HOST="0.0.0.0"
$env:PORT="8000"
npm run serve
```

### Segurança da API

O projeto não monta SQL; a API persiste contas por chaves em Redis na Vercel e em JSON no servidor local. Mesmo assim, as rotas de conta validam origem, aceitam corpo apenas em JSON, limitam tamanho de payload, aplicam limites básicos de tentativa para login/cadastro/migração e não mesclam migrações legadas em contas já existentes.

Para publicar na internet, use HTTPS e um ambiente com armazenamento persistente. Deploy estático sem backend persistente não mantém cadastros entre execuções.

### Manter ativo no Windows

Para evitar que login e cadastro parem quando o terminal for fechado, instale o supervisor local:

```powershell
npm run server:install-startup
```

Esse comando registra a tarefa agendada `CriadorFichaDndServer`, inicia o watchdog imediatamente e volta a subir o servidor em `http://127.0.0.1:8000` sempre que o Windows fizer login. Os logs ficam em `out/server-watchdog.log`.

### Vercel

Em produção na Vercel, os endpoints em `api/` usam Upstash Redis. Conecte a integração Upstash Redis pelo Vercel Marketplace para injetar `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN` no projeto. Depois rode:

```powershell
vercel env pull .env.local --yes
vercel dev
```

As mesmas telas usam `/api/account/current`, `/api/accounts/login`, `/api/accounts/register`, `/api/accounts/logout`, `/api/accounts/migrate` e `/api/characters`.
