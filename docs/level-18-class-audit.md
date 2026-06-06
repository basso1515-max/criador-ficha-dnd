# Auditoria de classes nivel 18

Atualizado em 2026-06-06.

Esta validacao cobre as fichas 5e legacy e 5.5e/2024 no nivel 18. O foco foi separar o que e recurso textual, o que precisa virar selecao persistente e o que deve ser contabilizado automaticamente no restante da ficha.

## Resultado geral

Status atual: completo para as classes e subclasses cadastradas.

- 5e legacy: nenhuma classe base declara recurso textual no nivel 18. Os recursos textuais desse nivel aparecem em 18 subclasses: todas as subclasses cadastradas de Feiticeiro e Guerreiro que possuem marco no nivel 18.
- 2024: 8 classes declaram recurso textual no nivel 18, 4 classes nao declaram recurso nesse nivel, e 8 subclasses declaram recurso textual.
- Contas 5e: magias, espacos, invocacoes, infusoes, Inimigo Favorito, Explorador Nato, Metamagia, manobras, Tiro Arcano, Disciplinas Elementais e armas Kensei foram fixadas no teste unitario.
- Contas 2024: magias, espacos, furia, inspiracao, Canalizar Divindade, Forma Selvagem, pontos de feiticaria, Ataque Furtivo, Inimigo Favorito, maestrias, Invocacoes Misticas e progressoes de Guerreiro/Monge foram fixadas no teste unitario.
- Propagacao: o smoke DOM valida que todos os recursos textuais de nivel 18 aparecem no preview/resumo. Selecoes de alto nivel como Maestria de Magias, Tiro Arcano, Metamagia, manobras e Companheiro Draconico continuam sendo validadas como seletores que alimentam o preview.

## Matriz 5e

Classes base 5e nao tem recurso textual no nivel 18 nos dados locais. A matriz de subclasses com recurso textual e:

| Classe | Subclasse | Nivel 18 |
| --- | --- | --- |
| Feiticeiro | Alma Divina | Recuperacao Transcendente |
| Feiticeiro | Alma Mecanica | Perfeicao Arcana |
| Feiticeiro | Feiticaria da Tempestade | Tempestade Viva |
| Feiticeiro | Feiticaria das Sombras | Forma Sombria |
| Feiticeiro | Feiticaria Lunar | Forma Lunar |
| Feiticeiro | Linhagem Draconica | Presenca Draconica |
| Feiticeiro | Magia Selvagem | Surto Supremo |
| Feiticeiro | Mente Aberrante | Mente Suprema |
| Guerreiro | Arqueiro Arcano | Tiro Aprimorado Superior |
| Guerreiro | Campeao | Sobrevivente |
| Guerreiro | Cavaleiro | Defensor Vigilante |
| Guerreiro | Cavaleiro Arcano | Magia de Guerra Aprimorada |
| Guerreiro | Cavaleiro do Eco | Legiao de Ecos |
| Guerreiro | Cavaleiro Runico | Forma do Colosso |
| Guerreiro | Guerreiro Psiquico | Mestre Psiquico |
| Guerreiro | Mestre de Batalha | Superioridade Suprema |
| Guerreiro | Porta-Estandarte | Surto Inspirador Aprimorado |
| Guerreiro | Samurai | Forca Antes da Morte |

Subclasses de Artifice, Barbaro, Bardo, Bruxo, Clerigo, Druida, Ladino, Mago, Monge, Paladino e Patrulheiro foram verificadas como sem recurso textual no nivel 18.

## Matriz 2024

| Classe | Nivel 18 |
| --- | --- |
| Barbaro | Forca Indomavel |
| Bardo | Inspiracao Superior |
| Bruxo | Sem recurso textual |
| Clerigo | Sem recurso textual |
| Druida | Magias Bestiais |
| Feiticeiro | Sem recurso textual |
| Guerreiro | Sem recurso textual |
| Ladino | Elusivo |
| Mago | Maestria de Magias |
| Monge | Defesa Superior |
| Paladino | Aura Expandida |
| Guardiao | Sentidos Selvagens |

| Classe | Subclasse | Nivel 18 |
| --- | --- | --- |
| Feiticeiro | Feiticaria Aberrante | Implosao de Distorcao |
| Feiticeiro | Feiticaria Draconica | Companheiro Draconico |
| Feiticeiro | Feiticaria Mecanica | Cavalgada Mecanica |
| Feiticeiro | Feiticaria Selvagem | Surto Domado |
| Guerreiro | Campeao | Sobrevivente |
| Guerreiro | Cavaleiro Mistico | Magia de Guerra Aprimorada |
| Guerreiro | Combatente Psiquico | Mestre Telecinetico |
| Guerreiro | Mestre da Batalha | Superioridade em Combate Suprema |

Subclasses de Barbaro, Bardo, Bruxo, Clerigo, Druida, Guardiao, Ladino, Mago, Monge e Paladino foram verificadas como sem recurso textual no nivel 18.

## Criterio de selecao

Virou seletor quando a escolha muda algo persistente na ficha, como magia escolhida, manobra, tiro arcano, metamagia, companion, terreno ou item configurado. Permaneceu texto quando o recurso descreve uma regra pronta, uma melhoria passiva ou uma acao temporaria que nao cria uma decisao persistente para preview/PDF.

## Melhorias aplicadas

- `scripts/unit/level-18-audit.test.mjs`: nova matriz completa de nivel 18 para dados, contas e selecoes automaticas.
- `scripts/smoke-dom.mjs`: smoke agora percorre todos os recursos textuais de subclasse 5e no nivel 18 e todos os recursos textuais de classe/subclasse 2024 no nivel 18.
- `docs/level-18-class-audit.md`: registro da cobertura e dos criterios usados para texto, selecao e calculo automatico.
