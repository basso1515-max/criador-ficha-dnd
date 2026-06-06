# Auditoria de classes nivel 17

Atualizado em 2026-06-06.

Esta validacao cobre as fichas 5e legacy e 5.5e/2024 no nivel 17. O foco foi conferir todas as classes e subclasses cadastradas, separar texto de selecao real e fixar as contas automaticas usadas pelo restante da ficha.

## Resultado geral

Status atual: completo para as classes e subclasses cadastradas.

- 5e legacy: Bruxo declara `Arcano Mistico (9o circulo)` como recurso de classe no nivel 17. As demais 12 classes nao declaram recurso textual nesse nivel.
- 5e legacy: 33 subclasses declaram recurso textual no nivel 17, concentradas em Clerigo, Ladino e Monge. As outras 85 subclasses foram verificadas como sem recurso textual no nivel.
- 2024: Barbaro, Bruxo, Feiticeiro, Guerreiro e Guardiao declaram recurso textual no nivel 17. Bardo, Clerigo, Druida, Ladino, Mago, Monge e Paladino nao declaram recurso de classe nesse nivel.
- 2024: 12 subclasses declaram recurso textual no nivel 17, concentradas em Clerigo, Ladino e Monge. As outras 36 subclasses foram verificadas como sem recurso textual no nivel.
- Contas 5e: magias, espacos, invocacoes, infusoes, Inimigo Favorito, Explorador Nato, Metamagia, manobras, Tiro Arcano, Disciplinas Elementais e armas Kensei foram fixadas no teste unitario.
- Contas 2024: magias, espacos, furia, inspiracao, Canalizar Divindade, Forma Selvagem, pontos de feiticaria, Ataque Furtivo, Inimigo Favorito, maestrias, Invocacoes Misticas, Arcana Mistica e progressoes de Guerreiro/Monge foram fixadas no teste unitario.
- Propagacao: o smoke DOM valida que todos os recursos textuais de nivel 17 aparecem no preview/resumo. Seletores de Metamagia, manobras, disciplinas elementais, armas Kensei e invocacoes continuam sendo validados como fontes automaticas.

## Matriz 5e

| Classe | Nivel 17 |
| --- | --- |
| Artifice | Sem recurso textual |
| Barbaro | Sem recurso textual |
| Bardo | Sem recurso textual |
| Bruxo | Arcano Mistico (9o circulo) |
| Clerigo | Sem recurso textual |
| Druida | Sem recurso textual |
| Feiticeiro | Sem recurso textual |
| Guerreiro | Sem recurso textual |
| Ladino | Sem recurso textual |
| Mago | Sem recurso textual |
| Monge | Sem recurso textual |
| Paladino | Sem recurso textual |
| Patrulheiro | Sem recurso textual |

| Classe | Subclasse | Nivel 17 |
| --- | --- | --- |
| Clerigo | Dominio Arcano | Maestria Arcana |
| Clerigo | Dominio da Enganacao | Duplicidade Perfeita |
| Clerigo | Dominio da Forja | Corpo de Ferro |
| Clerigo | Dominio da Guerra | Avatar da Batalha |
| Clerigo | Dominio da Luz | Aura Solar |
| Clerigo | Dominio da Morte | Mestre da Morte |
| Clerigo | Dominio da Natureza | Mestre da Natureza |
| Clerigo | Dominio da Ordem | Ordem Suprema |
| Clerigo | Dominio da Paz | Unidade Suprema |
| Clerigo | Dominio da Sepultura | Guardiao das Almas |
| Clerigo | Dominio da Tempestade | Tempestade Viva |
| Clerigo | Dominio da Vida | Cura Suprema |
| Clerigo | Dominio do Conhecimento | Conhecimento Supremo |
| Clerigo | Dominio do Crepusculo | Escudo do Crepusculo |
| Ladino | Assassino | Golpe Mortal |
| Ladino | Batedor | Golpe Subito |
| Ladino | Espadachim | Mestre Duelista |
| Ladino | Faca d'Alma | Golpe Mental |
| Ladino | Fantasma | Morte Roubada |
| Ladino | Inquiridor | Mente Superior |
| Ladino | Ladrao | Reflexos Rapidos |
| Ladino | Mestre das Intrigas | Alma da Enganacao |
| Ladino | Trapaceiro Arcano | Ladrao de Magia |
| Monge | Caminho da Alma Solar | Escudo Solar |
| Monge | Caminho da Forma Astral | Forma Completa |
| Monge | Caminho da Misericordia | Mestre da Misericordia |
| Monge | Caminho da Morte Longa | Toque da Morte Longa |
| Monge | Caminho da Palma Aberta | Palma Vibrante |
| Monge | Caminho das Sombras | Forma Sombria |
| Monge | Caminho do Dragao Ascendente | Presenca Draconica |
| Monge | Caminho do Kensei | Precisao Mortal |
| Monge | Caminho do Mestre Bebado | Frenesi Intoxicante |
| Monge | Caminho dos Quatro Elementos | Mestre dos Elementos |

## Matriz 2024

| Classe | Nivel 17 |
| --- | --- |
| Barbaro | Golpe Brutal Aprimorado (17o nivel) |
| Bardo | Sem recurso textual |
| Bruxo | Arcana Mistica (9o circulo) |
| Clerigo | Sem recurso textual |
| Druida | Sem recurso textual |
| Feiticeiro | Metamagia Superior |
| Guerreiro | Surto de Acao Aprimorado; Indomavel Superior |
| Ladino | Sem recurso textual |
| Mago | Sem recurso textual |
| Monge | Sem recurso textual |
| Paladino | Sem recurso textual |
| Guardiao | Cacador Preciso |

| Classe | Subclasse | Nivel 17 |
| --- | --- | --- |
| Clerigo | Dominio da Guerra | Avatar da Guerra |
| Clerigo | Dominio da Luz | Coroa de Luz |
| Clerigo | Dominio da Trapaca | Duplicidade Aprimorada |
| Clerigo | Dominio da Vida | Cura Suprema |
| Ladino | Faca da Alma | Rasgar a Mente |
| Ladino | Assassino | Golpe Mortal |
| Ladino | Ladrao | Reflexos de Ladrao |
| Ladino | Trapaceiro Arcano | Ladrao de Magias |
| Monge | Guerreiro da Palma Aberta | Palma Vibrante |
| Monge | Guerreiro da Misericordia | Mao da Misericordia Suprema |
| Monge | Guerreiro das Sombras | Manto das Sombras |
| Monge | Guerreiro dos Elementos | Epitome Elemental |

## Criterio de selecao

Virou seletor quando a escolha muda algo persistente na ficha, como Metamagia, manobra, disciplina elemental, arma Kensei, invocacao ou magia/beneficio concedido por uma fonte automatica. Permaneceu texto quando o recurso descreve uma regra pronta, melhoria passiva, uso temporario ou efeito que nao cria decisao persistente para preview/PDF.

## Melhorias aplicadas

- `scripts/unit/level-17-audit.test.mjs`: nova matriz completa de nivel 17 para dados, contas e selecoes automaticas.
- `scripts/smoke-dom.mjs`: smoke agora percorre todos os recursos textuais de classe/subclasse 5e e 2024 no nivel 17.
- `docs/level-17-class-audit.md`: registro da cobertura e dos criterios usados para texto, selecao e calculo automatico.
