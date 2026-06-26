# Auditoria de classes nivel 4

Atualizado em 2026-06-26.

Esta validacao cobre as fichas 5e legacy e 5.5e/2024 no nivel 4. O foco foi fechar a trilha anterior ao nivel 5, separando recurso textual, escolha persistente e automacao para que ASI/talento e Maestria em Arma nao dependam de checagens soltas no smoke DOM.

## Resultado geral

Status atual: completo para as classes e subclasses cadastradas.

- 5e legacy: nenhuma das 13 classes e nenhuma das 118 subclasses declara recurso textual no nivel 4. O nivel e tratado pelo fluxo de ASI / talento opcional.
- 2024: todas as 12 classes declaram `Aumento no Valor de Atributo` no nivel 4. Monge tambem declara `Queda Lenta`.
- 2024: nenhuma das 48 subclasses declara recurso textual nesse nivel.
- Selecao 5e: a progressao padrao inclui o nivel 4; Guerreiro e Ladino tambem incluem esse marco em suas progressoes extras.
- Selecao 2024: a progressao padrao de talentos inclui o nivel 4; Guerreiro e Ladino mantem progressoes extras. `Aumento no Valor de Atributo` e talento geral repetivel e continua omitido do texto final de recursos/PDF.
- Maestria 2024: a cobertura solta de `smoke-dom` para Barbaro nivel 4 e Mestre das Armas foi migrada para `scripts/unit/level-4-audit.test.mjs`; o e2e de PDF 2024 continua validando o fluxo real de exportacao.
- Contas 5e e 2024: magias, espacos, invocacoes, infusoes, metamagia, manobras, tiros arcanos, disciplinas, armas Kensei, Canalizar Divindade, Forma Selvagem, Furia, Foco, Ataque Furtivo e maestrias foram fixados no teste unitario.

## Matriz 5e

Todas as classes base 5e ficam sem recurso textual no nivel 4:

| Classe | Nivel 4 | Contrato |
| --- | --- | --- |
| Artifice | Sem recurso textual | ASI/talento opcional; infusoes e meia conjuracao |
| Barbaro | Sem recurso textual | ASI/talento opcional; Furia automatica |
| Bardo | Sem recurso textual | ASI/talento opcional; conjuracao automatica |
| Bruxo | Sem recurso textual | ASI/talento opcional; invocacoes e pacto automaticos |
| Clerigo | Sem recurso textual | ASI/talento opcional; Canalizar Divindade automatico |
| Druida | Sem recurso textual | ASI/talento opcional; Forma Selvagem automatica |
| Feiticeiro | Sem recurso textual | ASI/talento opcional; Metamagia e pontos automaticos |
| Guerreiro | Sem recurso textual | ASI/talento opcional extra |
| Ladino | Sem recurso textual | ASI/talento opcional extra; Ataque Furtivo automatico |
| Mago | Sem recurso textual | ASI/talento opcional; conjuracao automatica |
| Monge | Sem recurso textual | ASI/talento opcional; Ki e movimento automaticos |
| Paladino | Sem recurso textual | ASI/talento opcional; meia conjuracao |
| Patrulheiro | Sem recurso textual | ASI/talento opcional; meia conjuracao e escolhas persistentes |

Todas as subclasses 5e foram verificadas como sem recurso textual no nivel 4.

## Matriz 2024

Todas as classes base 2024 declaram `Aumento no Valor de Atributo`; Monge tambem recebe `Queda Lenta`:

| Classe | Nivel 4 | Contrato |
| --- | --- | --- |
| Barbaro | Aumento no Valor de Atributo | Talento/ASI geral repetivel; 3 maestrias automaticas |
| Bardo | Aumento no Valor de Atributo | Talento/ASI geral repetivel |
| Bruxo | Aumento no Valor de Atributo | Talento/ASI geral repetivel; 3 invocacoes |
| Clerigo | Aumento no Valor de Atributo | Talento/ASI geral repetivel |
| Druida | Aumento no Valor de Atributo | Talento/ASI geral repetivel |
| Feiticeiro | Aumento no Valor de Atributo | Talento/ASI geral repetivel; Metamagia ja estruturada |
| Guerreiro | Aumento no Valor de Atributo | Talento/ASI geral repetivel com progressao extra; 4 maestrias |
| Ladino | Aumento no Valor de Atributo | Talento/ASI geral repetivel com progressao extra; Ataque Furtivo automatico |
| Mago | Aumento no Valor de Atributo | Talento/ASI geral repetivel |
| Monge | Aumento no Valor de Atributo; Queda Lenta | ASI por seletor; Queda Lenta como texto de classe |
| Paladino | Aumento no Valor de Atributo | Talento/ASI geral repetivel; 2 maestrias |
| Guardiao | Aumento no Valor de Atributo | Talento/ASI geral repetivel; 2 maestrias |

Todas as subclasses 2024 foram verificadas como sem recurso textual no nivel 4.

## Criterio de selecao

Virou seletor quando a escolha muda algo persistente na ficha. No nivel 4, isso cobre ASI/talento em 5e, talento geral em 2024, Metamagia, manobras, Tiro Arcano, Disciplinas Elementais, armas Kensei, Inimigo Favorito, Explorador Nato, Maestria em Arma e a maestria adicional de `Mestre das Armas`.

Permaneceu texto quando ha recurso descritivo novo. Em 5e nao ha recurso textual nesse nivel. Em 2024, `Aumento no Valor de Atributo` aparece no dado de classe mas e omitido do PDF final porque a escolha real fica no seletor de talentos; `Queda Lenta` do Monge permanece texto.

Ficou como automacao quando a regra altera contagens, slots, usos, dados, maestrias ou fontes derivadas sem exigir texto novo. A auditoria fixa esses valores para as duas edicoes.

## Melhorias aplicadas

- `scripts/unit/level-4-audit.test.mjs`: nova matriz completa de nivel 4 para dados, contas, seletores e automacoes das edicoes 5e e 5.5e/2024.
- `scripts/smoke-dom.mjs`: removidas duas checagens soltas de Barbaro 2024 nivel 4 e `Mestre das Armas`; a validacao estrutural ficou no teste unitario.
- `docs/level-4-class-audit.md`: registro da cobertura e dos criterios usados para texto, selecao e calculo automatico.
