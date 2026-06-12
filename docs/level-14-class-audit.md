# Auditoria de classes nivel 14

Atualizado em 2026-06-12.

Esta validacao cobre as fichas 5e legacy e 5.5e/2024 no nivel 14. O foco foi fechar a lacuna entre as auditorias de nivel 13 e 15, separando recursos textuais, seletores persistentes e calculos automaticos que alimentam preview, resumo e PDF.

## Resultado geral

Status atual: completo para as classes e subclasses cadastradas.

- 5e legacy: nenhuma das 13 classes declara recurso textual no nivel 14.
- 5e legacy: 54 subclasses declaram recurso textual no nivel 14, concentradas em Barbaro, Bardo, Bruxo, Druida, Feiticeiro e Mago. As outras 64 subclasses foram verificadas como sem recurso textual no nivel.
- 2024: Clerigo, Guerreiro, Ladino, Monge, Paladino e Guardiao declaram recurso no nivel 14. Em Guerreiro, `Aumento no Valor de Atributo` e tratado como escolha persistente, nao como texto solto no PDF.
- 2024: 24 subclasses declaram recurso textual no nivel 14, concentradas em Barbaro, Bardo, Bruxo, Druida, Feiticeiro e Mago. As outras 24 subclasses foram verificadas como sem recurso textual no nivel.
- Contas 5e: magias, espacos, invocacoes, infusoes, Inimigo Favorito, Explorador Nato, Metamagia, manobras, Tiro Arcano, Disciplinas Elementais e armas Kensei foram fixadas no teste unitario.
- Contas 2024: magias, espacos, furia, inspiracao, Canalizar Divindade, Forma Selvagem, pontos de feiticaria, Ataque Furtivo, Inimigo Favorito, maestrias, Invocacoes Misticas, Arcana Mistica e progressoes de Guerreiro/Monge foram fixadas no teste unitario.
- Propagacao: as checagens soltas de nivel 14 que estavam no `smoke-dom` foram movidas para `scripts/unit/level-14-audit.test.mjs`, incluindo Inimigo Favorito 5e, Sintonia Totemica, Aspecto da Fera e Surto de Magia Selvagem.

## Matriz 5e

Todas as classes base 5e ficam sem recurso textual no nivel 14:

| Classe | Nivel 14 |
| --- | --- |
| Artifice | Sem recurso textual |
| Barbaro | Sem recurso textual |
| Bardo | Sem recurso textual |
| Bruxo | Sem recurso textual |
| Clerigo | Sem recurso textual |
| Druida | Sem recurso textual |
| Feiticeiro | Sem recurso textual |
| Guerreiro | Sem recurso textual |
| Ladino | Sem recurso textual |
| Mago | Sem recurso textual |
| Monge | Sem recurso textual |
| Paladino | Sem recurso textual |
| Patrulheiro | Sem recurso textual |

| Classe | Subclasse | Nivel 14 |
| --- | --- | --- |
| Barbaro | Caminho da Fera | Chamado da Cacada |
| Barbaro | Caminho da Magia Selvagem | Reacao Controlada |
| Barbaro | Caminho do Arauto da Tempestade | Furia da Tempestade |
| Barbaro | Caminho do Batalhador | Retaliacao Espinhosa |
| Barbaro | Caminho do Berserker | Retaliacao |
| Barbaro | Caminho do Fanatico | Furia Alem da Morte |
| Barbaro | Caminho do Gigante | Forca Titanica |
| Barbaro | Caminho do Guardiao Ancestral | Vinganca Ancestral |
| Barbaro | Caminho do Guerreiro Totemico | Sintonia Totemica |
| Bardo | Colegio da Bravura | Magia de Batalha |
| Bardo | Colegio da Criacao | Criacao Superior |
| Bardo | Colegio da Eloquencia | Discurso Universal |
| Bardo | Colegio das Espadas | Florada Mestre |
| Bardo | Colegio do Conhecimento | Habilidade Inigualavel |
| Bardo | Colegio do Glamour | Majestade Inquebravel |
| Bardo | Colegio dos Espiritos | Contos Guiados |
| Bardo | Colegio dos Sussurros | Sombra Sombria |
| Bruxo | A Arquifada | Delirio Sombrio |
| Bruxo | A Lamina Maldita | Maldicao Expandida |
| Bruxo | O Celestial | Explosao Sagrada |
| Bruxo | O Genio | Desejo Limitado |
| Bruxo | O Grande Antigo | Criar Servo |
| Bruxo | O Imperecivel | Vida Indestrutivel |
| Bruxo | O Infernal | Arremessar ao Inferno |
| Bruxo | O Insondavel | Mergulho Insondavel |
| Bruxo | O Morto-Vivo | Projecao Espiritual |
| Druida | Circulo da Lua | Mil Formas |
| Druida | Circulo da Terra | Corpo da Natureza |
| Druida | Circulo das Estrelas | Corpo Estelar |
| Druida | Circulo do Fogo Selvagem | Renascer das Cinzas |
| Druida | Circulo do Pastor | Invocacao Suprema |
| Druida | Circulo dos Esporos | Corpo Fungico |
| Druida | Circulo dos Sonhos | Caminho dos Sonhos |
| Feiticeiro | Alma Divina | Asas Sobrenaturais |
| Feiticeiro | Alma Mecanica | Protecao Mecanica |
| Feiticeiro | Feiticaria da Tempestade | Alma da Tempestade |
| Feiticeiro | Feiticaria das Sombras | Passo Sombrio |
| Feiticeiro | Feiticaria Lunar | Luz Lunar |
| Feiticeiro | Linhagem Draconica | Asas Draconicas |
| Feiticeiro | Magia Selvagem | Controle do Caos |
| Feiticeiro | Mente Aberrante | Forma Aberrante |
| Mago | Cronurgista | Fragmentar Linha Temporal |
| Mago | Escola da Abjuracao | Resistencia a Magia |
| Mago | Escola da Adivinhacao | Grande Pressagio |
| Mago | Escola da Conjuracao | Conjuracao Duradoura |
| Mago | Escola da Evocacao | Sobrecarga |
| Mago | Escola da Ilusao | Realidade Ilusoria |
| Mago | Escola da Necromancia | Comandar Mortos |
| Mago | Escola da Transmutacao | Transmutacao Suprema |
| Mago | Escola do Encantamento | Memoria Alterada |
| Mago | Graviturgista | Colapso Gravitacional |
| Mago | Lamina Cantante | Cancao da Vitoria |
| Mago | Mago de Guerra | Sobrecarregar Magia |
| Mago | Ordem dos Escribas | Grimorio Supremo |

Subclasses de Artifice, Clerigo, Guerreiro, Ladino, Monge, Paladino e Patrulheiro foram verificadas como sem recurso textual no nivel 14.

## Matriz 2024

| Classe | Nivel 14 |
| --- | --- |
| Barbaro | Sem recurso textual |
| Bardo | Sem recurso textual |
| Bruxo | Sem recurso textual |
| Clerigo | Golpes Abencoados Aprimorados |
| Druida | Sem recurso textual |
| Feiticeiro | Sem recurso textual |
| Guerreiro | Aumento no Valor de Atributo |
| Ladino | Golpes Sujos |
| Mago | Sem recurso textual |
| Monge | Sobrevivente Disciplinado |
| Paladino | Toque Restaurador |
| Guardiao | Veu da Natureza |

| Classe | Subclasse | Nivel 14 |
| --- | --- | --- |
| Barbaro | Caminho da Arvore do Mundo | Percorrer a Arvore |
| Barbaro | Caminho do Berserker | Presenca Intimidante |
| Barbaro | Caminho do Coracao Selvagem | Poder dos Selvagens |
| Barbaro | Caminho do Fanatico | Furia dos Deuses |
| Bardo | Colegio do Valor | Magia de Batalha |
| Bardo | Colegio da Danca | Evasao Liderada |
| Bardo | Colegio do Conhecimento | Pericia Inigualavel |
| Bardo | Colegio do Glamour | Majestade Inquebravel |
| Bruxo | Patrono Arquifada | Magia Sedutora |
| Bruxo | Patrono Celestial | Vinganca Calcinante |
| Bruxo | Patrono do Grande Antigo | Criar Servo |
| Bruxo | Patrono Infero | Lancar no Inferno |
| Druida | Circulo da Lua | Forma Lunar |
| Druida | Circulo da Terra | Santuario Natural |
| Druida | Circulo das Estrelas | Repleto de Estrelas |
| Druida | Circulo do Mar | Dadiva Oceanica |
| Feiticeiro | Feiticaria Aberrante | Revelacao em Carne |
| Feiticeiro | Feiticaria Draconica | Asas de Dragao |
| Feiticeiro | Feiticaria Mecanica | Transe da Ordem |
| Feiticeiro | Feiticaria Selvagem | Caos Controlado |
| Mago | Abjurador | Resistencia a Feiticos |
| Mago | Adivinho | Pressagio Maior |
| Mago | Evocador | Sobrecarregar |
| Mago | Ilusionista | Realidade Ilusoria |

Subclasses de Clerigo, Guerreiro, Guardiao, Ladino, Monge e Paladino foram verificadas como sem recurso textual no nivel 14.

## Criterio de selecao

Virou seletor quando a escolha muda algo persistente na ficha. No nivel 14, isso inclui a terceira escolha de `Inimigo Favorito` no Patrulheiro 5e, a escolha de `Sintonia Totemica` do Barbaro Totemico 5e, o registro opcional do `Surto de Magia Selvagem` e as escolhas ja modeladas de Metamagia, manobras, Tiro Arcano, Disciplinas Elementais e armas Kensei. Em 2024, `Aumento no Valor de Atributo` do Guerreiro e tratado pelo fluxo de ASI/talento e omitido do texto final de recursos.

Permaneceu texto quando o recurso descreve uma regra pronta, melhoria passiva, uso temporario ou efeito sem decisao persistente para preview/PDF. Ficou como automacao quando a regra altera contagens, slots, usos, maestrias, invocacoes ou fontes derivadas sem exigir texto novo no dado de classe.

## Melhorias aplicadas

- `scripts/unit/level-14-audit.test.mjs`: nova matriz completa de nivel 14 para dados, contas, seletores e automacoes das edicoes 5e e 5.5e/2024.
- `scripts/smoke-dom.mjs`: removidas as checagens soltas de nivel 14 que duplicavam contratos de configuracao.
- `docs/level-14-class-audit.md`: registro da cobertura e dos criterios usados para texto, selecao e calculo automatico.
