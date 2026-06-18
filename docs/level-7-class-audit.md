# Auditoria de classes nivel 7

Atualizado em 2026-06-18.

Esta validacao cobre classes e subclasses 5e legacy e 5.5e/2024 no nivel 7. O contrato separa recurso textual, escolha persistente e automacao numerica, comparando o comportamento local com as tabelas e descricoes oficiais.

## Resultado geral

Status atual: completo para as classes e subclasses cadastradas.

- 5e legacy: 4 das 13 classes declaram recurso textual no nivel 7: Artifice, Barbaro, Ladino e Monge. Os textos estavam ausentes e foram incluidos no dataset `0.2.8`.
- 5e legacy: 27 das 118 subclasses declaram recurso textual no nivel 7: 10 de Guerreiro, 9 de Paladino e 8 de Patrulheiro. As demais 91 subclasses nao recebem recurso nesse nivel.
- 2024: 7 das 12 classes declaram recurso textual no nivel 7: Barbaro, Bardo, Clerigo, Druida, Feiticeiro, Ladino e Monge.
- 2024: 12 das 48 subclasses declaram recurso textual no nivel 7: 4 de Guardiao, 4 de Guerreiro e 4 de Paladino. As demais 36 subclasses nao recebem recurso nesse nivel.
- Nao ha ASI/talento de classe no nivel 7 em nenhuma das edicoes.
- As checagens soltas de nivel 7 para Golpes Abencoados, Furia Elemental e Cacador 2024 sairam do `smoke-dom` e foram consolidadas em `scripts/unit/level-7-audit.test.mjs`.

## Matriz 5e

Classes base 5e no nivel 7:

| Classe | Nivel 7 | Contrato |
| --- | --- | --- |
| Artifice | Lampejo de Genio | Texto de classe; infusoes e magia ficam automaticas |
| Barbaro | Instintos Primitivos | Texto de classe; usos de Furia ficam automaticos |
| Bardo | Sem recurso textual | Conjuracao e Inspiracao automatizadas |
| Bruxo | Sem recurso textual | Magia de Pacto e invocacoes automatizadas |
| Clerigo | Sem recurso textual | Conjuracao preparada automatizada |
| Druida | Sem recurso textual | Conjuracao e Forma Selvagem automatizadas |
| Feiticeiro | Sem recurso textual | Conjuracao e Metamagia estruturadas |
| Guerreiro | Sem recurso textual de classe | Subclasses e progressao marcial |
| Ladino | Evasao | Texto de classe e Ataque Furtivo automatico |
| Mago | Sem recurso textual | Conjuracao preparada automatizada |
| Monge | Evasao; Mente Tranquila | Texto de classe; Ki, dado marcial e movimento automaticos |
| Paladino | Sem recurso textual de classe | Subclasses, auras e meia conjuracao |
| Patrulheiro | Sem recurso textual de classe | Subclasses, meia conjuracao e seletores persistentes |

Subclasses 5e com recurso textual no nivel 7:

| Classe | Subclasse | Nivel 7 |
| --- | --- | --- |
| Guerreiro | Arqueiro Arcano | Flecha Magica; Tiro Curvo |
| Guerreiro | Campeao | Atleta Notavel |
| Guerreiro | Cavaleiro | Manobra de Protecao |
| Guerreiro | Cavaleiro Arcano | Magia de Guerra |
| Guerreiro | Cavaleiro do Eco | Avatar do Eco |
| Guerreiro | Cavaleiro Runico | Escudo Runico; terceira runa no seletor |
| Guerreiro | Guerreiro Psiquico | Adepto Telecinetico |
| Guerreiro | Mestre de Batalha | Conhecer o Inimigo; cinco manobras no seletor |
| Guerreiro | Porta-Estandarte | Emissario Real |
| Guerreiro | Samurai | Elegancia Cortesa |
| Paladino | Juramento da Conquista | Aura de Conquista |
| Paladino | Juramento da Coroa | Lealdade Divina |
| Paladino | Juramento da Devocao | Aura de Devocao |
| Paladino | Juramento da Gloria | Aura de Alacridade |
| Paladino | Juramento da Redencao | Aura do Guardiao |
| Paladino | Juramento da Vinganca | Vingador Implacavel |
| Paladino | Juramento dos Ancioes | Aura de Protecao |
| Paladino | Juramento dos Vigilantes | Aura do Sentinela |
| Paladino | Quebrador de Juramento | Aura de Odio |
| Patrulheiro | Andarilho do Horizonte | Passo Etereo |
| Patrulheiro | Andarilho Feerico | Reviravolta Sedutora |
| Patrulheiro | Cacador | Taticas Defensivas; escolha no seletor |
| Patrulheiro | Exterminador de Monstros | Defesa Sobrenatural |
| Patrulheiro | Guardiao do Enxame | Mare Inquieta |
| Patrulheiro | Guardiao dos Dracos | Vinculo de Presas e Escamas |
| Patrulheiro | Mestre das Feras | Treinamento Excepcional |
| Patrulheiro | Perseguidor Obscuro | Mente de Ferro |

## Matriz 2024

Classes base 2024 no nivel 7:

| Classe | Nivel 7 | Contrato |
| --- | --- | --- |
| Barbaro | Bote Instintivo; Instinto Feral | Texto e automacao de Furia/Maestria |
| Bardo | Contra-Encantamento | Texto; Inspiracao e magia automaticas |
| Bruxo | Sem recurso textual | Magia de Pacto e seis invocacoes |
| Clerigo | Golpes Abencoados | Texto e seletor entre Golpe Divino/Conjuracao Potente |
| Druida | Furia Elemental | Texto e seletor entre Conjuracao Potente/Golpe Primal |
| Feiticeiro | Feiticaria Encarnada | Texto; pontos e Metamagia automatizados |
| Guerreiro | Sem recurso textual de classe | Subclasses e progressao marcial |
| Ladino | Evasao; Talento Confiavel | Texto e Ataque Furtivo automatico |
| Mago | Sem recurso textual | Conjuracao preparada automatizada |
| Monge | Evasao | Texto; Foco, dado marcial e movimento automaticos |
| Paladino | Sem recurso textual de classe | Subclasses, Canalizar Divindade e meia conjuracao |
| Guardiao | Sem recurso textual de classe | Subclasses, Inimigo Favorito e meia conjuracao |

Subclasses 2024 com recurso textual no nivel 7:

| Classe | Subclasse | Nivel 7 |
| --- | --- | --- |
| Guardiao | Andarilho Feerico | Reviravolta Sedutora |
| Guardiao | Cacador | Taticas Defensivas; escolha no seletor |
| Guardiao | Senhor das Feras | Treinamento Excepcional |
| Guardiao | Vigilante das Sombras | Mente de Ferro |
| Guerreiro | Campeao | Estilo de Luta Adicional; slot de talento de estilo |
| Guerreiro | Cavaleiro Mistico | Magia de Guerra |
| Guerreiro | Combatente Psiquico | Adepto Telecinetico |
| Guerreiro | Mestre da Batalha | Conheca Seu Inimigo; cinco manobras no seletor |
| Paladino | Devocao | Aura de Devocao |
| Paladino | Gloria | Aura da Alacridade |
| Paladino | Vinganca | Vingador Implacavel |
| Paladino | Ancioes | Aura de Protecao Magica |

## Texto, seletor e automacao

- Texto: registra caracteristicas que precisam aparecer no resumo da ficha, incluindo os quatro recursos de classe 5e ausentes e os recursos de subclasse das duas edicoes.
- Seletor 5e: fixa 3 runas de Cavaleiro Runico, 3 opcoes de Tiro Arcano, 5 manobras de Mestre de Batalha e a escolha de Taticas Defensivas do Cacador. Tambem valida escolhas ja ativas de Patrulheiro, Feiticeiro, Quatro Elementos e Kensei.
- Seletor 2024: fixa Golpes Abencoados, Furia Elemental, Taticas Defensivas, 5 manobras e o Estilo de Luta Adicional do Campeao.
- Automacao: fixa magias preparadas/conhecidas, slots, infusoes, invocacoes, Furia, Forma Selvagem, Canalizar Divindade, pontos, dados, usos, maestrias, Ki/Foco e Ataque Furtivo.

## Divergencias identificadas

### Classes 5e

- Artifice: faltava Lampejo de Genio.
- Barbaro: faltavam Instintos Primitivos.
- Ladino: faltava Evasao.
- Monge: faltavam Evasao e Mente Tranquila.
- Bardo, Bruxo, Clerigo, Druida, Feiticeiro, Guerreiro, Mago, Paladino e Patrulheiro: sem divergencia de classe; nao recebem texto base no nivel 7.

### Subclasses 5e

- Arqueiro Arcano: faltava Flecha Magica; Tiro Curvo foi detalhado e a terceira opcao continua no seletor.
- Cavaleiro do Eco: `Eco Explorador` foi substituido pelo recurso oficial Avatar do Eco.
- Cavaleiro Runico: a progressao dizia 4 runas no nivel 3 e mais 2 no nivel 7. Foi corrigida para 2 no nivel 3, 3 no nivel 7, 4 no nivel 10 e 5 no nivel 15, agora em seletor estruturado.
- Guerreiro Psiquico: `Movimento Telecinetico` representava apenas parte do recurso; foi corrigido para Adepto Telecinetico.
- Juramento da Coroa: `Campeao da Coroa` nao era o recurso oficial do nivel; foi substituido por Lealdade Divina.
- Quebrador de Juramento: Aura de Odio sugeria bonus para aliados em geral; o texto agora limita corretamente a voce, corruptores e mortos-vivos na aura.
- Andarilho Feerico: `Passo Feerico` era um recurso incorreto no nivel 7; foi substituido por Reviravolta Sedutora.
- Guardiao do Enxame: `Enxame Protetor` foi substituido por Mare Inquieta e seu voo temporario.
- Guardiao dos Dracos: `Asas Draconicas` descrevia apenas parte do ganho; foi substituido por Vinculo de Presas e Escamas.
- Mestre das Feras: `Treinamento Coordenado` foi substituido por Treinamento Excepcional, incluindo comandos e ataques magicos da fera.
- Campeao, Cavaleiro, Cavaleiro Arcano, Mestre de Batalha, Porta-Estandarte, Samurai, Conquista, Devocao, Gloria, Redencao, Vinganca, Ancioes, Vigilantes, Andarilho do Horizonte, Cacador, Exterminador de Monstros e Perseguidor Obscuro: sem divergencia funcional no nivel 7.
- As outras 91 subclasses 5e: sem divergencia; nao recebem recurso no nivel 7.

### Edicao 2024

- Classes: as 12 classes estavam alinhadas; sete recebem texto e cinco nao recebem recurso base no nivel 7.
- Andarilho Feerico: `Detalhe Sedutor` estava mal nomeado e incompleto; virou Reviravolta Sedutora com a reacao de redirecionamento.
- Combatente Psiquico: o resumo de Adepto Telecinetico omitia a melhoria de Movimento Telecinetico; foi completado.
- Vigilante das Sombras: Mente de Ferro omitia a alternativa de Inteligencia ou Carisma quando Sabedoria ja era proficiente; foi completado.
- Vinganca: Vingador Implacavel omitia o movimento de metade do deslocamento sem provocar ataques de oportunidade; foi completado.
- Ancioes: Aura de Protecao Magica ainda descrevia a versao legacy de resistencia a magias; foi corrigida para resistencia a dano necrotico, psiquico e radiante.
- Cacador, Senhor das Feras, Campeao, Cavaleiro Mistico, Mestre da Batalha, Devocao e Gloria: sem divergencia funcional no nivel 7.
- As outras 36 subclasses 2024: sem divergencia; nao recebem recurso no nivel 7.

## Fontes oficiais consultadas

- [SRD 5.1 da Wizards of the Coast](https://media.wizards.com/2023/downloads/dnd/SRD_CC_v5.1.pdf): progressoes 5e de Barbaro, Monge, Ladino, Guerreiro, Paladino e Patrulheiro.
- [Artifice em Tasha's Cauldron of Everything](https://www.dndbeyond.com/sources/dnd/tcoe/artificer): Lampejo de Genio e progressao da classe.
- DRS 5e em portugues: [Barbaro](https://aventureirosdosreinos.com/barbaro-drs/), [Monge](https://aventureirosdosreinos.com/monge-drs/), [Ladino](https://aventureirosdosreinos.com/ladino-drs/) e [Paladino](https://aventureirosdosreinos.com/paladino-drs/).
- [Basic Rules 2024 do D&D Beyond](https://www.dndbeyond.com/sources/dnd/br-2024/character-classes): tabelas e textos das classes 2024 no nivel 7.
