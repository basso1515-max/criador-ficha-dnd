# Auditoria de classes nivel 8

Atualizado em 2026-06-18.

Esta validacao cobre as fichas 5e legacy e 5.5e/2024 no nivel 8. O foco foi conferir recurso textual, escolha persistente, automacao, progressao de magia e divergencias contra o fluxo oficial esperado para cada classe e subclasse.

## Resultado geral

Status atual: completo para as classes e subclasses cadastradas.

- 5e legacy: 2 das 13 classes declaram recurso textual no nivel 8: Druida e Patrulheiro. Todas as 13 tambem recebem ASI/talento por seletor; Guerreiro e Ladino usam progressoes proprias e as demais classes usam a progressao padrao.
- 5e legacy: 14 das 118 subclasses declaram recurso textual no nivel 8, todas de Clerigo. As demais 104 subclasses nao declaram recurso textual nesse nivel.
- 2024: as 12 classes declaram Aumento no Valor de Atributo no nivel 8. O recurso abre o seletor de talento geral/ASI e e omitido do texto duplicado no PDF.
- 2024: nenhuma das 48 subclasses declara recurso textual no nivel 8, em conformidade com as tabelas de progressao.
- Selecao 5e: Patrulheiro mantem 2 Inimigos Favoritos e 2 terrenos de Explorador Nato; Feiticeiro mantem 2 Metamagias; Mestre de Batalha fica com 5 manobras; Arqueiro Arcano com 3 tiros; Quatro Elementos com 2 disciplinas; Kensei com 3 armas.
- Selecao 2024: Feiticeiro mantem 2 Metamagias; Mestre de Batalha fica com 5 manobras; Bruxo ainda nao recebe Arcana Mistica.
- Contas 5e e 2024: magias, espacos, recursos por descanso, dados, pontos, invocacoes e demais progressoes numericas foram fixados no teste unitario.
- Propagacao: nao havia checagem solta real de nivel 8 no `smoke-dom`; o contrato de texto vs seletor vs automacao agora fica em `scripts/unit/level-8-audit.test.mjs`.

## Matriz 5e

Classes base 5e no nivel 8:

| Classe | Nivel 8 | Contrato |
| --- | --- | --- |
| Artifice | Sem recurso textual | ASI/talento e meia conjuracao |
| Barbaro | Sem recurso textual | ASI/talento e automacao de Furia |
| Bardo | Sem recurso textual | ASI/talento e conjuracao conhecida |
| Bruxo | Sem recurso textual | ASI/talento, Magia de Pacto e invocacoes |
| Clerigo | Sem recurso textual de classe | ASI/talento; subclasses trazem o recurso de dominio |
| Druida | Aprimoramento de Forma Selvagem | Texto de classe, ASI/talento e automacao de Forma Selvagem |
| Feiticeiro | Sem recurso textual | ASI/talento, conjuracao e Metamagia |
| Guerreiro | Sem recurso textual | ASI/talento pela progressao especial e automacao marcial |
| Ladino | Sem recurso textual | ASI/talento pela progressao especial e Ataque Furtivo |
| Mago | Sem recurso textual | ASI/talento e conjuracao preparada |
| Monge | Sem recurso textual | ASI/talento e automacao de Ki/Artes Marciais |
| Paladino | Sem recurso textual | ASI/talento, meia conjuracao e magias de juramento |
| Patrulheiro | Passo da Terra | Texto de classe, ASI/talento, meia conjuracao e seletores persistentes |

Subclasses 5e com recurso textual no nivel 8:

| Classe | Subclasse | Nivel 8 |
| --- | --- | --- |
| Clerigo | Dominio Arcano | Potencia Divina |
| Clerigo | Dominio da Enganacao | Ataque Divino |
| Clerigo | Dominio da Forja | Ataque Divino |
| Clerigo | Dominio da Guerra | Ataque Divino |
| Clerigo | Dominio da Luz | Potencia Divina |
| Clerigo | Dominio da Morte | Ataque Divino |
| Clerigo | Dominio da Natureza | Ataque Divino |
| Clerigo | Dominio da Ordem | Ataque Divino |
| Clerigo | Dominio da Paz | Potencia Divina |
| Clerigo | Dominio da Sepultura | Conjuracao Potente |
| Clerigo | Dominio da Tempestade | Ataque Divino |
| Clerigo | Dominio da Vida | Ataque Divino |
| Clerigo | Dominio do Conhecimento | Potencia Divina |
| Clerigo | Dominio do Crepusculo | Potencia Divina |

Todas as demais subclasses 5e foram verificadas como sem recurso textual no nivel 8.

## Matriz 2024

Classes base 2024 no nivel 8:

| Classe | Nivel 8 | Contrato |
| --- | --- | --- |
| Barbaro | Aumento no Valor de Atributo | Seletor de talento/ASI e automacao de Furia/Maestria |
| Bardo | Aumento no Valor de Atributo | Seletor de talento/ASI, conjuracao e Inspiracao |
| Bruxo | Aumento no Valor de Atributo | Seletor de talento/ASI, Magia de Pacto e invocacoes |
| Clerigo | Aumento no Valor de Atributo | Seletor de talento/ASI, conjuracao e Canalizar Divindade |
| Druida | Aumento no Valor de Atributo | Seletor de talento/ASI, conjuracao e Forma Selvagem |
| Feiticeiro | Aumento no Valor de Atributo | Seletor de talento/ASI, conjuracao, pontos e Metamagia |
| Guerreiro | Aumento no Valor de Atributo | Seletor de talento/ASI e progressao marcial |
| Ladino | Aumento no Valor de Atributo | Seletor de talento/ASI e Ataque Furtivo |
| Mago | Aumento no Valor de Atributo | Seletor de talento/ASI e conjuracao preparada |
| Monge | Aumento no Valor de Atributo | Seletor de talento/ASI e progressao de Foco |
| Paladino | Aumento no Valor de Atributo | Seletor de talento/ASI, meia conjuracao e Canalizar Divindade |
| Guardiao | Aumento no Valor de Atributo | Seletor de talento/ASI, meia conjuracao e Inimigo Favorito |

Todas as 48 subclasses 2024 foram verificadas como sem recurso textual no nivel 8.

## Texto, seletor e automacao

- Texto: permanece no dataset quando o nivel concede ou melhora uma caracteristica que precisa aparecer no resumo da classe ou subclasse. Isso cobre Aprimoramento de Forma Selvagem, Passo da Terra e os 14 recursos de dominio 5e.
- Seletor: representa decisoes persistentes da ficha. O ASI/talento 5e usa a progressao de classe; em 2024, Aumento no Valor de Atributo abre o catalogo de talentos gerais e pode ser escolhido repetidamente.
- Automacao: representa valores derivados sem duplicar texto. A auditoria fixa slots e magias, infusoes, invocacoes, dados, usos, pontos, maestrias e quantidades de escolhas no nivel 8.

## Divergencias identificadas

- Druida 5e: faltava Aprimoramento de Forma Selvagem no nivel 8. A regra anterior de Forma Selvagem tambem dizia incorretamente que magias sem concentracao poderiam ser conjuradas durante a transformacao. O dataset agora registra ND 1 sem limitacao de deslocamento e informa que o druida nao pode conjurar transformado, embora possa manter concentracao ja iniciada.
- Patrulheiro 5e: faltava Passo da Terra no nivel 8. O dataset agora cobre terreno dificil nao magico, vegetacao nao magica e vantagem contra plantas criadas ou manipuladas magicamente para impedir movimento.
- Demais 11 classes 5e: nenhuma divergencia funcional encontrada; o ganho do nivel e resolvido pelo seletor estruturado de ASI/talento e pelas automacoes ja existentes.
- 14 subclasses de Clerigo 5e listadas na matriz: nenhuma divergencia funcional encontrada; os recursos de dominio ja estavam presentes no nivel correto.
- Demais 104 subclasses 5e: nenhuma divergencia encontrada; nao ha recurso textual de subclasse esperado nesse nivel.
- 12 classes 2024: nenhuma divergencia encontrada; todas declaram Aumento no Valor de Atributo e o fluxo encaminha a decisao ao seletor, sem repetir o recurso no PDF.
- 48 subclasses 2024: nenhuma divergencia encontrada; as tabelas oficiais nao concedem recurso de subclasse no nivel 8.

## Melhorias aplicadas

- `src/data/5e/classes.js`: dataset atualizado para `0.2.7`, com os recursos oficiais de Druida e Patrulheiro e correcao da descricao de Forma Selvagem.
- `src/editors/5e/rules-config.js` e `src/editors/5e/main.js`: progressao padrao de ASI/talento exposta como configuracao estruturada e consumida pelo editor.
- `scripts/unit/level-8-audit.test.mjs`: matriz completa de nivel 8 para dados, seletores, contas e automacoes das edicoes 5e e 5.5e/2024.
- `scripts/smoke-dom.mjs`: nenhuma checagem solta de nivel 8 existia para migrar; o teste unitario garante que esse nivel nao volte a depender do smoke DOM.

## Fontes oficiais consultadas

- [D&D Beyond, Basic Rules 2024](https://www.dndbeyond.com/sources/dnd/br-2024/character-classes): tabelas de progressao das classes, incluindo Aumento no Valor de Atributo no nivel 8.
- Documento de Referencia de Sistema 5e em portugues: [Druida](https://aventureirosdosreinos.com/druida-drs/), [Guardiao/Patrulheiro](https://aventureirosdosreinos.com/guardiao-drs/) e [Clerigo](https://aventureirosdosreinos.com/clerigo-drs/).
