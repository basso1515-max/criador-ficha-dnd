# Auditoria de classes nivel 3

Atualizado em 2026-06-26.

Esta validacao cobre as fichas 5e legacy e 5.5e/2024 no nivel 3. O foco foi fechar a trilha em que subclasses passam a dominar o avancamento, separando recurso textual, escolha persistente e automacao para que texto, seletor e PDF nao fiquem desalinhados.

## Resultado geral

Status atual: completo para as classes e subclasses cadastradas.

- 5e legacy: 2 das 13 classes declaram recurso textual no nivel 3: Bruxo e Paladino.
- 5e legacy: 67 das 118 subclasses declaram recurso textual no nivel 3. As demais subclasses de classes que escolhem arquétipo antes ou depois desse marco permanecem sem texto nesse nivel.
- 2024: todas as 12 classes declaram recurso textual no nivel 3, normalmente o desbloqueio de subclasse. Barbaro, Ladino, Monge e Paladino tambem recebem recurso de classe nesse marco.
- 2024: todas as 48 subclasses declaram recurso textual no nivel 3.
- Selecao 5e: o nivel 3 abre pacto de Bruxo, Metamagia de Feiticeiro, escolhas de subclasse como Modelo de Armadura, Totem, manobras, runas, tiros arcanos, disciplinas elementais, Presa do Cacador, armas Kensei, proficiencias de subclasse e companheiros.
- Selecao 2024: o nivel 3 abre manobras do Mestre da Batalha, Presa do Cacador do Guardiao, detalhe de terreno do Circulo da Terra e companheiro primal do Senhor das Feras. Talentos/ASI continuam fora desse nivel nas duas edicoes.
- Automacao: a auditoria fixa magias, espacos, invocacoes, infusoes, Metamagia, Canalizar Divindade, Forma Selvagem, Furia, Foco, Ataque Furtivo, maestrias e fontes automaticas de magia nas duas edicoes.

## Matriz 5e

| Classe | Nivel 3 | Contrato |
| --- | --- | --- |
| Artifice | Sem recurso textual de classe | Subclasses, infusoes e meia conjuracao |
| Barbaro | Sem recurso textual de classe | Subclasses e Furia automatica |
| Bardo | Sem recurso textual de classe | Subclasses, Expertise e conjuracao |
| Bruxo | Dadiva do Pacto | Texto, seletor de pacto e filtro de invocacoes |
| Clerigo | Sem recurso textual de classe | Dominios e Canalizar Divindade |
| Druida | Sem recurso textual de classe | Circulos, Forma Selvagem e fontes de magia |
| Feiticeiro | Sem recurso textual de classe | Metamagia e origem feiticeira |
| Guerreiro | Sem recurso textual de classe | Subclasses e escolhas marciais |
| Ladino | Sem recurso textual de classe | Subclasses e Ataque Furtivo |
| Mago | Sem recurso textual de classe | Algumas tradicoes ja entram no nivel 2 |
| Monge | Sem recurso textual de classe | Tradicoes, Ki e dado marcial |
| Paladino | Saude Divina; Juramento | Texto, Juramento, Canalizar Divindade e magias automaticas |
| Patrulheiro | Sem recurso textual de classe | Subclasses, meia conjuracao e seletores persistentes |

Subclasses 5e com cobertura textual no nivel 3:

| Grupo | Quantidade | Observacao |
| --- | ---: | --- |
| Artifice | 4 | Especializacoes e fontes de magia |
| Barbaro | 9 | Caminhos e escolhas como Totem/Surto |
| Bardo | 8 | Colegios e recursos de Inspiracao/Proficiencia |
| Guerreiro | 10 | Arquétipos, manobras, runas, tiros e conjuracao |
| Ladino | 9 | Arquétipos, proficiencias e conjuracao |
| Monge | 10 | Tradicoes, armas Kensei e disciplinas |
| Paladino | 9 | Juramentos, Canalizar Divindade e magias de juramento |
| Patrulheiro | 8 | Arquétipos, Presa do Cacador e companheiros |

Todas as magias de juramento 5e automatizadas agora possuem tambem o recurso textual `Magias de Juramento` no nivel 3.

## Matriz 2024

| Classe | Nivel 3 | Contrato |
| --- | --- | --- |
| Barbaro | Conhecimento Primal; Subclasse de Barbaro | Texto, Furia e maestria automaticas |
| Bardo | Subclasse de Bardo | Texto, Inspiração e conjuracao |
| Bruxo | Subclasse de Bruxo | Texto, invocacoes e magias de pacto |
| Clerigo | Subclasse de Clerigo | Texto, Canalizar Divindade e dominios |
| Druida | Subclasse de Druida | Texto, Forma Selvagem e circulos |
| Feiticeiro | Subclasse de Feiticeiro | Texto, pontos, Metamagia e magias de origem |
| Guerreiro | Subclasse de Guerreiro | Texto, Recuperar Folego e maestrias |
| Ladino | Mira Firme; Subclasse de Ladino | Texto e Ataque Furtivo automatico |
| Mago | Subclasse de Mago | Texto, Acadêmico e conjuracao |
| Monge | Defletir Ataques; Subclasse de Monge | Texto, foco, dado marcial e movimento |
| Paladino | Canalizar Divindade; Subclasse de Paladino | Texto, usos e magias de juramento |
| Guardiao | Subclasse de Guardiao | Texto, Inimigo Favorito e meia conjuracao |

Todas as 48 subclasses 2024 foram verificadas com texto no nivel 3 e resumo em `FEATURE_SUMMARIES_2024`.

## Texto vs seletor vs automacao

- Texto: fica no dataset quando o marco precisa aparecer no resumo da ficha. No nivel 3 isso cobre quase todas as subclasses e, em 2024, tambem o desbloqueio de subclasse das classes base.
- Seletor: fica para decisoes persistentes. A auditoria cobre pacto, invocacoes filtradas por truque/pacto, Metamagia, Modelo de Armadura, Totem, manobras, runas, tiros arcanos, disciplinas, Presa do Cacador, armas Kensei, proficiencias de subclasse, terreno do Circulo da Terra e companheiros.
- Automacao: cobre contagens, espacos, fontes automaticas de magia e progressoes derivadas. O smoke DOM continua validando fluxos reais de tela; a cobertura estrutural de nivel 3 fica em `scripts/unit/level-3-audit.test.mjs`.

## Divergencias corrigidas

- 5e legacy: Juramento da Coroa, Juramento da Redencao, Juramento dos Vigilantes e Quebrador de Juramento ja tinham magias de juramento automatizadas, mas nao declaravam o recurso textual `Magias de Juramento` no nivel 3. O dataset e os resumos de hover foram alinhados.
- `scripts/check.mjs` validava apenas tres juramentos 5e quanto ao texto/hover de `Magias de Juramento`. A validacao agora percorre todos os juramentos presentes em `PALADIN_OATH_GRANTED_SPELL_IDS_5E`.

## Arquivos e verificacao

- `src/data/5e/subclasses.js`: adiciona `Magias de Juramento` aos quatro juramentos 5e que estavam sem texto.
- `src/editors/5e/feature-summary.js`: adiciona resumos compactos para esses quatro casos.
- `scripts/check.mjs`: torna a validacao de magias de juramento completa para todos os juramentos 5e.
- `scripts/unit/level-3-audit.test.mjs`: nova matriz estruturada de texto, seletores e automacoes para 5e e 5.5e/2024.
- `docs/level-3-class-audit.md`: registro da auditoria e dos criterios usados.
