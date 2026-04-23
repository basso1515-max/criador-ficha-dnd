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

- `npm run serve`: sobe um servidor HTTP simples em `http://127.0.0.1:8000`.
- `npm run check`: valida a sintaxe dos arquivos `.js` e `.mjs` da aplicação.

## Navegação

- Home: `http://127.0.0.1:8000/`
- Editor 5e: `http://127.0.0.1:8000/5e.html`
- Prévia 5.5e: `http://127.0.0.1:8000/5.5e-2024.html`
