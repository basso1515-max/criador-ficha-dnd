# Auditoria de classes nivel 1

Atualizado em 2026-06-29.

Esta validacao cobre as fichas 5e legacy e 5.5e/2024 no nivel 1. O foco foi abrir a trilha que faltava na auditoria de classes, separando recurso textual, escolha persistente e automacao para que dados, seletores e exportacao nao se contradigam logo na criacao do personagem.

## Resultado geral

Status atual: completo para as classes e subclasses cadastradas.

- 5e legacy: todas as 13 classes declaram recurso textual no nivel 1.
- 5e legacy: 31 das 118 subclasses declaram recurso textual no nivel 1, concentradas em patronos de Bruxo, dominios de Clerigo e origens de Feiticeiro.
- 2024: todas as 12 classes declaram recurso textual no nivel 1.
- 2024: nenhuma das 48 subclasses declara recurso textual no nivel 1.
- Selecao 5e: o nivel 1 cobre estilo de luta do Guerreiro, Expertise do Ladino, Inimigo Favorito e Explorador Nato do Patrulheiro. Infusoes, Metamagia, manobras e invocacoes legacy continuam bloqueadas nesse nivel.
- Selecao 2024: o nivel 1 cobre estilo de luta do Guerreiro, Ordem Divina do Clerigo, Ordem Primal do Druida, 1 invocacao de Bruxo e usos de Inimigo Favorito do Guardiao.
- Automacao: magias, espacos, pacto, Furia, Inspiracao de Bardo, Recuperar Folego, Ataque Furtivo, maestrias e recursos ainda nao desbloqueados foram fixados no teste unitario.

## Matriz 5e

Classes base 5e no nivel 1:

| Classe | Nivel 1 | Contrato |
| --- | --- | --- |
| Artifice | Conjuracao Arcana; Funilaria Magica | Texto e meia conjuracao inicial |
| Barbaro | Furia; Defesa sem Armadura | Texto e automacao de Furia |
| Bardo | Inspiracao Bardica; Conjuracao | Texto, dado de inspiracao e conjuracao |
| Bruxo | Patrono Sobrenatural; Magia de Pacto | Texto, patrono e pacto |
| Clerigo | Conjuracao; Dominio Divino | Texto, dominio e conjuracao |
| Druida | Druidico; Conjuracao | Texto e conjuracao |
| Feiticeiro | Conjuracao; Origem Feiticeira | Texto, origem e conjuracao |
| Guerreiro | Estilo de Luta; Retomar Folego | Texto, seletor de estilo e cura curta |
| Ladino | Ataque Furtivo; Especializacao; Giria de Ladrao | Texto, Expertise e Ataque Furtivo |
| Mago | Recuperacao Arcana; Conjuracao | Texto e conjuracao |
| Monge | Defesa sem Armadura; Artes Marciais | Texto e calculos marciais |
| Paladino | Sentido Divino; Cura pelas Maos | Texto e reserva de cura |
| Patrulheiro | Inimigo Favorito; Explorador Nato | Texto e seletores persistentes |

Subclasses 5e com texto no nivel 1:

| Grupo | Quantidade | Observacao |
| --- | ---: | --- |
| Bruxo | 9 | Patronos escolhidos no nivel 1, incluindo Lamina Maldita, Genio e Morto-Vivo |
| Clerigo | 14 | Dominios divinos escolhidos no nivel 1 |
| Feiticeiro | 8 | Origens feiticeiras escolhidas no nivel 1 |

## Matriz 2024

Classes base 2024 no nivel 1:

| Classe | Nivel 1 | Contrato |
| --- | --- | --- |
| Barbaro | Furia; Defesa sem Armadura; Maestria em Arma | Texto, Furia e maestrias |
| Bardo | Inspiracao de Bardo; Conjuracao | Texto, dado de inspiracao e conjuracao |
| Bruxo | Invocacoes Misticas; Magia de Pacto | Texto, 1 invocacao e pacto |
| Clerigo | Conjuracao; Ordem Divina | Texto, seletor de ordem e conjuracao |
| Druida | Conjuracao; Idioma Druidico; Ordem Primal | Texto, seletor de ordem e conjuracao |
| Feiticeiro | Conjuracao; Feiticaria Inata | Texto e conjuracao |
| Guerreiro | Estilo de Luta; Maestria em Arma; Recuperar Folego | Texto, estilo, maestrias e usos |
| Ladino | Ataque Furtivo; Especialista; Giria do Ladrao; Maestria em Arma | Texto, Expertise, Ataque Furtivo e maestrias |
| Mago | Adepto de Ritual; Conjuracao; Recuperacao Arcana | Texto e conjuracao |
| Monge | Artes Marciais; Defesa sem Armadura | Texto e dado marcial |
| Paladino | Conjuracao; Maestria em Arma; Maos Consagradas | Texto, meia conjuracao e maestrias |
| Guardiao | Conjuracao; Inimigo Favorito; Maestria em Arma | Texto, meia conjuracao, usos e maestrias |

Todas as 48 subclasses 2024 foram verificadas como sem recurso textual no nivel 1.

## Texto, seletor e automacao

- Texto: fica no dataset quando o marco precisa aparecer no resumo de classe/subclasse. No nivel 1 isso cobre a identidade inicial de todas as classes e as subclasses que entram antes do nivel 3 em 5e legacy.
- Seletor: fica para decisoes persistentes. A auditoria cobre estilo de luta, Expertise, Inimigo Favorito, Explorador Nato, Ordem Divina, Ordem Primal, invocacao inicial de Bruxo 2024 e bloqueios de escolhas que ainda nao devem aparecer.
- Automacao: fica em tabelas e funcoes quando a regra altera valores derivados. A auditoria fixa slots, magias conhecidas/preparadas, espacos de pacto, Furia, Inspiracao, Recuperar Folego, Ataque Furtivo, maestrias e recursos ainda nao liberados.

## Divergencias corrigidas

- 5e legacy: Bruxo usava `Patrocinio do Patrono`; foi normalizado para `Patrono Sobrenatural`.
- 5e legacy: Feiticeiro usava `Origem Sorcerosa`; foi normalizado para `Origem Feiticeira`.
- 5e legacy: Guerreiro usava `Segunda Vontade (Second Wind)`; foi normalizado para `Retomar Folego`.
- 5e legacy: Paladino usava `Mao Curativa (Lay on Hands)`; foi normalizado para `Cura pelas Maos`.

## Arquivos e verificacao

- `src/data/5e/classes.js`: dataset atualizado para `0.3.2`, com nomes de nivel 1 normalizados.
- `scripts/unit/level-1-audit.test.mjs`: nova matriz completa de nivel 1 para dados, seletores e automacoes das edicoes 5e e 5.5e/2024.
- `docs/level-1-class-audit.md`: registro da cobertura e dos criterios usados para texto, selecao e calculo automatico.
