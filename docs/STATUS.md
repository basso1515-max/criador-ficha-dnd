# Project Status

## Feito

- Editores D&D 5e e 5.5e/2024 funcionais, com exportação para PDF preenchível nas duas edições.
- Contas e salvamento: login/cadastro, login social (Google e Facebook), e-mails de conta, personagens salvos no servidor (Upstash Redis em produção) e migração de personagens 5e → 5.5e.
- Assistente de IA (`criacao.html` → `assistente-ia.html` → editor): exige login, limita gerações por conta, mostra revisão da proposta antes de abrir o editor e salva rascunhos na conta.
- Catálogos oficiais ampliados por edição: espécies/raças e variantes, antecedentes com características oficiais, magias, talentos legados da 5e e opções das expansões 2024, agrupados por compêndio e com carregamento sob demanda.
- Editor 5e legado: seleção opcional das oito Dádivas Sombrias de *Van Richten’s Guide to Ravenloft*, registrada automaticamente nas características da ficha.
- Conteúdo de cenários expandidos adicionados.
- Auditoria de armas e equipamentos 5e/2024 contra os catálogos de referência: pesos de armas e armaduras corrigidos, regras de lança/picareta/tridente alinhadas, conversão de moedas de compras 2024 corrigida e itens ausentes incluídos.
- Identidade visual Sheetfy: home com tema arcano (claro e escuro), fluxo público, conta e admin alinhados, favicon novo e páginas de conta/magias estabilizadas no mobile.
- Qualidade: validação estrutural dos catálogos de recursos de classe, guardrail de Analytics em todos os HTMLs, testes de Bruxo e Artífice 2024 e auditorias de classe dos níveis 1 a 20 em `docs/`.

## Em andamento

## Próximos passos

- Atualizar o `README.md`, que não descreve as expansões e os catálogos adicionados depois da última revisão.
- Quebrar arquivos grandes em módulos menores.
- Ampliar QA visual em desktop e mobile.
