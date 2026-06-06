# Auditoria de classes nivel 19

Atualizado em 2026-06-06.

Esta validacao foi criada porque a auditoria de nivel 20 nao cobria o nivel 19 classe por classe. Ela so tocava o nivel 19 em testes de multiclasse e no salto de capstone de Barbaro/Monge.

## Resultado geral

Status atual: completo para as classes cadastradas.

- 5e legacy: nivel 19 nao e recurso textual de classe nos dados locais. Ele e tratado pelo fluxo de Aumento de Atributo / talento opcional. O smoke DOM valida os totais de slots: padrao com 5, Guerreiro com 7 e Ladino com 6.
- 2024: todas as 12 classes cadastradas declaram `Dadiva Epica` no nivel 19. O smoke DOM valida que cada classe abre exatamente 1 slot de Dadiva Epica / talento e lista as dadivas epicas cadastradas.
- Contas 5e: magias, espacos, invocacoes, infusoes, Inimigo Favorito, Explorador Nato, Metamagia, manobras, Tiro Arcano, Disciplinas Elementais e armas Kensei foram fixadas no teste unitario.
- Contas 2024: magias preparadas/conhecidas, espacos, furia, inspiracao, Canalizar Divindade, Forma Selvagem, pontos de feiticaria, Ataque Furtivo, Inimigo Favorito, maestrias, Invocacoes Misticas e progressao de Guerreiro/Monge foram fixadas no teste unitario.

## Matriz 5e

| Caminho | Nivel 19 | Validacao |
| --- | --- | --- |
| Classes padrao | ASI / talento opcional | 5 slots totais em Barbaro nivel 19, incluindo `asi-19`. |
| Guerreiro | ASI / talento opcional extra | 7 slots totais em Guerreiro nivel 19, incluindo `asi-19`. |
| Ladino | ASI / talento opcional extra | 6 slots totais em Ladino nivel 19, incluindo `asi-19`. |
| Dados de classe | Sem recurso textual no nivel 19 | Teste unitario garante que nenhuma classe 5e declara feature textual no nivel 19. |

## Matriz 2024

Todas as classes abaixo declaram `Dadiva Epica` no nivel 19 e abrem 1 slot de Dadiva Epica / talento no DOM:

| Classe | Nivel 19 |
| --- | --- |
| Barbaro | Dadiva Epica |
| Bardo | Dadiva Epica |
| Bruxo | Dadiva Epica |
| Clerigo | Dadiva Epica |
| Druida | Dadiva Epica |
| Feiticeiro | Dadiva Epica |
| Guerreiro | Dadiva Epica |
| Ladino | Dadiva Epica |
| Mago | Dadiva Epica |
| Monge | Dadiva Epica |
| Paladino | Dadiva Epica |
| Guardiao | Dadiva Epica |

## Melhorias aplicadas

- `scripts/unit/level-19-audit.test.mjs`: nova matriz de nivel 19 para dados, contas e recursos.
- `scripts/smoke-dom.mjs`: valida slots de ASI/talento 5e no nivel 19 e slot de Dadiva Epica 2024 para todas as classes.
