# Auditoria de classes nível 5

## Escopo e resultado

Esta auditoria cobre classes e subclasses das fichas 5e legacy e 5.5e/2024 no nível 5. O contrato separa recurso textual, decisão persistente e automação numérica ou de magia, para que a mesma regra não seja omitida nem duplicada entre resumo, seletor e PDF.

Status: completo para todas as classes e subclasses cadastradas.

- 5e legacy: 8 das 13 classes declaram recurso textual no nível 5. Bárbaro e Monge têm dois recursos; Bardo, Clérigo, Guerreiro, Ladino, Paladino e Patrulheiro têm um.
- 5e legacy: 4 das 118 subclasses declaram recurso textual no nível 5, todas de Artífice. As demais 114 não recebem recurso direto de subclasse nesse nível.
- 2024: 11 das 12 classes declaram recurso textual no nível 5. Bruxo é a única classe cujo avanço do nível fica apenas em magia, espaços de pacto e invocações.
- 2024: nenhuma das 48 subclasses declara recurso textual no nível 5. As magias de subclasse liberadas nesse marco continuam como fontes automáticas.
- Não existe ASI/talento de classe no nível 5 em nenhuma das edições.
- Não havia checagem solta real de nível 5 no `smoke-dom`. A cobertura completa agora está em `scripts/unit/level-5-audit.test.mjs` e o teste impede que novas checagens pontuais desse nível voltem ao smoke.

## Matriz 5e legacy

| Classe | Nível 5 | Contrato |
| --- | --- | --- |
| Artífice | Sem recurso textual de classe | Especialização, infusões e meia conjuração |
| Bárbaro | Ataque Extra; Movimento Rápido | Texto; ataques e +3 m sem armadura pesada também entram na automação |
| Bardo | Fonte de Inspiração | Texto; recarga muda para descanso curto ou longo |
| Bruxo | Sem recurso textual de classe | 3 invocações, 6 magias conhecidas e 2 espaços de pacto de 3º círculo |
| Clérigo | Destruir Mortos-Vivos (ND 1/2) | Texto; Canalizar Divindade permanece automático |
| Druida | Sem recurso textual de classe | Conjuração e Forma Selvagem permanecem automáticas |
| Feiticeiro | Sem recurso textual de classe | 5 pontos, 2 Metamagias e progressão de magia |
| Guerreiro | Ataque Extra | Texto e automação de ataques |
| Ladino | Esquiva Sobrenatural | Texto; Ataque Furtivo 3d6 é automático |
| Mago | Sem recurso textual de classe | Conjuração, grimório e recuperação |
| Monge | Ataque Extra; Golpe Atordoante | Texto; Ki, dado marcial e movimento são automáticos |
| Paladino | Ataque Extra | Texto; meia conjuração e magias de juramento automáticas |
| Patrulheiro | Ataque Extra | Texto; meia conjuração e escolhas persistentes já abertas |

Subclasses 5e com texto no nível 5:

| Classe | Subclasse | Nível 5 |
| --- | --- | --- |
| Artífice | Alquimista | Alquimia Aprimorada |
| Artífice | Armeiro | Ataque Extra |
| Artífice | Artilheiro | Arma Arcana |
| Artífice | Ferreiro de Batalha | Ataque Extra |

As outras 114 subclasses permanecem corretamente sem entrada textual no nível 5. Isso não significa ausência de avanço: domínios, círculos, juramentos, patronos, origens e arquétipos podem liberar magias automáticas nesse marco.

## Matriz 5.5e/2024

| Classe | Nível 5 | Contrato |
| --- | --- | --- |
| Bárbaro | Ataque Extra; Movimento Rápido | Texto e automação de deslocamento/progressão |
| Bardo | Fonte de Inspiração | Texto; recarga e conversão de espaço ficam no resumo automático |
| Bruxo | Sem recurso textual de classe | 5 invocações, 6 magias preparadas e 2 espaços de pacto de 3º círculo |
| Clérigo | Fulminar Mortos-Vivos | Texto; 2 usos de Canalizar Divindade automáticos |
| Druida | Ressurgimento Selvagem | Texto; usos e formas conhecidas automáticos |
| Feiticeiro | Restauração Feiticeira | Texto; 5 pontos e 2 Metamagias automáticos |
| Guerreiro | Deslocamento Tático; Ataque Extra | Texto; 3 Recuperar Fôlego, 4 maestrias e 2 ataques automáticos |
| Ladino | Golpe Astuto; Esquiva Sobrenatural | Texto; Ataque Furtivo 3d6 automático, sem seletor persistente para escolhas feitas a cada golpe |
| Mago | Memorizar Magia | Texto; troca feita durante descanso, sem campo persistente adicional |
| Monge | Ataque Extra; Golpe Atordoante | Texto; d8 marcial, 5 Foco e +3 m automáticos |
| Paladino | Ataque Extra; Montaria Fiel | Texto; Encontrar Montaria entra automaticamente nas magias |
| Guardião | Ataque Extra | Texto; 3 usos gratuitos de Marca do Predador e meia conjuração automáticos |

As 48 subclasses 2024 não recebem característica textual direta no nível 5. A auditoria cobre separadamente as fontes automáticas de magia de Círculos de Druida, Juramentos de Paladino, Origens de Feiticeiro e Patronos de Bruxo.

## Texto vs seletor vs automação

- Texto: fica no dataset quando o nível concede ou melhora uma característica que precisa aparecer no resumo da classe ou subclasse. A auditoria corrigiu a ausência dos dez recursos de classe 5e e detalhou as quatro características de Artífice que antes eram vagas.
- Seletor: representa apenas decisões persistentes. No nível 5 isso inclui contagens já abertas de infusões, invocações, Metamagias, manobras, runas, tiros arcanos, disciplinas elementais, armas Kensei, Inimigo Favorito e Explorador Nato. Golpe Astuto, Golpe Atordoante e Memorizar Magia não criam seletores permanentes artificiais.
- Automação: cobre espaços e quantidades de magia, pontos, usos, dados, maestrias, ataques, deslocamento, magias concedidas e a Montaria Fiel. A matriz testa 5e e 2024 separadamente.

## Divergências corrigidas

- O dataset 5e não possuía nenhum recurso de classe no nível 5. Foram incluídos Ataque Extra, Movimento Rápido, Fonte de Inspiração, Destruir Mortos-Vivos, Esquiva Sobrenatural e Golpe Atordoante nas oito classes aplicáveis.
- As descrições das quatro especializações de Artífice eram genéricas. Alquimia Aprimorada e Arma Arcana agora registram foco, modificador, tipos de dano e dado adicional; as duas versões de Ataque Extra usam o mesmo contrato da classe.
- O texto 2024 de Movimento Rápido agora explicita o aumento de 3 metros. Fonte de Inspiração, Ressurgimento Selvagem, Fulminar Mortos-Vivos e Golpe Atordoante foram alinhados aos resumos completos usados pela interface.
- Não foi encontrada checagem solta de nível 5 para remover do smoke DOM.

## Arquivos e verificação

- `src/data/5e/classes.js`: dataset atualizado para `0.3.0`, com recursos de classe de nível 5.
- `src/data/5e/subclasses.js`: descrições completas das quatro especializações de Artífice.
- `src/data/5.5e/classes.js` e `src/data/5.5e/feature-summaries.js`: textos 2024 alinhados.
- `scripts/unit/level-5-audit.test.mjs`: matriz completa de texto, seletores, magia e automações das duas edições.
- `scripts/performance-budget.mjs`: tetos de JS inicial recalibrados em 5 KB para 5e e 2 KB para 2024 após medir o crescimento dos dados oficiais.
- `docs/level-5-class-audit.md`: registro da auditoria e dos critérios de modelagem.

## Referências

- [SRD 5.1 da Wizards of the Coast](https://media.wizards.com/2023/downloads/dnd/SRD_CC_v5.1.pdf): progressões e recursos das classes 5e legacy.
- [Artífice em Tasha's Cauldron of Everything](https://www.dndbeyond.com/sources/dnd/tcoe/artificer): progressão da classe e das quatro especializações.
- [Basic Rules 2024 do D&D Beyond](https://www.dndbeyond.com/sources/dnd/br-2024/character-classes): tabelas, recursos e progressões das classes 2024.
