# Auditoria de classes nivel 2

Atualizado em 2026-06-29.

Esta validacao cobre as fichas 5e legacy e 5.5e/2024 no nivel 2. O foco foi fechar as checagens soltas que ainda estavam no smoke DOM e separar recurso textual, escolha persistente e automacao para que dados, seletores e exportacao nao se contradigam.

## Resultado geral

Status atual: completo para as classes e subclasses cadastradas.

- 5e legacy: 12 das 13 classes declaram recurso textual no nivel 2. Mago nao declara texto de classe nesse marco porque as tradicoes arcanas carregam o texto de subclasse.
- 5e legacy: 34 das 118 subclasses declaram recurso textual no nivel 2: 14 dominios de Clerigo, 7 circulos de Druida e 13 tradicoes de Mago.
- 2024: todas as 12 classes declaram recurso textual no nivel 2.
- 2024: nenhuma das 48 subclasses declara recurso textual no nivel 2.
- Selecao 5e: o nivel 2 cobre infusoes de Artifice, estilos de luta de Paladino/Patrulheiro, invocacoes de Bruxo, escolhas persistentes de Patrulheiro, Companheiro Selvagem de Druida e proficiencia de arma da Lamina Cantante.
- Selecao 2024: o nivel 2 cobre Metamagia, Academico do Mago, talentos de Estilo de Luta de Paladino/Guardiao, Especialista do Bardo, idiomas de Explorador Habil e Companheiro Selvagem.
- Automacao: magias, espacos, Canalizar Divindade, Forma Selvagem, Pontos de Feiticaria, Surto de Acao, Pau pra Toda Obra, invocacoes, maestrias, Foco, Ataque Furtivo e fontes automaticas de magia foram fixados no teste unitario.

## Matriz 5e

Classes base 5e no nivel 2:

| Classe | Nivel 2 | Contrato |
| --- | --- | --- |
| Artifice | Infusoes | Texto, seletor de 4 conhecidas/2 ativas e meia conjuracao |
| Barbaro | Ataque Imprudente; Sentido de Perigo | Texto de classe |
| Bardo | Pau pra Toda Obra; Cancao de Descanso (d6) | Texto e automacao de meia proficiencia |
| Bruxo | Invocacoes Misticas | Texto e seletor de 2 invocacoes |
| Clerigo | Canalizar Divindade | Texto, usos e poderes de dominio |
| Druida | Forma Selvagem | Texto, usos e Companheiro Selvagem opcional |
| Feiticeiro | Fonte de Magia | Texto e pontos de feiticaria |
| Guerreiro | Surto de Ação | Texto e automacao de uso |
| Ladino | Ação Ardilosa | Texto e Ataque Furtivo automatico |
| Mago | Sem recurso textual de classe | Tradicoes arcanas e seletores de subclasse |
| Monge | Ki; Movimento sem Armadura | Texto e automacao de movimento |
| Paladino | Conjuracao; Estilo de Luta; Golpe Divino | Texto, seletor de estilo e meia conjuracao |
| Patrulheiro | Conjuracao; Estilo de Luta | Texto, seletor de estilo, inimigo/terreno e meia conjuracao |

Subclasses 5e com texto no nivel 2:

| Grupo | Quantidade | Observacao |
| --- | ---: | --- |
| Clerigo | 14 | Canalizar Divindade de dominio |
| Druida | 7 | Circulos, Forma de Combate, Recuperacao Natural e companheiros/fontes |
| Mago | 13 | Tradicoes arcanas, incluindo treinamento da Lamina Cantante |

## Matriz 2024

Classes base 2024 no nivel 2:

| Classe | Nivel 2 | Contrato |
| --- | --- | --- |
| Barbaro | Ataque Imprudente; Sentido de Perigo | Texto, Furia e maestria automaticas |
| Bardo | Especialista; Pau pra Toda Obra | Texto, seletor de Expertise e meia proficiencia |
| Bruxo | Astucia Magica | Texto e 3 invocacoes |
| Clerigo | Canalizar Divindade | Texto e 2 usos |
| Druida | Companheiro Selvagem; Forma Selvagem | Texto, usos e companheiro opcional |
| Feiticeiro | Fonte de Magia; Metamagia | Texto, pontos e seletor de 2 Metamagias |
| Guerreiro | Mente Tatica; Surto de Ação | Texto, Recuperar Folego e maestrias |
| Ladino | Ação Ardilosa | Texto e Ataque Furtivo automatico |
| Mago | Academico | Texto e seletor de uma pericia para Expertise |
| Monge | Foco do Monge; Metabolismo Incomum; Movimento sem Armadura | Texto, Foco e movimento automatico |
| Paladino | Destruicao do Paladino; Estilo de Luta | Texto, estilo por talento e meia conjuracao |
| Guardiao | Explorador Habil; Estilo de Luta | Texto, estilo por talento, idiomas, Expertise e meia conjuracao |

Todas as 48 subclasses 2024 foram verificadas como sem recurso textual no nivel 2.

## Texto, seletor e automacao

- Texto: fica no dataset quando o marco precisa aparecer no resumo de classe/subclasse. Nesta auditoria isso adicionou Barbaro e Bardo 5e e completou Lamina Cantante com `Treinamento em Guerra e Cancao`.
- Seletor: fica para decisoes persistentes. As contagens soltas de infusoes, estilo de luta e estilo de Guardiao 2024 foram movidas para `scripts/unit/level-2-audit.test.mjs`; o smoke DOM continua exercitando os paineis reais.
- Automacao: fica em tabelas e funcoes quando a regra altera valores derivados. A auditoria fixa slots, magias conhecidas/preparadas, usos, dados, invocacoes, pontos, maestrias e fontes automaticas.

## Divergencias corrigidas

- 5e legacy: Barbaro nao declarava `Ataque Imprudente` nem `Sentido de Perigo` no nivel 2.
- 5e legacy: Bardo nao declarava `Pau pra Toda Obra` nem `Cancao de Descanso (d6)` no nivel 2, embora a automacao de meia proficiencia ja existisse.
- 5e legacy: Guerreiro usava `Investida de Ação (Action Surge)`; foi normalizado para `Surto de Ação`.
- 5e legacy: Ladino usava nome/descricao com ingles em `Ação Ardilosa (Cunning Action)`; foi normalizado para `Ação Ardilosa` com acoes em portugues.
- 5e legacy: Círculo da Terra declarava `Magias do Círculo` no nivel 2, mas a automacao libera magias de terreno apenas no nivel 3. O texto do nivel 2 agora declara `Truque Adicional` e `Recuperacao Natural`.
- 5e legacy: Lamina Cantante tinha seletor para proficiencia de arma de `Treinamento em Guerra e Cancao`, mas o texto da subclasse nao declarava esse recurso.

## Arquivos e verificacao

- `src/data/5e/classes.js`: dataset atualizado para `0.3.1`, com recursos oficiais de Barbaro/Bardo e normalizacao de nomes.
- `src/data/5e/subclasses.js`: corrige Círculo da Terra no nivel 2 e declara `Treinamento em Guerra e Cancao` da Lamina Cantante.
- `src/editors/5e/feature-summary.js`: adiciona resumos compactos para os novos textos de subclasse.
- `scripts/unit/level-2-audit.test.mjs`: nova matriz completa de nivel 2 para dados, seletores, contas e automacoes das edicoes 5e e 5.5e/2024.
- `scripts/smoke-dom.mjs`: remove contagens estruturais soltas de nivel 2, preservando as interacoes reais de UI.
