# Auditoria de classes nivel 10

Atualizado em 2026-06-17.

Esta validacao cobre as fichas 5e legacy e 5.5e/2024 no nivel 10. O foco foi fechar a trilha abaixo do nivel 11, conferindo recurso textual, escolha persistente, automacao e divergencias contra o fluxo oficial esperado para classe e subclasse.

## Resultado geral

Status atual: completo para as classes e subclasses cadastradas.

- 5e legacy: 6 das 13 classes declaram recurso textual no nivel 10. A auditoria encontrou uma divergencia no dataset 5e legado: recursos oficiais de classe desse nivel estavam ausentes. A versao do dataset subiu para `0.2.5` e agora inclui Artifice, Bardo, Clerigo, Monge, Paladino e Patrulheiro.
- 5e legacy: 48 das 118 subclasses declaram recurso textual no nivel 10, concentradas em Barbaro, Bruxo, Druida, Guerreiro e Mago. As demais 70 subclasses nao declaram recurso textual nesse nivel.
- 2024: 7 das 12 classes declaram recurso textual no nivel 10: Bardo, Clerigo, Feiticeiro, Ladino, Monge, Paladino e Guardiao.
- 2024: 20 das 48 subclasses declaram recurso textual no nivel 10, concentradas em Barbaro, Bruxo, Druida, Guerreiro e Mago.
- Selecao 5e: Segredos Magicos do Bardo abre 2 magias de qualquer lista; Bardo tambem ganha 2 expertises; Ladino recebe ASI/talento no fluxo de `CLASS_FEAT_OPTION_LEVELS`; Patrulheiro recebe o terceiro terreno de Explorador Nato; Feiticeiro recebe a terceira Metamagia; Bruxo Infernal abre Resiliencia Infernal; Mestre de Batalha chega a 7 manobras.
- Selecao 2024: Metamagia do Feiticeiro chega a 4 opcoes; Mestre de Batalha chega a 7 manobras; ASI do Ladino permanece escolha e segue omitido do texto final/PDF.
- Contas 5e: magias, espacos, invocacoes, infusoes, Inimigo Favorito, Explorador Nato, Metamagia, manobras, Tiro Arcano, Disciplinas Elementais e armas Kensei foram fixadas no teste unitario.
- Contas 2024: magias, espacos, furia, inspiracao, Canalizar Divindade, Forma Selvagem, pontos de feiticaria, Ataque Furtivo, Inimigo Favorito, maestrias, Invocacoes Misticas e progressoes de Guerreiro/Monge foram fixadas no teste unitario.
- Propagacao: a checagem solta de Bruxo Infernal nivel 10 foi removida do `smoke-dom`; o contrato de texto vs seletor vs automacao agora fica em `scripts/unit/level-10-audit.test.mjs`.

## Matriz 5e

Classes base 5e no nivel 10:

| Classe | Nivel 10 | Contrato |
| --- | --- | --- |
| Artifice | Adepto de Itens Magicos | Texto de classe e automacao de infusoes |
| Barbaro | Sem recurso textual | Recurso vem da subclasse |
| Bardo | Expertise; Segredos Magicos | Texto de classe, seletor de expertise e seletor de magias |
| Bruxo | Sem recurso textual | Recurso vem da subclasse/patrono |
| Clerigo | Intervencao Divina | Texto de classe |
| Druida | Sem recurso textual | Recurso vem da subclasse |
| Feiticeiro | Sem recurso textual | Metamagia e automacao de pontos |
| Guerreiro | Sem recurso textual | Recurso vem da subclasse |
| Ladino | Sem recurso textual | ASI/talento opcional extra |
| Mago | Sem recurso textual | Recurso vem da subclasse |
| Monge | Pureza do Corpo | Texto de classe |
| Paladino | Aura de Coragem | Texto de classe |
| Patrulheiro | Esconder-se a Vista de Todos | Texto de classe e terceiro terreno de Explorador Nato |

Subclasses 5e com recurso textual no nivel 10:

| Classe | Subclasse | Nivel 10 |
| --- | --- | --- |
| Barbaro | Fera | Furia Infecciosa |
| Barbaro | Magia Selvagem | Fluxo Instavel |
| Barbaro | Arauto da Tempestade | Escudo Tempestuoso |
| Barbaro | Espinhos | Investida do Batalhador |
| Barbaro | Berserker | Intimidacao |
| Barbaro | Fanatico | Presenca Fanatica |
| Barbaro | Gigante | Forma Gigante |
| Barbaro | Guardiao Ancestral | Consulta Espiritual |
| Barbaro | Coracao Selvagem | Andarilho Espiritual |
| Bruxo | Arquifada | Defesas Sedutoras |
| Bruxo | Lamina Maldita | Armadura das Maldicoes |
| Bruxo | Celestial | Resiliencia Celestial |
| Bruxo | Genio | Recipiente Santuario |
| Bruxo | Grande Antigo | Escudo Mental |
| Bruxo | Imperecivel | Natureza Imperecivel |
| Bruxo | Infernal | Resiliencia Infernal |
| Bruxo | Abismal | Tentaculos Aprisionantes |
| Bruxo | Morto-Vivo | Casca Necromantica |
| Druida | Lua | Forma Elemental |
| Druida | Terra | Camuflagem Natural |
| Druida | Estrelas | Constelacoes Brilhantes |
| Druida | Fogo Selvagem | Transporte Ardente |
| Druida | Pastor | Espirito Guardiao |
| Druida | Esporos | Esporos Expandido |
| Druida | Sonhos | Protecao dos Sonhos |
| Guerreiro | Arqueiro Arcano | Tiro Aprimorado |
| Guerreiro | Campeao | Estilo de Combate Adicional |
| Guerreiro | Cavaleiro | Mantenha a Formacao |
| Guerreiro | Cavaleiro Arcano | Golpe Mistico |
| Guerreiro | Cavaleiro do Eco | Sombra Protetora |
| Guerreiro | Cavaleiro Runico | Grande Estatura |
| Guerreiro | Guerreiro Psiquico | Escudo Psiquico |
| Guerreiro | Mestre de Batalha | Superioridade Aprimorada |
| Guerreiro | Porta-Estandarte | Surto Inspirador |
| Guerreiro | Samurai | Espirito Incansavel |
| Mago | Cronurgista | Aceleracao Arcana |
| Mago | Abjuracao | Melhoria na Abjuracao |
| Mago | Adivinhacao | Terceiro Olho |
| Mago | Conjuracao | Foco em Conjuracao |
| Mago | Evocacao | Evocacao Potente |
| Mago | Ilusao | Ilusao Ilusoria |
| Mago | Necromancia | Resistencia Necrotica |
| Mago | Transmutacao | Moldar Forma |
| Mago | Encantamento | Encantamento Dividido |
| Mago | Graviturgista | Pressao Intensa |
| Mago | Lamina Cantante | Defesa Arcana |
| Mago | Guerra | Escudo Duravel |
| Mago | Escribas | Maestria de Pergaminhos |

Todas as demais subclasses 5e foram verificadas como sem recurso textual no nivel 10.

## Matriz 2024

Classes base 2024 no nivel 10:

| Classe | Nivel 10 | Contrato |
| --- | --- | --- |
| Barbaro | Sem recurso textual | Recurso vem da subclasse |
| Bardo | Segredos Magicos | Texto de classe e expansao de lista de magias |
| Bruxo | Sem recurso textual | Recurso vem da subclasse/patrono |
| Clerigo | Intervencao Divina | Texto de classe |
| Druida | Sem recurso textual | Recurso vem da subclasse |
| Feiticeiro | Metamagia Adicional | Texto de classe e seletor de Metamagia |
| Guerreiro | Sem recurso textual | Recurso vem da subclasse |
| Ladino | Aumento no Valor de Atributo | Talento/ASI omitido do texto final/PDF |
| Mago | Sem recurso textual | Recurso vem da subclasse |
| Monge | Foco Aprimorado; Restauro Pessoal | Texto de classe e automacao de foco |
| Paladino | Aura de Coragem | Texto de classe |
| Guardiao | Incansavel | Texto de classe e meia conjuracao |

Subclasses 2024 com recurso textual no nivel 10:

| Classe | Subclasse | Nivel 10 |
| --- | --- | --- |
| Barbaro | Arvore do Mundo | Raizes Devastadoras |
| Barbaro | Berserker | Retaliacao |
| Barbaro | Coracao Selvagem | Arauto da Natureza |
| Barbaro | Fanatico | Presenca Zelosa |
| Bruxo | Arquifada | Defesas Sedutoras |
| Bruxo | Celestial | Resiliencia Celestial |
| Bruxo | Grande Antigo | Danacao Mistica; Escudo Mental |
| Bruxo | Infernal | Resistencia Infera |
| Druida | Lua | Passo Lunar |
| Druida | Terra | Protecao Natural |
| Druida | Estrelas | Constelacoes Cintilantes |
| Druida | Mar | Nascido da Tempestade |
| Guerreiro | Campeao | Combatente Heroico |
| Guerreiro | Cavaleiro Arcano | Golpe Mistico |
| Guerreiro | Guerreiro Psiquico | Resguardo Mental |
| Guerreiro | Mestre de Batalha | Superioridade em Combate Aprimorada |
| Mago | Abjuracao | Quebrador de Magias |
| Mago | Adivinhacao | Terceiro Olho |
| Mago | Evocacao | Evocacao Potencializada |
| Mago | Ilusao | Eu Ilusorio |

Todas as demais subclasses 2024 foram verificadas como sem recurso textual no nivel 10.

## Criterio de selecao

Virou seletor quando a decisao muda algo persistente na ficha. No nivel 10, isso cobre Segredos Magicos e Expertise do Bardo 5e, ASI/talento extra do Ladino 5e, Explorador Nato do Patrulheiro 5e, Metamagia do Feiticeiro 5e/2024, Resiliencia Infernal do Bruxo Infernal 5e e manobras do Mestre de Batalha 5e/2024.

Ficou como automacao quando a regra altera contagens, slots, usos, maestrias, dados, invocacoes ou fontes derivadas sem exigir texto novo no dado de classe. O Bruxo 2024 ainda nao tem Arcana Mistica no nivel 10, entao a lista automatica de Arcana Mistica permanece vazia ate o nivel 11.

## Verificacao oficial

Foi encontrada e corrigida uma divergencia no dataset 5e legacy: os recursos textuais oficiais de classe do nivel 10 nao estavam cadastrados para Artifice, Bardo, Clerigo, Monge, Paladino e Patrulheiro. As escolhas oficiais que nao devem virar texto duplicado continuam nos fluxos estruturados: ASI/talento, expertise, fontes de magia, Metamagia, Explorador Nato e escolhas de subclasse.

Na edicao 5.5e/2024, a matriz local ja estava alinhada ao fluxo esperado: classes com texto mantem texto, ASI do Ladino segue no seletor/omissao de PDF e Metamagia/Manobras ficam em escolhas estruturadas.

## Melhorias aplicadas

- `src/data/5e/classes.js`: dataset 5e atualizado para `0.2.5` com recursos textuais oficiais de classe no nivel 10.
- `scripts/unit/level-10-audit.test.mjs`: nova matriz completa de nivel 10 para dados, contas, seletores, fontes automaticas e automacoes das edicoes 5e e 5.5e/2024.
- `scripts/smoke-dom.mjs`: removida a checagem solta de Bruxo Infernal nivel 10; o teste DOM permanece focado no fluxo visual.
- `docs/level-10-class-audit.md`: registro da cobertura, da divergencia corrigida e dos criterios usados para texto, selecao e calculo automatico.
