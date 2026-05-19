# Criador de Ficha D&D

Um criador de personagens de D&D feito em HTML, CSS e JavaScript puro, com foco em montar fichas jogáveis sem transformar a preparação da aventura em uma maratona de planilha.

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
npm run smoke:dom
```

Executa um smoke test das principais telas e fluxos de DOM.

```powershell
npm run test:e2e
```

Executa um teste de fluxo real da API local: cadastro, sessão, salvamento, overwrite, migração 5e para 5.5e, exclusão de personagem, troca de senha e exclusão de conta.

```powershell
npm test
```

Roda a bateria principal: validação estrutural, smoke DOM e E2E de conta/API.

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

## Deploy Na Vercel

Depois de conectar um Redis persistente ao projeto:

```powershell
vercel env pull .env.local --yes
vercel dev
```

As telas consomem estas rotas:

- `/api/account/current`
- `/api/accounts/login`
- `/api/accounts/register`
- `/api/accounts/logout`
- `/api/accounts/migrate`
- `/api/characters`

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

O projeto já é funcional para uso local e testes fechados. A parte 5e está mais madura; a parte 5.5e/2024 já tem bastante coisa pronta, mas ainda é o principal território de evolução.

Próximos pontos naturais:

- revisar cobertura e atribuição de conteúdo SRD;
- ampliar testes end-to-end de conta, migração e PDF;
- melhorar documentação de deploy;
- quebrar arquivos grandes em módulos menores;
- fazer uma rodada forte de QA visual em desktop e mobile.

## Nota Sobre Conteúdo E Marcas

Este é um projeto independente, feito para estudo, uso pessoal e apoio de mesa. Ele não é afiliado, endossado ou patrocinado pela Wizards of the Coast.

Dungeons & Dragons, D&D e nomes relacionados pertencem aos seus respectivos detentores. Ao publicar, distribuir ou adaptar este projeto, revise cuidadosamente as regras de uso de marca, conteúdo SRD, OGL/Creative Commons e qualquer material que não esteja coberto por licença aberta.

## Licença

Ainda não há uma licença definida para o código do projeto. Antes de redistribuir, publicar como pacote ou aceitar contribuições externas, vale escolher uma licença para o código e documentar separadamente a origem/licença dos dados de regras usados pelo app.
