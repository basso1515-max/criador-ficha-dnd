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
- `npm run check`: valida a sintaxe dos arquivos `.js` e `.mjs` da aplicação.

## Navegação

- Home: `http://127.0.0.1:8000/`
- Editor 5e: `http://127.0.0.1:8000/5e.html`
- Prévia 5.5e: `http://127.0.0.1:8000/5.5e-2024.html`

## Contas no servidor

O cadastro, login, sessão e personagens salvos ficam no servidor. A sessão usa cookie `HttpOnly`; o navegador não guarda `accountId`, senha, personagens ou banco de contas no `localStorage`. Se houver contas antigas no navegador, elas são migradas uma vez para o servidor e removidas do armazenamento local.

Os dados ficam em `server-data/accounts.json`, que está no `.gitignore`. Para acesso por outros equipamentos, execute em uma máquina pública ou VPS com disco persistente e defina o host:

```powershell
$env:HOST="0.0.0.0"
$env:PORT="8000"
npm run serve
```

Para publicar na internet, use HTTPS e um ambiente com armazenamento persistente. Deploy estático sem backend persistente não mantém cadastros entre execuções.

### Vercel

Em produção na Vercel, os endpoints em `api/` usam Upstash Redis. Conecte a integração Upstash Redis pelo Vercel Marketplace para injetar `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN` no projeto. Depois rode:

```powershell
vercel env pull .env.local --yes
vercel dev
```

As mesmas telas usam `/api/account/current`, `/api/accounts/login`, `/api/accounts/register`, `/api/accounts/logout`, `/api/accounts/migrate` e `/api/characters`.
