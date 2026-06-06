# Auditoria de classes nivel 16

Atualizado em 2026-06-06.

Esta validacao cobre as fichas 5e legacy e 5.5e/2024 no nivel 16. O ponto principal deste nivel e o fluxo de Aumento de Atributo / talento: ele precisa virar escolha persistente e contabilizar no restante da ficha, em vez de aparecer apenas como texto solto.

## Resultado geral

Status atual: completo para as classes e subclasses cadastradas.

- 5e legacy: nenhuma das 13 classes e nenhuma das 118 subclasses declara recurso textual no nivel 16. O nivel e tratado pelo fluxo de ASI / talento opcional.
- 2024: todas as 12 classes declaram `Aumento no Valor de Atributo` no nivel 16. Nenhuma das 48 subclasses declara recurso textual nesse nivel.
- Contas 5e: magias, espacos, invocacoes, infusoes, Inimigo Favorito, Explorador Nato, Metamagia, manobras, Tiro Arcano, Disciplinas Elementais e armas Kensei foram fixadas no teste unitario.
- Contas 2024: magias, espacos, furia, inspiracao, Canalizar Divindade, Forma Selvagem, pontos de feiticaria, Ataque Furtivo, Inimigo Favorito, maestrias, Invocacoes Misticas, Arcana Mistica e progressoes de Guerreiro/Monge foram fixadas no teste unitario.
- Propagacao: o smoke DOM valida que nivel 16 abre controles de ASI/talento. Em 5e, o controle alterna entre aumento de atributo e talento opcional. Em 2024, o slot lista `Aumento no Valor de Atributo` como escolha de talento/ASI.

## Matriz 5e

Todas as classes base 5e ficam sem recurso textual no nivel 16:

| Classe | Nivel 16 | Slots ASI/talento no DOM |
| --- | --- | --- |
| Artifice | Sem recurso textual | 4 |
| Barbaro | Sem recurso textual | 4 |
| Bardo | Sem recurso textual | 4 |
| Bruxo | Sem recurso textual | 4 |
| Clerigo | Sem recurso textual | 4 |
| Druida | Sem recurso textual | 4 |
| Feiticeiro | Sem recurso textual | 4 |
| Guerreiro | Sem recurso textual | 6 |
| Ladino | Sem recurso textual | 5 |
| Mago | Sem recurso textual | 4 |
| Monge | Sem recurso textual | 4 |
| Paladino | Sem recurso textual | 4 |
| Patrulheiro | Sem recurso textual | 4 |

Todas as subclasses 5e foram verificadas como sem recurso textual no nivel 16.

## Matriz 2024

Todas as classes base 2024 declaram `Aumento no Valor de Atributo` no nivel 16:

| Classe | Nivel 16 | Slots de talento/ASI no DOM |
| --- | --- | --- |
| Barbaro | Aumento no Valor de Atributo | 4 |
| Bardo | Aumento no Valor de Atributo | 4 |
| Bruxo | Aumento no Valor de Atributo | 4 |
| Clerigo | Aumento no Valor de Atributo | 4 |
| Druida | Aumento no Valor de Atributo | 4 |
| Feiticeiro | Aumento no Valor de Atributo | 4 |
| Guerreiro | Aumento no Valor de Atributo | 6 |
| Ladino | Aumento no Valor de Atributo | 5 |
| Mago | Aumento no Valor de Atributo | 4 |
| Monge | Aumento no Valor de Atributo | 4 |
| Paladino | Aumento no Valor de Atributo | 4 |
| Guardiao | Aumento no Valor de Atributo | 4 |

Todas as subclasses 2024 foram verificadas como sem recurso textual no nivel 16.

## Criterio de selecao

`Aumento no Valor de Atributo` e uma escolha persistente. Em 5e, a ficha oferece aumento de atributo ou talento opcional. Em 2024, a ficha usa o fluxo de talentos e inclui `Aumento no Valor de Atributo` como uma opcao elegivel. Por isso, o recurso e omitido do texto final de recursos 2024 e validado como escolha no DOM.

## Melhorias aplicadas

- `scripts/unit/level-16-audit.test.mjs`: nova matriz completa de nivel 16 para dados, contas e contrato de ASI no PDF 2024.
- `scripts/smoke-dom.mjs`: smoke agora valida slots de ASI/talento no nivel 16 para todas as classes 5e e 2024, incluindo contagens extras de Guerreiro e Ladino.
- `docs/level-16-class-audit.md`: registro da cobertura e dos criterios usados para texto, selecao e calculo automatico.
