# Auditoria de classes nivel 15

Atualizado em 2026-06-06.

Esta validacao cobre as fichas 5e legacy e 5.5e/2024 no nivel 15. O foco foi conferir todas as classes e subclasses cadastradas, separar texto de selecao real e fixar as contas automaticas usadas pelo restante da ficha.

## Resultado geral

Status atual: completo para as classes e subclasses cadastradas.

- 5e legacy: Bruxo declara `Arcano Mistico (8o circulo)` como recurso de classe. As outras 12 classes nao declaram recurso textual no nivel 15.
- 5e legacy: 31 subclasses declaram recurso textual no nivel 15, concentradas em Artifice, Guerreiro, Paladino e Patrulheiro. As outras 87 subclasses foram verificadas como sem recurso textual no nivel.
- 2024: Barbaro, Bruxo, Druida, Ladino e Monge declaram recurso textual no nivel 15. As outras 7 classes nao declaram recurso textual nesse nivel.
- 2024: 12 subclasses declaram recurso textual no nivel 15, concentradas em Guardiao, Guerreiro e Paladino. As outras 36 subclasses foram verificadas como sem recurso textual no nivel.
- Contas 5e: magias, espacos, invocacoes, infusoes, Inimigo Favorito, Explorador Nato, Metamagia, manobras, Tiro Arcano, Disciplinas Elementais e armas Kensei foram fixadas no teste unitario.
- Contas 2024: magias, espacos, furia, inspiracao, Canalizar Divindade, Forma Selvagem, pontos de feiticaria, Ataque Furtivo, Inimigo Favorito, maestrias, Invocacoes Misticas, Arcana Mistica e progressoes de Guerreiro/Monge foram fixadas no teste unitario.
- Propagacao: o smoke DOM valida que todos os recursos textuais de nivel 15 aparecem no preview/resumo. Seletores de manobras, Tiro Arcano, Defesa Superior do Cacador e Arcano/Arcana Mistica continuam cobertos como fontes automaticas.

## Matriz 5e

| Classe | Nivel 15 |
| --- | --- |
| Artifice | Sem recurso textual |
| Barbaro | Sem recurso textual |
| Bardo | Sem recurso textual |
| Bruxo | Arcano Mistico (8o circulo) |
| Clerigo | Sem recurso textual |
| Druida | Sem recurso textual |
| Feiticeiro | Sem recurso textual |
| Guerreiro | Sem recurso textual |
| Ladino | Sem recurso textual |
| Mago | Sem recurso textual |
| Monge | Sem recurso textual |
| Paladino | Sem recurso textual |
| Patrulheiro | Sem recurso textual |

| Classe | Subclasse | Nivel 15 |
| --- | --- | --- |
| Artifice | Alquimista | Mestre Alquimista |
| Artifice | Armeiro | Armadura Perfeita |
| Artifice | Artilheiro | Fortaleza Arcana |
| Artifice | Ferreiro de Batalha | Construto Supremo |
| Guerreiro | Arqueiro Arcano | Tiro Constante |
| Guerreiro | Campeao | Critico Superior |
| Guerreiro | Cavaleiro | Investida Feroz |
| Guerreiro | Cavaleiro Arcano | Investida Arcana |
| Guerreiro | Cavaleiro do Eco | Eco Aprimorado |
| Guerreiro | Cavaleiro Runico | Maestria Runica |
| Guerreiro | Guerreiro Psiquico | Golpe Telecinetico |
| Guerreiro | Mestre de Batalha | Implacavel |
| Guerreiro | Porta-Estandarte | Baluarte |
| Guerreiro | Samurai | Golpe Rapido |
| Paladino | Juramento da Conquista | Espirito Invencivel |
| Paladino | Juramento da Coroa | Guarda Inabalavel |
| Paladino | Juramento da Devocao | Pureza de Espirito |
| Paladino | Juramento da Gloria | Corpo Perfeito |
| Paladino | Juramento da Redencao | Espirito Protetor |
| Paladino | Juramento da Vinganca | Alma da Vinganca |
| Paladino | Juramento dos Ancioes | Guardiao Imortal |
| Paladino | Juramento dos Vigilantes | Vigilancia Constante |
| Paladino | Quebrador de Juramento | Resistencia Sobrenatural |
| Patrulheiro | Andarilho do Horizonte | Defesa Espectral |
| Patrulheiro | Andarilho Feerico | Forma Feerica |
| Patrulheiro | Cacador | Defesa Superior do Cacador |
| Patrulheiro | Exterminador de Monstros | Matador Supremo |
| Patrulheiro | Guardiao do Enxame | Forma de Enxame |
| Patrulheiro | Guardiao dos Dracos | Dragao Supremo |
| Patrulheiro | Mestre das Feras | Vinculo Perfeito |
| Patrulheiro | Perseguidor Obscuro | Desaparecimento |

## Matriz 2024

| Classe | Nivel 15 |
| --- | --- |
| Barbaro | Furia Persistente |
| Bardo | Sem recurso textual |
| Bruxo | Arcana Mistica (8o circulo) |
| Clerigo | Sem recurso textual |
| Druida | Furia Elemental Aprimorada |
| Feiticeiro | Sem recurso textual |
| Guerreiro | Sem recurso textual |
| Ladino | Mente Escorregadia |
| Mago | Sem recurso textual |
| Monge | Foco Perfeito |
| Paladino | Sem recurso textual |
| Guardiao | Sem recurso textual |

| Classe | Subclasse | Nivel 15 |
| --- | --- | --- |
| Guardiao | Andarilho Feerico | Andarilho Nebuloso |
| Guardiao | Cacador | Defesa Superior do Cacador |
| Guardiao | Senhor das Feras | Compartilhar Magias |
| Guardiao | Vigilante das Sombras | Esquiva Sombria |
| Guerreiro | Campeao | Critico Superior |
| Guerreiro | Cavaleiro Mistico | Investida Mistica |
| Guerreiro | Combatente Psiquico | Baluarte de Energia |
| Guerreiro | Mestre da Batalha | Implacavel |
| Paladino | Devocao | Destruicao Protetora |
| Paladino | Gloria | Defesa Gloriosa |
| Paladino | Vinganca | Alma da Vinganca |
| Paladino | Ancioes | Sentinela Imortal |

## Criterio de selecao

Virou seletor quando a escolha muda algo persistente na ficha, como manobras, Tiro Arcano, Defesa Superior do Cacador ou magia de Arcano/Arcana Mistica. Permaneceu texto quando o recurso descreve uma regra pronta, melhoria passiva, uso temporario ou efeito que nao cria decisao persistente para preview/PDF.

## Melhorias aplicadas

- `scripts/unit/level-15-audit.test.mjs`: nova matriz completa de nivel 15 para dados, contas e selecoes automaticas.
- `scripts/smoke-dom.mjs`: smoke agora percorre todos os recursos textuais de classe/subclasse 5e e 2024 no nivel 15.
- `docs/level-15-class-audit.md`: registro da cobertura e dos criterios usados para texto, selecao e calculo automatico.
