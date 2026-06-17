# Auditoria de classes nivel 9

Atualizado em 2026-06-17.

Esta validacao cobre as fichas 5e legacy e 5.5e/2024 no nivel 9. O foco foi fechar a trilha abaixo do nivel 10, conferindo recurso textual, escolha persistente, automacao, fontes automaticas de magia e divergencias contra o fluxo oficial esperado para classe e subclasse.

## Resultado geral

Status atual: completo para as classes e subclasses cadastradas.

- 5e legacy: 4 das 13 classes declaram recurso textual no nivel 9. A auditoria encontrou uma divergencia no dataset 5e legado: recursos oficiais de classe desse nivel estavam ausentes. A versao do dataset subiu para `0.2.6` e agora inclui Barbaro, Bardo, Guerreiro e Monge.
- 5e legacy: 13 das 118 subclasses declaram recurso textual no nivel 9, concentradas em Artifice e Ladino. As demais 105 subclasses nao declaram recurso textual nesse nivel.
- 2024: 7 das 12 classes declaram recurso textual no nivel 9: Barbaro, Bardo, Bruxo, Guerreiro, Monge, Paladino e Guardiao.
- 2024: 4 das 48 subclasses declaram recurso textual no nivel 9, todas de Ladino.
- Selecao 5e: Patrulheiro ainda tem 2 Inimigos Favoritos e 2 terrenos de Explorador Nato; Feiticeiro mantem 2 Metamagias; Mestre de Batalha fica com 5 manobras; Arqueiro Arcano com 3 tiros; Quatro Elementos com 2 disciplinas; Kensei com 3 armas.
- Selecao 2024: Bardo e Guardiao abrem 2 escolhas de Expertise no nivel 9; Feiticeiro mantem 2 Metamagias; Mestre de Batalha fica com 5 manobras; Bruxo ainda nao recebe Arcana Mistica.
- Contas 5e: magias, espacos, invocacoes, infusoes, Inimigo Favorito, Explorador Nato, Metamagia, manobras, Tiro Arcano, Disciplinas Elementais e armas Kensei foram fixadas no teste unitario.
- Contas 2024: magias, espacos, furia, inspiracao, Canalizar Divindade, Forma Selvagem, pontos de feiticaria, Ataque Furtivo, Inimigo Favorito, maestrias, Invocacoes Misticas e progressoes de Guerreiro/Monge foram fixadas no teste unitario.
- Propagacao: nao havia checagem solta real de nivel 9 no `smoke-dom`; o contrato de texto vs seletor vs automacao agora fica em `scripts/unit/level-9-audit.test.mjs`.

## Matriz 5e

Classes base 5e no nivel 9:

| Classe | Nivel 9 | Contrato |
| --- | --- | --- |
| Artifice | Sem recurso textual | Subclasses e meia conjuracao |
| Barbaro | Critico Brutal | Texto de classe |
| Bardo | Cancao de Descanso (d8) | Texto de melhoria de classe |
| Bruxo | Sem recurso textual | Magia de pacto e invocacoes |
| Clerigo | Sem recurso textual | Conjuracao preparada completa |
| Druida | Sem recurso textual | Conjuracao preparada completa |
| Feiticeiro | Sem recurso textual | Conjuracao e Metamagia |
| Guerreiro | Indomavel | Texto de classe |
| Ladino | Sem recurso textual | Subclasses e Ataque Furtivo |
| Mago | Sem recurso textual | Conjuracao preparada completa |
| Monge | Movimento sem Armadura Aprimorado | Texto de classe |
| Paladino | Sem recurso textual | Meia conjuracao e magias de juramento |
| Patrulheiro | Sem recurso textual | Meia conjuracao e magias de subclasse |

Subclasses 5e com recurso textual no nivel 9:

| Classe | Subclasse | Nivel 9 |
| --- | --- | --- |
| Artifice | Alquimista | Reagentes Restauradores |
| Artifice | Armeiro | Modificacoes de Armadura |
| Artifice | Artilheiro | Canhao Explosivo |
| Artifice | Ferreiro de Batalha | Defesa Reforcada |
| Ladino | Assassino | Infiltracao Especialista |
| Ladino | Batedor | Mobilidade Superior |
| Ladino | Duelista | Panache |
| Ladino | Faca da Alma | Energia Psiquica |
| Ladino | Fantasma | Alma Errante |
| Ladino | Inquiridor | Leitura de Movimento |
| Ladino | Ladrao | Furtividade Suprema |
| Ladino | Mentor | Manipulador Perspicaz |
| Ladino | Trapaceiro Arcano | Emboscada Magica |

Todas as demais subclasses 5e foram verificadas como sem recurso textual no nivel 9.

## Matriz 2024

Classes base 2024 no nivel 9:

| Classe | Nivel 9 | Contrato |
| --- | --- | --- |
| Barbaro | Golpe Brutal | Texto de classe e automacao de furia/maestria |
| Bardo | Especialista Adicional | Texto de classe e seletor de Expertise |
| Bruxo | Contatar Patrono | Texto de classe e invocacoes |
| Clerigo | Sem recurso textual | Conjuracao preparada completa |
| Druida | Sem recurso textual | Conjuracao preparada e Forma Selvagem |
| Feiticeiro | Sem recurso textual | Conjuracao, pontos e Metamagia |
| Guerreiro | Indomavel; Mestre Tatico | Texto de classe e progressao marcial |
| Ladino | Sem recurso textual | Subclasses e Ataque Furtivo |
| Mago | Sem recurso textual | Conjuracao preparada completa |
| Monge | Movimento Acrobatico | Texto de classe e progressao de foco |
| Paladino | Repudiar Inimigos | Texto de classe e Canalizar Divindade |
| Guardiao | Especialista | Texto de classe e seletor de Expertise |

Subclasses 2024 com recurso textual no nivel 9:

| Classe | Subclasse | Nivel 9 |
| --- | --- | --- |
| Ladino | Faca da Alma | Laminas da Alma |
| Ladino | Assassino | Especialista em Infiltracao |
| Ladino | Ladrao | Furtividade Suprema |
| Ladino | Trapaceiro Arcano | Emboscador Magico |

Todas as demais subclasses 2024 foram verificadas como sem recurso textual no nivel 9.

## Criterio de selecao

Virou seletor quando a decisao muda algo persistente na ficha. No nivel 9, isso cobre as escolhas de Expertise de Bardo e Guardiao 2024 e os seletores ja ativos de Patrulheiro, Feiticeiro, Mestre de Batalha, Arqueiro Arcano, Monge Quatro Elementos e Kensei.

Ficou como automacao quando a regra altera contagens, slots, usos, dados, invocacoes ou fontes derivadas sem exigir texto novo no dado de classe. O nivel 9 tambem valida as fontes automaticas de magia: magias de Artifice 5e, juramentos de Paladino 5e/2024, subclasses de Patrulheiro 5e e Circulo da Terra/Circulos de Druida 2024.

## Verificacao oficial

Foi encontrada e corrigida uma divergencia no dataset 5e legacy: os recursos textuais oficiais de classe do nivel 9 nao estavam cadastrados para Barbaro, Bardo, Guerreiro e Monge. As melhorias que sao apenas contagem ou fonte derivada continuam estruturadas como automacao ou seletor, nao como texto duplicado.

Na edicao 5.5e/2024, a matriz local ja estava alinhada ao fluxo esperado: classes com texto mantem texto, Expertise de Bardo/Guardiao fica em seletor estruturado e o Bruxo segue sem Arcana Mistica antes do nivel 11.

## Melhorias aplicadas

- `src/data/5e/classes.js`: dataset 5e atualizado para `0.2.6` com recursos textuais oficiais de classe no nivel 9.
- `scripts/unit/level-9-audit.test.mjs`: nova matriz completa de nivel 9 para dados, contas, seletores, fontes automaticas e automacoes das edicoes 5e e 5.5e/2024.
- `scripts/smoke-dom.mjs`: nao havia checagem solta real de nivel 9 a remover; a cobertura estrutural ficou no teste unitario.
- `docs/level-9-class-audit.md`: registro da cobertura, da divergencia corrigida e dos criterios usados para texto, selecao e calculo automatico.
