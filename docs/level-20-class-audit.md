# Auditoria de classes nivel 20

Atualizado em 2026-06-05.

Esta auditoria cobre as fichas 5e legacy e 5.5e/2024 no nivel 20, com foco em tres perguntas:

- A classe/subclasse tem o recurso de nivel 20 correto nos dados.
- As contas derivadas batem com as tabelas usadas pela ficha.
- O que e escolha real vira seletor e propaga para resumo, preview e exportacao.

## Resultado geral

Status atual: completo para as classes cadastradas.

- 5e: todas as 13 classes declaram recurso de nivel 20. Paladino tambem tem os recursos de juramento no nivel 20 em todas as subclasses cadastradas.
- 2024: todas as classes com capstone de classe declaram nivel 20. Paladino 2024 nao tem capstone na classe base; o recurso final vem do juramento, e todos os 4 juramentos cadastrados declaram nivel 20.
- Contas 2024: progressao de furia, inspiracao, Canalizar Divindade, Forma Selvagem, pontos de feiticaria, Ataque Furtivo, Inimigo Favorito, maestria em arma, Invocacoes Misticas, Arcanum Mistico, magias preparadas/conhecidas e espacos de magia sao verificadas por teste unitario.
- Contas 5e: magias, espacos, invocacoes, infusoes, Inimigo Favorito, Explorador Nato, Metamagia, manobras, Tiro Arcano, Disciplinas Elementais e armas Kensei sao verificadas por teste unitario.
- Propagacao: o smoke DOM percorre todas as classes no nivel 20 e valida que o recurso aparece no preview. As escolhas configuraveis ja cobertas pelo smoke continuam validando resumo/preview/PDF automatico.

## Matriz 5e

| Classe | Nivel 20 | Automacao/selecoes |
| --- | --- | --- |
| Artifice | Alma do Artifice | Infusoes calculam 12 conhecidas/6 ativas no nivel 20. Infusoes com alvo/configuracao viram seletores e entram no preview/PDF. |
| Barbaro | Campeao Primal | +4 FOR/+4 CON ate maximo 24 aplicado aos atributos finais automaticamente. |
| Bardo | Inspiracao Superior | Recurso textual. Magias conhecidas, truques e espacos de magia sao calculados. |
| Bruxo | Mestre Sobrenatural | Invocacoes 8, magias conhecidas 15, truques 4 e espacos de pacto 4 de 5o circulo sao calculados. Patrono Genio e Resiliencia Infernal sao seletores. |
| Clerigo | Intervencao Divina Aprimorada | Recurso textual. Magias preparadas por nivel + modificador e espacos sao calculados. |
| Druida | Arquidruida | Recurso textual. Magias preparadas por nivel + modificador e espacos sao calculados. Circulo da Terra usa seletor de terreno para magias fixas. |
| Feiticeiro | Restauracao Feiticeira | Metamagia abre 4 escolhas no nivel 20 e propaga. Magias conhecidas/truques/espacos sao calculados. |
| Guerreiro | Ataque Extra (3) | Texto de classe aparece no preview. Mestre de Batalha abre 9 manobras; Arqueiro Arcano abre 6 tiros. |
| Ladino | Golpe de Sorte | Texto de classe aparece no preview. Trapaceiro Arcano calcula 4 truques, 13 magias conhecidas e espacos de 1/3 conjurador. |
| Mago | Magias Assinatura | Maestria de Magias e Magias Assinatura viram seletores de magia; escolhas entram no resumo/preview/PDF. |
| Monge | Eu Perfeito | Texto de classe aparece no preview. Quatro Elementos abre 4 disciplinas; Kensei abre 5 armas no nivel 20. |
| Paladino | Caracteristica de Juramento | Classe base aponta para subclasse. Todos os juramentos cadastrados tem recurso nivel 20. Magias preparadas e espacos sao calculados. |
| Patrulheiro | Algoz de Inimigos | Inimigo Favorito e Explorador Nato abrem 3 escolhas cada no nivel 20; escolhas e idiomas associados entram no preview/PDF. |

## Matriz 2024

| Classe | Nivel 20 | Automacao/selecoes |
| --- | --- | --- |
| Barbaro | Campeao Primal | Furia 6, dano +4, maestrias 4. +4 FOR/+4 CON ate maximo 25 aplicado automaticamente. |
| Bardo | Palavras de Criacao | Inspiracao d12, 4 truques, 22 magias preparadas e espacos de conjurador pleno calculados. Magias de Palavras de Criacao entram como concedidas. |
| Bruxo | Mestre Mistico | Invocacoes 10, 4 truques, 15 magias preparadas, 4 espacos de pacto de 5o circulo e Arcanum Mistico 6o-9o calculados. |
| Clerigo | Intervencao Divina Maior | Canalizar Divindade 4, 5 truques e 22 magias preparadas calculados. Ordem Divina e Golpes Abençoados sao seletores. |
| Druida | Arquidruida | Forma Selvagem 4 usos, 4 truques e 22 magias preparadas calculados. Ordem Primal, Furia Elemental, terreno do Circulo da Terra e companheiro selvagem sao seletores. |
| Feiticeiro | Apoteose Arcana | 20 pontos de feiticaria, 6 Metamagias, 6 truques e 22 magias preparadas calculados. Metamagia e companheiro draconico sao seletores. |
| Guerreiro | Tres Ataques Extras | Recuperar Folego 4, maestrias 6, Surto de Acao 2, Indomavel 3 e 4 ataques calculados. Mestre da Batalha abre 9 manobras. |
| Ladino | Golpe de Sorte | Ataque Furtivo 10d6 e maestrias 2 calculados. Trapaceiro Arcano calcula 4 truques, 13 magias conhecidas e espacos de 1/3 conjurador. |
| Mago | Magias Assinatura | Grimorio minimo 44, Recuperacao Arcana 10 circulos, 5 truques e 25 magias preparadas calculados. Academico, Maestria e Assinaturas sao seletores. |
| Monge | Corpo e Mente | Artes Marciais d12, Foco 20, movimento +30 pes. +4 DES/+4 SAB ate maximo 25 aplicado automaticamente. |
| Paladino | Juramento no nivel 20 | Classe base registra que o recurso vem do juramento. Devocao, Gloria, Vinganca e Ancioes tem capstone e magias de juramento concedidas. |
| Guardiao | Matador de Inimigos Favoritos | 6 usos gratuitos de Marca do Predador, maestrias 2 e 15 magias preparadas calculados. Cacador abre Presa e Taticas Defensivas. |

## Criterio de selecao

Virou seletor quando a decisao muda algo persistente na ficha: magia escolhida, pericia/treinamento concedido, maestria, manobra, alvo de infusao, terreno, companheiro, patrono, dano/resistencia ou detalhe que precisa aparecer no PDF.

Permaneceu texto quando o recurso nao exige escolha persistente ou depende de uso em mesa: recupera usos ao rolar iniciativa, intervencao divina, transformacoes temporarias, auras ativadas, efeitos de descanso, ou capstones que so alteram uma regra de uso ja descrita.

## Melhorias aplicadas nesta rodada

- `scripts/unit/level-20-audit.test.mjs`: teste novo com matriz completa de nivel 20, contas de magia/recursos e seletores de alto nivel.
- `scripts/smoke-dom.mjs`: smoke agora visita todas as classes 5e no nivel 20 e todas as classes 2024 no nivel 20, incluindo Paladino 2024 com juramento, validando resumo/preview.
- A auditoria diferencia texto, seletor real e calculo automatico para evitar transformar descricoes narrativas em campos sem efeito.

## Melhorias futuras candidatas

- Criar um painel de contadores de descanso para 5e legacy, semelhante ao resumo 2024, para exibir usos atuais de recursos como Inspiração Bardica, Ki, Canalizar Divindade e Forma Selvagem.
- Expandir smoke de Paladino 5e para exercitar cada juramento no DOM, alem da garantia unitaria de dados.
- Adicionar uma tela interna de diagnostico que liste recursos pendentes de selecao por classe/subclasse antes da exportacao.
