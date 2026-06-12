# Auditoria de classes nivel 13

Atualizado em 2026-06-12.

Esta validacao cobre as fichas 5e legacy e 5.5e/2024 no nivel 13. O foco foi conferir todas as classes e subclasses cadastradas, separar texto de selecao persistente e fixar as contas automaticas que alimentam magia, preview, resumo e PDF.

## Resultado geral

Status atual: completo para as classes e subclasses cadastradas.

- 5e legacy: apenas Bruxo declara recurso textual de classe no nivel 13: `Arcano Mistico (7o circulo)`. As outras 12 classes foram verificadas como sem recurso textual nesse nivel.
- 5e legacy: 9 subclasses declaram recurso textual no nivel 13, todas de Ladino. As outras 109 subclasses foram verificadas como sem recurso textual no nivel.
- 2024: Barbaro, Bruxo, Guerreiro, Monge e Guardiao declaram recurso textual no nivel 13. As outras 7 classes nao declaram recurso textual nesse nivel.
- 2024: 4 subclasses declaram recurso textual no nivel 13, todas de Ladino. As outras 44 subclasses foram verificadas como sem recurso textual no nivel.
- Contas 5e: magias, espacos, invocacoes, infusoes, Inimigo Favorito, Explorador Nato, Metamagia, manobras, Tiro Arcano, Disciplinas Elementais e armas Kensei foram fixadas no teste unitario.
- Contas 2024: magias, espacos, furia, inspiracao, Canalizar Divindade, Forma Selvagem, pontos de feiticaria, Ataque Furtivo, Inimigo Favorito, maestrias, Invocacoes Misticas, Arcana Mistica e progressoes de Guerreiro/Monge foram fixadas no teste unitario.
- Propagacao: o smoke DOM valida que todos os recursos textuais de nivel 13 aparecem no preview/resumo. O teste unitario tambem fixa os seletores e fontes automaticas de Arcano Mistico 5e, Arcana Mistica 2024, magias concedidas de Artifice/Patrulheiro/Paladino e escolhas persistentes ja existentes.

## Matriz 5e

| Classe | Nivel 13 |
| --- | --- |
| Artifice | Sem recurso textual |
| Barbaro | Sem recurso textual |
| Bardo | Sem recurso textual |
| Bruxo | Arcano Mistico (7o circulo) |
| Clerigo | Sem recurso textual |
| Druida | Sem recurso textual |
| Feiticeiro | Sem recurso textual |
| Guerreiro | Sem recurso textual |
| Ladino | Sem recurso textual |
| Mago | Sem recurso textual |
| Monge | Sem recurso textual |
| Paladino | Sem recurso textual |
| Patrulheiro | Sem recurso textual |

| Classe | Subclasse | Nivel 13 |
| --- | --- | --- |
| Ladino | Assassino | Impostor |
| Ladino | Batedor | Emboscador |
| Ladino | Espadachim | Manobra Elegante |
| Ladino | Faca d'Alma | Veu Psiquico |
| Ladino | Fantasma | Forma Fantasmagorica |
| Ladino | Inquiridor | Olho Impecavel |
| Ladino | Ladrao | Uso de Dispositivos |
| Ladino | Mestre das Intrigas | Desvio |
| Ladino | Trapaceiro Arcano | Enganador Versatil |

Subclasses de Artifice, Barbaro, Bardo, Bruxo, Clerigo, Druida, Feiticeiro, Guerreiro, Mago, Monge, Paladino e Patrulheiro foram verificadas como sem recurso textual no nivel 13.

## Matriz 2024

| Classe | Nivel 13 |
| --- | --- |
| Barbaro | Golpe Brutal Aprimorado (13o nivel) |
| Bardo | Sem recurso textual |
| Bruxo | Arcana Mistica (7o circulo) |
| Clerigo | Sem recurso textual |
| Druida | Sem recurso textual |
| Feiticeiro | Sem recurso textual |
| Guerreiro | Indomavel Aprimorado; Ataques Estudados |
| Ladino | Sem recurso textual |
| Mago | Sem recurso textual |
| Monge | Defletir Energia |
| Paladino | Sem recurso textual |
| Guardiao | Predador Implacavel |

| Classe | Subclasse | Nivel 13 |
| --- | --- | --- |
| Ladino | Faca da Alma | Veu Psiquico |
| Ladino | Assassino | Envenenar Armas |
| Ladino | Ladrao | Usar Dispositivo Magico |
| Ladino | Trapaceiro Arcano | Trapaceiro Versatil |

Subclasses de Barbaro, Bardo, Bruxo, Clerigo, Druida, Feiticeiro, Guerreiro, Guardiao, Mago, Monge e Paladino foram verificadas como sem recurso textual no nivel 13.

## Criterio de selecao

Virou seletor quando a escolha muda algo persistente na ficha. No nivel 13, isso inclui o picker de `Arcano Mistico de 7o circulo` no 5e, a fonte de `Arcana Mistica (7o circulo)` no 2024, magias de juramento, magias de Artifice/Patrulheiro e os seletores ja existentes de Metamagia, manobras, Tiro Arcano, Disciplinas Elementais e armas Kensei. Permaneceu texto quando o recurso descreve uma regra pronta, melhoria passiva, uso temporario ou efeito sem decisao persistente para preview/PDF, como os recursos de Ladino do nivel 13.

## Melhorias aplicadas

- `scripts/unit/level-13-audit.test.mjs`: nova matriz completa de nivel 13 para dados, contas, seletores e fontes automaticas.
- `scripts/smoke-dom.mjs`: smoke agora percorre todos os recursos textuais de classe/subclasse 5e e 2024 no nivel 13.
- `docs/level-13-class-audit.md`: registro da cobertura e dos criterios usados para texto, selecao e calculo automatico.
