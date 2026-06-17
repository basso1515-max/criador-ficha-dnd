# Auditoria de classes nivel 12

Atualizado em 2026-06-17.

Esta validacao cobre as fichas 5e legacy e 5.5e/2024 no nivel 12. O foco foi fechar a trilha abaixo do nivel 13, separando recurso textual, escolha persistente e automacao para que ASI/talento nao fique dependente de checagem solta no smoke DOM.

## Resultado geral

Status atual: completo para as classes e subclasses cadastradas.

- 5e legacy: nenhuma das 13 classes e nenhuma das 118 subclasses declara recurso textual no nivel 12. O nivel e tratado pelo fluxo de ASI / talento opcional.
- 2024: todas as 12 classes declaram `Aumento no Valor de Atributo` no nivel 12. Nenhuma das 48 subclasses declara recurso textual nesse nivel.
- Selecao 5e: a progressao padrao inclui o nivel 12; Guerreiro usa `[4, 6, 8, 12, 14, 16, 19]` e Ladino usa `[4, 8, 10, 12, 16, 19]`.
- Selecao 2024: a progressao padrao inclui o nivel 12; Guerreiro e Ladino mantem as progressoes extras. `Aumento no Valor de Atributo` e talento geral repetivel e continua omitido do texto final de recursos/PDF.
- Contas 5e: magias, espacos, invocacoes, infusoes, Inimigo Favorito, Explorador Nato, Metamagia, manobras, Tiro Arcano, Disciplinas Elementais e armas Kensei foram fixadas no teste unitario.
- Contas 2024: magias, espacos, furia, inspiracao, Canalizar Divindade, Forma Selvagem, pontos de feiticaria, Ataque Furtivo, Inimigo Favorito, maestrias, Invocacoes Misticas, Arcana Mistica e progressoes de Guerreiro/Monge foram fixadas no teste unitario.
- Propagacao: a busca no `smoke-dom` confirmou que nao havia bloco solto especifico de nivel 12 para migrar. O contrato de texto vs seletor vs automacao agora fica em `scripts/unit/level-12-audit.test.mjs`.

## Matriz 5e

Todas as classes base 5e ficam sem recurso textual no nivel 12:

| Classe | Nivel 12 | Contrato |
| --- | --- | --- |
| Artifice | Sem recurso textual | ASI/talento opcional |
| Barbaro | Sem recurso textual | ASI/talento opcional |
| Bardo | Sem recurso textual | ASI/talento opcional |
| Bruxo | Sem recurso textual | ASI/talento opcional |
| Clerigo | Sem recurso textual | ASI/talento opcional |
| Druida | Sem recurso textual | ASI/talento opcional |
| Feiticeiro | Sem recurso textual | ASI/talento opcional |
| Guerreiro | Sem recurso textual | ASI/talento opcional extra |
| Ladino | Sem recurso textual | ASI/talento opcional extra |
| Mago | Sem recurso textual | ASI/talento opcional |
| Monge | Sem recurso textual | ASI/talento opcional |
| Paladino | Sem recurso textual | ASI/talento opcional |
| Patrulheiro | Sem recurso textual | ASI/talento opcional |

Todas as subclasses 5e foram verificadas como sem recurso textual no nivel 12.

## Matriz 2024

Todas as classes base 2024 declaram `Aumento no Valor de Atributo` no nivel 12:

| Classe | Nivel 12 | Contrato |
| --- | --- | --- |
| Barbaro | Aumento no Valor de Atributo | Talento/ASI geral repetivel |
| Bardo | Aumento no Valor de Atributo | Talento/ASI geral repetivel |
| Bruxo | Aumento no Valor de Atributo | Talento/ASI geral repetivel |
| Clerigo | Aumento no Valor de Atributo | Talento/ASI geral repetivel |
| Druida | Aumento no Valor de Atributo | Talento/ASI geral repetivel |
| Feiticeiro | Aumento no Valor de Atributo | Talento/ASI geral repetivel |
| Guerreiro | Aumento no Valor de Atributo | Talento/ASI geral repetivel com progressao extra |
| Ladino | Aumento no Valor de Atributo | Talento/ASI geral repetivel com progressao extra |
| Mago | Aumento no Valor de Atributo | Talento/ASI geral repetivel |
| Monge | Aumento no Valor de Atributo | Talento/ASI geral repetivel |
| Paladino | Aumento no Valor de Atributo | Talento/ASI geral repetivel |
| Guardiao | Aumento no Valor de Atributo | Talento/ASI geral repetivel |

Todas as subclasses 2024 foram verificadas como sem recurso textual no nivel 12.

## Criterio de selecao

Virou seletor quando a escolha muda algo persistente na ficha. No nivel 12, isso significa ASI/talento em 5e e `Aumento no Valor de Atributo` no fluxo de talentos 2024. Permaneceu texto apenas quando ha recurso descritivo novo; nao ha recurso textual 5e neste nivel, e o texto 2024 de ASI e omitido do PDF porque a decisao real e feita no seletor.

Ficou como automacao quando a regra altera contagens, slots, usos, maestrias, invocacoes ou fontes derivadas sem exigir texto novo no dado de classe. O nivel 12 tambem fixa a primeira Arcana Mistica 2024 do Bruxo, desbloqueada no nivel 11 e ainda ativa no nivel 12.

## Melhorias aplicadas

- `scripts/unit/level-12-audit.test.mjs`: nova matriz completa de nivel 12 para dados, contas, seletores e automacoes das edicoes 5e e 5.5e/2024.
- `scripts/smoke-dom.mjs`: nao havia checagem solta explicita de nivel 12 a remover; a cobertura estrutural ficou no teste unitario.
- `docs/level-12-class-audit.md`: registro da cobertura e dos criterios usados para texto, selecao e calculo automatico.
