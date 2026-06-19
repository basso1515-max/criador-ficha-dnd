# Auditoria de classes nivel 6

Atualizado em 2026-06-18.

Esta auditoria cobre classes e subclasses 5e legacy e 5.5e/2024 no nivel 6. O contrato separa texto exibido, seletor persistente e automacao numerica, comparando cada fluxo local com as tabelas e descricoes oficiais.

## Resultado geral

Status atual: completo para as classes e subclasses cadastradas.

- 5e legacy: 4 das 13 classes declaram recurso textual no nivel 6: Artifice, Bardo, Monge e Paladino.
- 5e legacy: 77 das 118 subclasses declaram recurso textual no nivel 6. Outras 41 nao recebem caracteristica direta de subclasse nesse nivel.
- 2024: 5 das 12 classes declaram recurso textual no nivel 6: Guerreiro, Ladino, Monge, Paladino e Guardiao.
- 2024: 32 das 48 subclasses declaram recurso textual no nivel 6. As outras 16 pertencem a grupos cuja progressao de subclasse ocorre em outro nivel.
- ASI/talento no nivel 6 existe apenas para Guerreiro nas duas edicoes.
- Expertise adicional de Ladino no nivel 6 fica em seletor persistente nas duas edicoes.
- O `smoke-dom` nao contem mais checagens soltas de nivel 6. As invariantes foram consolidadas em `scripts/unit/level-6-audit.test.mjs`.

## Matriz de classes 5e

| Classe | Nivel 6 | Contrato |
| --- | --- | --- |
| Artifice | Especializacao em Ferramentas | Texto; 6 infusoes conhecidas, 3 ativas e meia conjuracao automatizadas |
| Barbaro | Sem recurso textual | Furia automatizada; subclasses podem receber recurso |
| Bardo | Contra-Encantamento | Texto; 3 truques, 9 magias conhecidas e slots automatizados |
| Bruxo | Sem recurso textual | 3 invocacoes, 7 magias e 2 slots de pacto de 3o circulo |
| Clerigo | Sem recurso textual | 4 truques, 11 preparadas com Sabedoria +5 e 3 Canalizar Divindade |
| Druida | Sem recurso textual | 3 truques, 11 preparadas e Forma Selvagem automatizada |
| Feiticeiro | Sem recurso textual | 5 truques, 7 conhecidas, 6 pontos e 2 Metamagias |
| Guerreiro | ASI/talento | Seletor persistente no nivel 6; subclasses sem marco proprio nesse nivel |
| Ladino | Expertise adicional | Seletor persistente e Ataque Furtivo 3d6 |
| Mago | Sem recurso textual | 4 truques, 11 preparadas com Inteligencia +5 e slots automatizados |
| Monge | Golpes Potencializados por Ki | Texto; Ki, dado marcial e movimento automatizados |
| Paladino | Aura de Protecao | Texto; 8 preparadas com Carisma +5 e meia conjuracao |
| Patrulheiro | Sem recurso textual | 4 conhecidas; segundo Inimigo Favorito e Explorador Natural em seletores |

## Matriz de subclasses 5e

Subclasses com recurso no nivel 6, agrupadas por classe:

- Barbaro: Alma Bestial; Magia Fortalecedora; Alma da Tempestade; Abandono Temerario; Furia Irracional; Concentracao Fanatica; Cutelo Elemental; Escudo Espiritual; Aspecto da Fera.
- Bardo: Ataque Extra (Bravura e Espadas); Performance Animada; Inspiracao Infalivel; Segredos Magicos Adicionais; Manto da Majestade; Foco Espiritual; Manto dos Sussurros.
- Bruxo: Fuga Nebulosa; Espectro Maldito; Alma Radiante; Dadiva Elemental; Guarda Entropica; Desafiar a Morte; Sorte do Infernal; Alma Oceanica e Espiral Guardia; Tocado pela Morte.
- Clerigo: Quebrar Magia; Manto de Sombras; Alma da Forja; Bencao do Deus da Guerra; Labareda Protetora Aprimorada; Destruicao Inevitavel; Amortecer Elementos; Corporificacao da Lei; Vinculo Protetor; Sentinela a Porta da Morte; Golpe Trovejante; Cura Abencoada; Ler Pensamentos; Passos da Noite.
- Druida: Golpe Primal; Passo da Terra; Pressagio Cosmico; Vinculo Aprimorado; Invocador Poderoso; Infestacao Fungica; Refugio de Luar e Sombra.
- Feiticeiro: Cura Empoderada; Bastiao da Lei; Coracao da Tempestade; Cao das Sombras; Crescente e Minguante; Afinidade Elemental; Manipular Sorte; Defesas Psiquicas e Feiticaria Psionica.
- Mago: Estase Momentanea; Protecao Projetada; Adivinhacao Especializada; Transporte Benigno; Truque Potente; Maleabilidade; Servos Mortos-Vivos; Pedra do Transmutador; Encantamento Instintivo; Poco Gravitacional; Ataque Extra; Surto de Poder; Manifestar Mente.
- Monge: Golpe do Arco Ardente; Semblante do Eu Astral; Toque Medico; Hora da Ceifa; Integridade Corporal; Passo Sombrio; Asas Draconicas; Um com a Lamina; Balanco Cambaleante.
- Quatro Elementos nao ganha um segundo texto artificial: o nivel 6 aumenta de uma para duas disciplinas no seletor estruturado.

## Matriz 2024

Classes base no nivel 6:

| Classe | Nivel 6 | Contrato |
| --- | --- | --- |
| Barbaro | Sem recurso textual | 4 Furias, dano +2 e 3 Maestrias |
| Bardo | Sem recurso textual de classe | 3 truques, 10 preparadas e dado de Inspiracao d8 |
| Bruxo | Sem recurso textual | 5 invocacoes, 7 preparadas e 2 slots de pacto de 3o circulo |
| Clerigo | Sem recurso textual | 4 truques, 10 preparadas e 3 Canalizar Divindade |
| Druida | Sem recurso textual | 3 truques, 10 preparadas e 3 usos de Forma Selvagem |
| Feiticeiro | Sem recurso textual | 5 truques, 10 preparadas, 6 pontos e 2 Metamagias |
| Guerreiro | Aumento no Valor de Atributo | Seletor ASI/talento; 3 Segundos Folegos, 4 Maestrias e Ataque Extra |
| Ladino | Especialista Adicional | Seletor persistente e Ataque Furtivo 3d6 |
| Mago | Sem recurso textual | 4 truques, 10 preparadas e slots automatizados |
| Monge | Golpes Potencializados | Texto; d8 marcial, 6 Focos e +4,5 m de movimento |
| Paladino | Aura de Protecao | Texto; 6 preparadas e 2 Canalizar Divindade |
| Guardiao | Errante | Texto; 6 preparadas e 3 usos gratuitos de Marca do Cacador |

Subclasses com recurso no nivel 6:

| Classe | Subclasses e recursos |
| --- | --- |
| Barbaro | Arvore do Mundo: Ramos da Arvore; Berserker: Furia Irracional; Coracao Selvagem: Aspecto dos Selvagens; Fanatico: Concentracao Fanatica |
| Bardo | Bravura: Ataque Extra; Danca: Gingado Coordenado e Movimento Inspirador; Conhecimento: Descobertas Magicas; Glamour: Manto de Majestade |
| Bruxo | Arquifada: Fuga em Nevoa; Celestial: Alma Radiante; Grande Antigo: Combatente Clarividente; Infernal: A Sorte do Proprio Tenebroso |
| Clerigo | Guerra: Bencao do Deus da Guerra; Luz: Labareda Protetora Aprimorada; Enganacao: Transposicao do Trapaceiro; Vida: Curandeiro Abencoado |
| Druida | Lua: Formas do Circulo Aprimoradas; Terra: Recuperacao Natural; Estrelas: Pressagio Cosmico; Mar: Afinidade Aquatica |
| Feiticeiro | Mente Aberrante: Defesas Psiquicas e Feiticaria Psionica; Draconico: Afinidade Elemental; Alma Mecanica: Bastiao da Lei; Magia Selvagem: Distorcer a Sorte |
| Mago | Abjuracao: Protecao Projetada; Adivinhacao: Adivinhacao Especializada; Evocacao: Moldar Magias; Ilusao: Criaturas Fantasmagoricas |
| Monge | Palma Aberta: Integridade Corporal; Misericordia: Toque Medico; Sombras: Passo Sombrio; Elementos: Explosao Elemental |

## Texto, seletor e automacao

- Texto: fixa as quatro caracteristicas de classe ausentes em 5e e corrige nomes, niveis e efeitos de 26 subclasses legacy.
- Seletor 5e: valida ASI de Guerreiro, Expertise de Ladino, dois Segredos Magicos Adicionais, segundo Inimigo Favorito/Explorador Natural, duas Disciplinas Elementais e tres Armas do Kensei.
- Infusoes 5e: fixa 6 conhecidas e 3 ativas; Armadura Resistente exige alvo e tipo de dano em configuracao estruturada.
- Seletor 2024: valida ASI de Guerreiro, Expertise de Ladino e duas Descobertas Magicas do Bardo do Conhecimento.
- Descobertas Magicas: o catalogo e carregado sob demanda, filtra truques e magias de Clerigo, Druida ou Mago ate o maior circulo disponivel ao Bardo e persiste as duas escolhas como magias concedidas.
- Automacao: fixa truques, magias conhecidas/preparadas, slots, invocacoes, manobras, Tiro Arcano, Ki/Foco, Furia, Canalizar Divindade, Forma Selvagem, pontos de Feiticaria, Maestrias e Ataque Furtivo.

## Divergencias identificadas

### Classes 5e

- Artifice: faltava Especializacao em Ferramentas.
- Bardo: faltava Contra-Encantamento e sua duracao/condicoes de encerramento.
- Monge: faltava Golpes Potencializados por Ki.
- Paladino: faltava Aura de Protecao, incluindo minimo +1, necessidade de consciencia e alcance progressivo.
- Barbaro, Bruxo, Clerigo, Druida, Feiticeiro, Guerreiro, Ladino, Mago e Patrulheiro: sem texto base faltante. Guerreiro e Ladino ja usam seletores oficiais no nivel 6; Patrulheiro ja automatiza as escolhas acumuladas.

### Subclasses 5e corrigidas

- Magia Selvagem: `Recarga Magica` foi substituida por Magia Fortalecedora, com os dois modos, d3 e limite por criatura.
- Berserker: `Furia Mental` foi corrigida para Furia Irracional.
- Fanatico: `Guerreiro dos Deuses` era do nivel 3; no nivel 6 entrou Concentracao Fanatica.
- Gigante: `Arremesso Poderoso` era do nivel 10; no nivel 6 entrou Cutelo Elemental.
- Espiritos: Foco Espiritual omitia o d6 adicional de dano ou cura.
- Enganacao: `Passo Sombrio` foi substituido por Manto de Sombras.
- Guerra: Bencao do Deus da Guerra agora registra a reacao e o bonus +10.
- Luz: `Luz Melhorada` foi substituida por Labareda Protetora Aprimorada.
- Morte: `Toque Aprimorado` foi substituido por Destruicao Inevitavel.
- Natureza: `Resistencia Natural` foi substituida por Amortecer Elementos.
- Ordem: `Encantamento Aprimorado` foi substituido por Corporificacao da Lei, com limite por Sabedoria.
- Conhecimento: o nivel 2 foi corrigido para Conhecimento das Eras; Ler Pensamentos passou ao nivel 6 e inclui Sugestao.
- Crepusculo: `Passo Sombrio` foi corrigido para Passos da Noite.
- Lua: `Ataques Magicos` foi corrigido para Golpe Primal.
- Fogo Selvagem: `Chamas Aprimoradas` foi substituida por Vinculo Aprimorado.
- Esporos: `Servos Fungicos` foi substituido por Infestacao Fungica.
- Sonhos: `Caminho Oculto` era do nivel 10; no nivel 6 entrou Refugio de Luar e Sombra.
- Alma Mecanica: `Equilibrio` era do nivel 1; no nivel 6 entrou Bastiao da Lei.
- Lunar: `Magia Lunar` foi substituida por Crescente e Minguante, ligada a escola da fase e Metamagia.
- Mente Aberrante: `Telepatia` era do nivel 1; no nivel 6 entraram Defesas Psiquicas e Feiticaria Psionica.
- Graviturgista: `Campo Gravitacional` foi corrigido para Poco Gravitacional.
- Magia de Guerra: `Magia Poderosa` foi substituida por Surto de Poder.
- Eu Astral: `Visao Astral` foi corrigida para Semblante do Eu Astral.
- Misericordia: Toque Medico foi completado com as condicoes encerradas e o Envenenado imposto.
- Kensei: Um com a Lamina omitia Golpe Habil e o gasto de 1 Ki.
- Quatro Elementos: `Fluxo Elemental` nao e uma caracteristica oficial; foi removido. O ganho real e a segunda disciplina no seletor.
- As outras 51 subclasses com caracteristica no nivel 6 estavam funcionalmente alinhadas.
- As 41 subclasses sem caracteristica no nivel 6 permanecem corretamente sem entrada textual.

### Edicao 2024

- Classes: as cinco caracteristicas de classe do nivel 6 estavam alinhadas; nao houve correcao textual de classe.
- Bardo do Conhecimento: Descobertas Magicas existia apenas como texto. Agora possui duas escolhas persistentes, filtragem oficial por lista/circulo e integracao com magias concedidas.
- Monge da Misericordia: Toque Medico tinha resumo generico; agora explicita as cinco condicoes encerradas e o Envenenado imposto.
- Monge dos Elementos: Explosao Elemental tinha resumo generico; agora registra custo de 2 Focos, alcance, area, salvaguarda e tres dados marciais.
- O carregamento de catalogo de magias estava acoplado por engano ao renderizador de companheiros; foi movido para o renderizador de escolhas de recurso.
- As outras 29 subclasses com caracteristica no nivel 6 estavam alinhadas.
- As 16 subclasses sem caracteristica no nivel 6 permanecem corretamente sem entrada textual.

## Fontes oficiais consultadas

- [SRD 5.1 da Wizards of the Coast](https://media.wizards.com/2023/downloads/dnd/SRD_CC_v5.1.pdf): progressoes 5e de Bardo, Monge, Paladino e classes/subclasses do SRD.
- [Artifice em Tasha's Cauldron of Everything](https://www.dndbeyond.com/sources/dnd/tcoe/artificer): Especializacao em Ferramentas e progressao de infusoes.
- Compendios oficiais 5e no D&D Beyond: [Player's Handbook 2014](https://www.dndbeyond.com/sources/dnd/phb-2014), [Xanathar's Guide to Everything](https://www.dndbeyond.com/sources/dnd/xgte) e [Tasha's Cauldron of Everything](https://www.dndbeyond.com/sources/dnd/tcoe).
- [Basic Rules 2024 do D&D Beyond](https://www.dndbeyond.com/sources/dnd/br-2024/character-classes): tabelas de classe, slots e recursos de nivel 6.