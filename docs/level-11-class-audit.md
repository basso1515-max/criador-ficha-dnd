# Auditoria de classes nivel 11

Atualizado em 2026-06-17.

Esta validacao cobre as fichas 5e legacy e 5.5e/2024 no nivel 11. O foco foi fechar a trilha imediatamente abaixo do nivel 12, validando o que deve aparecer como recurso textual, o que deve virar seletor persistente e o que deve ficar somente como automacao de contagem.

## Resultado geral

Status atual: completo para as classes e subclasses cadastradas.

- 5e legacy: apenas Bruxo declara recurso textual de classe no nivel 11, `Arcano Mistico (6o circulo)`. As outras 12 classes nao declaram recurso textual nesse nivel.
- 5e legacy: 18 das 118 subclasses declaram recurso textual no nivel 11, concentradas em Monge e Patrulheiro. As demais 100 subclasses nao declaram recurso textual nesse nivel.
- 2024: Barbaro, Bruxo, Guerreiro, Ladino e Paladino declaram recurso textual no nivel 11. As outras 7 classes nao declaram recurso textual nesse nivel.
- 2024: 8 das 48 subclasses declaram recurso textual no nivel 11, concentradas em Guardiao e Monge. As demais 40 subclasses nao declaram recurso textual nesse nivel.
- Selecao 5e: Monge Quatro Elementos abre 3 Disciplinas Elementais no nivel 11, libera as opcoes de nivel 11 e ainda bloqueia as de nivel 17; Patrulheiro Cacador abre a escolha de Ataque Multiplo; Kensei recebe a quarta arma.
- Selecao 2024: Mestre de Batalha mantem 7 manobras no nivel 11 e Bruxo recebe a primeira Arcana Mistica, de 6o circulo.
- Contas 5e: magias, espacos, invocacoes, infusoes, Inimigo Favorito, Explorador Nato, Metamagia, manobras, Tiro Arcano, Disciplinas Elementais e armas Kensei foram fixadas no teste unitario.
- Contas 2024: magias, espacos, furia, inspiracao, Canalizar Divindade, Forma Selvagem, pontos de feiticaria, Ataque Furtivo, Inimigo Favorito, maestrias, Invocacoes Misticas, Arcana Mistica e progressoes de Guerreiro/Monge foram fixadas no teste unitario.
- Propagacao: a checagem solta de Monge Quatro Elementos nivel 11 foi removida do `smoke-dom`; o contrato de texto vs seletor vs automacao agora fica em `scripts/unit/level-11-audit.test.mjs`.

## Matriz 5e

Classes base 5e no nivel 11:

| Classe | Nivel 11 | Contrato |
| --- | --- | --- |
| Artifice | Sem recurso textual | Automacao de infusoes e meia conjuracao |
| Barbaro | Sem recurso textual | Sem texto novo no dado de classe |
| Bardo | Sem recurso textual | Conjuracao completa |
| Bruxo | Arcano Mistico (6o circulo) | Texto de classe e automacao de pacto/invocacoes |
| Clerigo | Sem recurso textual | Conjuracao preparada completa |
| Druida | Sem recurso textual | Conjuracao preparada completa |
| Feiticeiro | Sem recurso textual | Conjuracao e Metamagia |
| Guerreiro | Sem recurso textual | Sem texto novo no dado de classe |
| Ladino | Sem recurso textual | Sem texto novo no dado de classe |
| Mago | Sem recurso textual | Conjuracao preparada completa |
| Monge | Sem recurso textual | Recursos de subclasses e seletores |
| Paladino | Sem recurso textual | Meia conjuracao preparada |
| Patrulheiro | Sem recurso textual | Recursos de subclasses e seletores |

Subclasses 5e com recurso textual no nivel 11:

| Classe | Subclasse | Nivel 11 |
| --- | --- | --- |
| Monge | Alma Solar | Explosao Solar Ardente |
| Monge | Forma Astral | Corpo Astral |
| Monge | Caminho da Misericordia | Fluxo Vital |
| Monge | Caminho da Morte Ampla | Dominio da Morte |
| Monge | Mao Aberta | Tranquilidade |
| Monge | Caminho das Sombras | Invisibilidade Sombria |
| Monge | Ascendente Dragao | Forma Draconica |
| Monge | Kensei | Afiar Lamina |
| Monge | Mestre Bebado | Sorte do Bebado |
| Monge | Quatro Elementos | Controle Elemental |
| Patrulheiro | Andarilho do Horizonte | Golpe Distante |
| Patrulheiro | Andarilho Feerico | Ataque Encantado |
| Patrulheiro | Cacador | Ataque Multiplo |
| Patrulheiro | Exterminador | Contra-Ataque |
| Patrulheiro | Guardiao do Enxame | Enxame Aprimorado |
| Patrulheiro | Dracos | Furia Draconica |
| Patrulheiro | Mestre das Feras | Fera Aprimorada |
| Patrulheiro | Perseguidor Sombrio | Ataque Sombrio |

Todas as demais subclasses 5e foram verificadas como sem recurso textual no nivel 11.

## Matriz 2024

Classes base 2024 no nivel 11:

| Classe | Nivel 11 | Contrato |
| --- | --- | --- |
| Barbaro | Furia Implacavel | Texto de classe e automacao de furia/maestria |
| Bardo | Sem recurso textual | Conjuracao completa e Inspiracao Bardica |
| Bruxo | Arcana Mistica (6o circulo) | Texto de classe e automacao de pacto/invocacoes |
| Clerigo | Sem recurso textual | Conjuracao preparada completa |
| Druida | Sem recurso textual | Conjuracao preparada e Forma Selvagem |
| Feiticeiro | Sem recurso textual | Conjuracao, pontos de feiticaria e Metamagia |
| Guerreiro | Dois Ataques Extras | Texto de classe e automacao de ataques |
| Ladino | Golpe Astuto Aprimorado | Texto de classe e Ataque Furtivo |
| Mago | Sem recurso textual | Conjuracao preparada completa |
| Monge | Sem recurso textual | Progressao de foco, dado marcial e movimento |
| Paladino | Golpes Radiantes | Texto de classe e Canalizar Divindade |
| Guardiao | Sem recurso textual | Meia conjuracao e Inimigo Favorito |

Subclasses 2024 com recurso textual no nivel 11:

| Classe | Subclasse | Nivel 11 |
| --- | --- | --- |
| Guardiao | Andarilho Feerico | Reforcos Feericos |
| Guardiao | Cacador | Presa do Cacador Superior |
| Guardiao | Mestre das Feras | Furia Bestial |
| Guardiao | Perseguidor Sombrio | Torrente do Vigilante |
| Monge | Mao Aberta | Passo Veloz |
| Monge | Misericordia | Rajada de Cura e Dano |
| Monge | Sombras | Passo Sombrio Aprimorado |
| Monge | Quatro Elementos | Passo dos Elementos |

Todas as demais subclasses 2024 foram verificadas como sem recurso textual no nivel 11.

## Criterio de selecao

Virou seletor quando a decisao muda algo persistente na ficha. No nivel 11, isso cobre as Disciplinas Elementais do Monge Quatro Elementos 5e, a escolha de Ataque Multiplo do Cacador 5e, a quarta arma Kensei 5e e as manobras do Mestre de Batalha 2024. Permaneceu texto quando ha recurso novo declarado na classe ou subclasse.

Ficou como automacao quando a regra altera contagens, slots, usos, maestrias, ataques, invocacoes ou fontes derivadas sem exigir texto novo no dado de classe. A Arcana Mistica 2024 tambem foi fixada como automacao de slot no nivel 11, em paralelo ao texto de classe do Bruxo.

## Melhorias aplicadas

- `scripts/unit/level-11-audit.test.mjs`: nova matriz completa de nivel 11 para dados, contas, seletores e automacoes das edicoes 5e e 5.5e/2024.
- `scripts/smoke-dom.mjs`: removida a checagem solta de Monge Quatro Elementos nivel 11; o teste DOM permanece focado no fluxo visual.
- `docs/level-11-class-audit.md`: registro da cobertura e dos criterios usados para texto, selecao e calculo automatico.
