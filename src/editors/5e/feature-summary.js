import { normalizePt } from "../../shared/text-utils.js";

export function formatTraitSummary(trait) {
  if (!trait) return "";
  let summary = String(trait?.descricao || trait?.resumo || "").trim();
  try {
    if (trait?.alcance && typeof trait.alcance.ft === "number") {
      const { ft, m } = trait.alcance;
      const normalizedPair = `${m} m (${ft} ft)`;
      summary = summary
        .replace(/([0-9]+(?:[.,][0-9]+)?)\s*m\s*\(\s*([0-9]+(?:[.,][0-9]+)?)\s*ft\s*\)/gi, normalizedPair)
        .replace(/([0-9]+(?:[.,][0-9]+)?)\s*ft\s*\(\s*([0-9]+(?:[.,][0-9]+)?)\s*m\s*\)/gi, normalizedPair);

      const ftMatches = summary.match(/([0-9]+(?:[.,][0-9]+)?)\s*ft\b/gi) || [];
      if (!summary.includes(normalizedPair) && ftMatches.length === 1) {
        summary = summary.replace(/([0-9]+(?:[.,][0-9]+)?)\s*ft\b/gi, normalizedPair);
      }
    }
  } catch (e) {
  }
  return summary;
}

function ensureTrailingPeriod(text = "") {
  const trimmed = String(text || "").trim();
  if (!trimmed) return "";
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

export function compactRaceSummaryText(text = "") {
  return ensureTrailingPeriod(
    String(text || "")
      .trim()
      .replace(/\bvs\b/gi, "contra")
      .replace(/\bsalvaguardas\b/gi, "testes de resistência")
      .replace(/\bsalvaguarda\b/gi, "teste de resistência")
      .replace(/^Proficiência:\s*/i, "Proficiência em ")
      .replace(/^Descanso élfico:\s*/i, "")
      .replace(/\bVocê pode\b/gi, "Pode")
      .replace(/\bAprende a conjurar\b/gi, "Pode conjurar")
      .replace(/\bem si mesmo\b/gi, "em si")
      .replace(/\bN[ií]vel\s+(\d+):/gi, (_, level) => `${level}º nível:`)
      .replace(/\bN(\d+):/g, (_, level) => `${level}º nível:`)
      .replace(/\b1\/descanso curto ou longo\b/gi, "1 por descanso curto ou longo")
      .replace(/\b1\/descanso longo\b/gi, "1 por descanso longo")
      .replace(/\b1\/descanso curto\b/gi, "1 por descanso curto")
      .replace(/\b1\/desc\.?\s*longo\b/gi, "1 por descanso longo")
      .replace(/\b1\/desc\.?\s*curto\b/gi, "1 por descanso curto")
      .replace(/\bNão precisa de componentes materiais\b/gi, "Sem componentes materiais")
      .replace(/\bRestrições:\s*/gi, "")
      .replace(/\brecarrega após descanso longo\b/gi, "1 por descanso longo")
      .replace(/\b([A-Za-zÀ-ÿ]+)\s+é a habilidade de conjuração\./gi, "$1 é o atributo de conjuração.")
      .replace(/\bquando você ou o alvo estiver sob luz solar direta\b/gi, "quando você ou o alvo estiverem sob luz solar direta")
      .replace(/teste de resistência ([A-Za-zÀ-ÿ]+)\s+CD/gi, "teste de resistência de $1, CD")
      .replace(/\s*;\s*/g, "; ")
      .replace(/\s{2,}/g, " ")
  );
}

export function compactRaceTraitSummary(trait) {
  if (!trait) return "";

  const name = normalizePt(trait?.nome || trait?.name || "");
  const formattedSummary = compactRaceSummaryText(formatTraitSummary(trait));
  const distanceText = trait?.alcance && Number.isFinite(trait.alcance.ft)
    ? `${trait.alcance.m} m (${trait.alcance.ft} ft)`
    : "";

  switch (name) {
    case "visao no escuro":
    case "visao no escuro superior":
      return distanceText ? `Enxerga no escuro até ${distanceText} como penumbra.` : formattedSummary;
    case "sentidos agucados":
      return "Proficiência em Percepção.";
    case "ancestral feerico":
      return "Vantagem contra ser enfeitiçado; magia não o põe para dormir.";
    case "transe":
      return "4 horas de transe contam como descanso longo.";
    case "sortudo":
      return "Se tirar 1 em um d20 de ataque, teste ou salvaguarda, rerrole; use o novo resultado.";
    case "bravura":
      return "Vantagem contra ficar amedrontado.";
    case "agilidade pequenina":
      return "Atravessa o espaço de criaturas maiores que você.";
    case "deslocamento anao":
      return "Seu deslocamento não é reduzido por armadura pesada.";
    case "resiliencia ana":
      return "Vantagem contra veneno; resistência a dano venenoso.";
    case "treinamento de combate anao":
      return "Proficiência com machado de batalha, machadinha, martelo leve e martelo de guerra.";
    case "proficiencia com ferramentas":
      return "Proficiência em 1: ferramentas de ferreiro, suprimentos de cervejeiro ou ferramentas de pedreiro.";
    case "especializacao em pedras":
      return "Dobre o bônus de proficiência em História sobre obras de pedra.";
    case "pericia extra":
      return "Proficiência em 1 perícia à escolha.";
    case "treinamento marcial":
      return "Proficiência com 2 armas marciais à escolha e com armadura leve.";
    case "salvar as aparencias":
      return distanceText
        ? `Se errar um ataque, teste de habilidade ou teste de resistência, recebe bônus igual ao número de aliados que vê a até ${distanceText} (máx. +5), 1 por descanso curto ou longo.`
        : formattedSummary;
    case "treinamento drow com armas":
      return "Proficiência em rapieiras, espadas curtas e bestas de mão.";
    case "resiliencia duergar":
      return "Vantagem em testes de resistência contra veneno, ilusões, enfeitiçamento e paralisia; resistência a dano venenoso.";
    case "magia drow":
      return "Truque: Luz; 3º nível: Fogo das Fadas 1 por descanso longo; 5º nível: Escuridão 1 por descanso longo. Carisma é o atributo de conjuração.";
    case "magia duergar":
      return "3º nível: Pode conjurar ampliar/reduzir (apenas ampliar) em si, como ação bônus. 5º nível: Pode conjurar invisibilidade em si. Sem componentes materiais; não funciona sob luz solar direta; 1 por descanso longo. Inteligência é o atributo de conjuração.";
    case "ancestral draconico":
      return "Escolha o tipo de dragão; ele define o dano do sopro e sua resistência.";
    case "arma de sopro":
      return "Ação: usa um sopro em cone ou linha; teste de resistência; dano 2d6, aumentando com o nível.";
    case "resistencia a dano":
      return "Resistência ao tipo de dano do ancestral.";
    case "sensibilidade a luz solar":
      return "Desvantagem em ataques e em Percepção baseada em visão sob luz solar direta.";
    case "mente psionica":
      return distanceText
        ? `Comunique-se telepaticamente com 1 criatura que veja a até ${distanceText}; ela deve compreender ao menos 1 idioma.`
        : formattedSummary;
    case "voo de gema":
      return "No 5º nível, manifesta asas espectrais por 1 minuto; ganha deslocamento de voo igual ao de caminhada e pode pairar, 1 por descanso longo.";
    case "amigo do mar":
      return "Comunique ideias simples a criaturas com deslocamento de natação; você não entende a resposta.";
    default:
      return formattedSummary;
  }
}

export function compactBackgroundFeatureSummary(feature, background = null) {
  if (!feature) return "";

  const featureName = normalizePt(feature?.nome || feature?.name || "");
  const backgroundName = normalizePt(background?.nome || "");
  const summary = ensureTrailingPeriod(String(feature?.descricao || feature?.resumo || "").trim());

  switch (featureName) {
    case "abrigo dos fieis":
      return "Pode obter abrigo e ajuda simples em templos compatíveis (a critério do DM).";
    case "identidade falsa":
      return "Mantém uma identidade falsa convincente e documentada (a critério do DM).";
    case "contato criminal":
      return "Tem um contato confiável no submundo para recados e boatos.";
    case "por demanda popular":
      return "Consegue hospedagem simples ao entreter um público.";
    case "hospitalidade rustica":
      return "Pessoas simples oferecem abrigo, comida e proteção básica.";
    case "membro da guilda":
      return "Conta com apoio e contatos profissionais em centros urbanos.";
    case "descoberta":
      return "Descobriu um segredo ou verdade que mudou sua visão do mundo.";
    case "posicao de privilegio":
      return "Recebe tratamento respeitoso, acesso social e audiências com mais facilidade.";
    case "pesquisador":
      return "Sabe onde encontrar informações e quem pode ajudar a obtê-las.";
    case "andarilho":
      return "Encontra comida e água na natureza e se orienta com facilidade (a critério do DM).";
    case "patente militar":
      return "Pode requisitar ajuda básica de aliados militares e usar sua reputação.";
    case "passagem em navio":
      return "Consegue passagem gratuita ou barata por contatos marítimos.";
    case "segredos da cidade":
      return "Conhece atalhos, contatos e locais seguros em centros urbanos.";
    default:
      if (backgroundName === "forasteiro") {
        return "Encontra comida e água na natureza e se orienta com facilidade (a critério do DM).";
      }

      return summary;
  }
}

export function compactSubclassFeatureName(name = "", entry = null) {
  const normalizedName = normalizePt(name);
  const subclassId = normalizePt(entry?.subclassData?.id || "");

  switch (`${subclassId}:${normalizedName}`) {
    case "clerigo-natureza:acolito da natureza":
      return "Acólito da Natureza";
    case "guerreiro-cavaleiro-arcano:golpe mistico":
      return "Golpe Místico";
    default:
      return String(name || "").trim();
  }
}

export function compactSubclassSummaryText(text = "") {
  const baseText = ensureTrailingPeriod(String(text || "").trim());
  if (!baseText) return "";

  switch (normalizePt(baseText)) {
    case "pode atacar duas vezes.":
      return "Pode atacar duas vezes na ação Atacar.";
    case "ganha voo.":
      return "Ganha deslocamento de voo.";
    case "resistencia e voo.":
      return "Ganha resistência e deslocamento de voo.";
    case "permite voo temporario.":
      return "Ganha deslocamento de voo temporário.";
    case "dano extra.":
    case "dano adicional.":
      return "Causa dano adicional.";
    case "aumenta dano.":
      return "Aumenta o dano causado.";
    case "aumenta dano magico.":
      return "Aumenta o dano das suas magias.";
    case "aumenta dano e cura.":
      return "Aumenta o dano e a cura das suas magias.";
    case "invoca espirito de fogo.":
      return "Invoca um espírito de fogo para lutar ao seu lado.";
    case "teleporte com fogo.":
      return "Teleporta-se em meio às chamas.";
    case "explosao ao cair.":
      return "Ao cair a 0 PV, provoca uma explosão de fogo.";
    case "cura a si mesmo.":
      return "Recupera pontos de vida.";
    case "usa foco especial para magias.":
      return "Usa um foco espiritual especial para suas magias.";
    case "efeitos aleatorios ao usar inspiracao.":
      return "Ao usar Inspiração de Bardo, produz efeitos aleatórios.";
    case "escolhe efeitos dos contos.":
      return "Pode escolher o efeito dos seus contos espirituais.";
    case "ganha proficiencia em varias pericias.":
      return "Ganha proficiência em perícias adicionais.";
    case "ganha estilo de combate.":
      return "Ganha um Estilo de Combate.";
    case "voce escolhe um segundo estilo de combate.":
      return "Escolhe um segundo Estilo de Combate.";
    case "comunicacao telepatica.":
      return "Comunique-se telepaticamente.";
    case "protecao contra dano mental.":
      return "Ganha proteção contra dano psíquico.";
    case "controle climatico total.":
      return "Passa a controlar ventos e tempestades ao seu redor.";
    case "teleporta entre sombras.":
    case "teleporte entre sombras.":
      return "Teleporta-se entre sombras.";
    default:
      return ensureTrailingPeriod(
        baseText
          .replace(/\bcommbate\b/gi, "combate")
          .replace(/\bmistico\b/gi, "místico")
          .replace(/\bacolito\b/gi, "acólito")
          .replace(/\bap[oó]s magia, pode atacar\b/gi, "Após conjurar uma magia, pode fazer um ataque como ação bônus")
          .replace(/\bteleporta-se ao usar surto de ação\b/gi, "Ao usar Surto de Ação, pode se teletransportar")
          .replace(/\s{2,}/g, " ")
      );
  }
}

export function compactSubclassFeatureSummary(feature, entry = null) {
  if (!feature) return "";

  const featureName = normalizePt(feature?.nome || feature?.name || "");
  const subclassId = normalizePt(entry?.subclassData?.id || "");
  const key = `${subclassId}:${featureName}`;
  const summary = compactSubclassSummaryText(
    feature?.descricao || feature?.resumo || feature?.description || ""
  );

  switch (key) {
    case "artifice-alquimista:elixir experimental":
      return "Cria elixires mágicos com efeitos aleatórios úteis.";
    case "artifice-alquimista:alquimia aprimorada":
      return "Aumenta a cura e o dano das suas magias alquímicas.";
    case "artifice-alquimista:reagentes restauradores":
      return "Cura aliados e remove certas condições.";
    case "artifice-alquimista:mestre alquimista":
      return "Ganha resistência a dano e melhora seus efeitos alquímicos.";
    case "artifice-armeiro:armadura arcana":
      return "Transforma sua armadura em foco mágico e segunda pele.";
    case "artifice-armeiro:modelo de armadura":
      return "Escolhe entre um modelo defensivo ou furtivo para a armadura.";
    case "artifice-armeiro:modificacoes de armadura":
      return "Adiciona mais melhorias mágicas à armadura.";
    case "artifice-armeiro:armadura perfeita":
      return "Sua armadura ganha defesas e utilidades superiores.";
    case "artifice-artilheiro:canhao arcano":
      return "Cria um canhão mágico com modos ofensivos e defensivos.";
    case "artifice-artilheiro:arma arcana":
      return "Aumenta o dano das suas magias através do foco arcano.";
    case "artifice-artilheiro:canhao explosivo":
      return "Melhora os efeitos do seu Canhão Arcano.";
    case "artifice-artilheiro:fortaleza arcana":
      return "Seu canhão fica mais resistente e poderoso.";
    case "artifice-ferreiro-batalha:companheiro de aco":
      return "Cria um construto aliado que luta ao seu lado.";
    case "artifice-ferreiro-batalha:defesa reforcada":
      return "Seu Companheiro de Aço fica mais resistente.";
    case "artifice-ferreiro-batalha:construto supremo":
      return "Seu Companheiro de Aço ganha habilidades avançadas.";
    case "bruxo-arquifada:presenca feerica":
      return "Pode enfeitiçar ou assustar criaturas ao seu redor.";
    case "bruxo-arquifada:fuga nebulosa":
      return "Ao sofrer dano, fica invisível e se teletransporta.";
    case "bruxo-arquifada:defesas sedutoras":
      return "Ganha imunidade a enfeitiçamento e pode refletir esse efeito.";
    case "bruxo-arquifada:delirio sombrio":
      return "Aprisiona um inimigo em uma ilusão aterrorizante.";
    case "bruxo-lamina-maldita:maldicao da lamina":
      return "Amaldiçoa um alvo para causar dano extra e ampliar seus críticos.";
    case "bruxo-lamina-maldita:guerreiro hexblade":
      return "Ganha proficiências marciais e usa Carisma nos ataques com a arma vinculada.";
    case "bruxo-lamina-maldita:espectro maldito":
      return "Ao derrotar um inimigo, invoca seu espírito como servo.";
    case "bruxo-lamina-maldita:armadura das maldicoes":
      return "Resiste melhor ao dano causado pelo alvo amaldiçoado.";
    case "bruxo-lamina-maldita:maldicao expandida":
      return "Espalha sua maldição para novos alvos.";
    case "bruxo-celestial:luz curativa":
      return "Cura aliados com energia radiante.";
    case "bruxo-celestial:alma radiante":
      return "Aumenta dano radiante e de fogo.";
    case "bruxo-celestial:resiliencia celestial":
      return "Ganha resistência e pontos de vida temporários.";
    case "bruxo-celestial:explosao sagrada":
      return "Libera uma explosão radiante que fere e cega inimigos.";
    case "bruxo-genio:recipiente do genio":
      return "Recebe um recipiente mágico que concede bônus e abrigo.";
    case "bruxo-genio:voo elemental":
      return "Ganha deslocamento de voo temporário.";
    case "bruxo-genio:resistencia elemental":
      return "Ganha resistência ao tipo de dano ligado ao patrono.";
    case "bruxo-genio:desejo limitado":
      return "Produz um efeito poderoso semelhante a desejo, em escala menor.";
    case "bruxo-grande-antigo:mente desperta":
      return "Comunique-se telepaticamente com outras criaturas.";
    case "bruxo-grande-antigo:escudo psiquico":
      return "Ganha proteção contra dano psíquico.";
    case "bruxo-grande-antigo:pensamentos protegidos":
      return "Protege a própria mente contra leitura mental.";
    case "bruxo-grande-antigo:criar servo":
      return "Domina a mente de um inimigo e o transforma em servo.";
    case "bruxo-infernal:bencao do infernal":
      return "Ao derrotar uma criatura hostil, recebe pontos de vida temporários.";
    case "bruxo-infernal:resiliencia infernal":
      return "Após um descanso, escolhe um tipo de dano para resistir.";
    case "bruxo-abismal:presente do mar":
      return "Ganha deslocamento de natação e respira embaixo d'água.";
    case "bruxo-abismal:alma oceanica":
      return "Ganha resistência a frio e maior afinidade com criaturas submersas.";
    case "bruxo-abismal:espiral guardia":
      return "Seu tentáculo pode reduzir dano sofrido por você ou por aliados próximos.";
    case "bruxo-abismal:tentaculos aprisionantes":
      return "Aprende tentáculos negros como magia extra e os conjura com benefícios defensivos.";
    case "bruxo-abismal:mergulho insondavel":
      return "Teleporta você e aliados para um corpo d'água conhecido.";
    case "bruxo-morto-vivo:forma do terror":
      return "Assume uma forma assustadora que espalha medo.";
    case "bruxo-morto-vivo:tocado pela morte":
      return "Evita cair a 0 pontos de vida com facilidade sobrenatural.";
    case "bruxo-morto-vivo:resistencia necromantica":
      return "Ganha resistência a dano necrótico.";
    case "bruxo-morto-vivo:espirito imortal":
      return "Retorna após ser derrotado.";
    case "clerigo-arcano:magias de dominio":
      return "Mantém magias arcanas de domínio sempre preparadas.";
    case "clerigo-arcano:iniciado arcano":
      return "Aprende truques de mago.";
    case "clerigo-arcano:canalizar divindade":
      return "Usa Canalizar Divindade para expulsar criaturas extraplanares.";
    case "clerigo-arcano:quebrar magia":
      return "Remove efeitos mágicos ativos.";
    case "clerigo-arcano:potencia divina":
      return "Aumenta o dano dos seus truques e magias.";
    case "clerigo-arcano:maestria arcana":
      return "Amplia o poder das suas magias arcanas.";
    case "clerigo-enganacao:bencao trapaceira":
      return "Concede vantagem em testes de Furtividade.";
    case "clerigo-enganacao:duplicidade":
      return "Cria uma duplicata ilusória para confundir inimigos.";
    case "clerigo-enganacao:duplicidade perfeita":
      return "Cria múltiplas ilusões ao mesmo tempo.";
    case "clerigo-forja:bencao da forja":
      return "Encanta uma arma ou armadura.";
    case "clerigo-forja:arma sagrada":
      return "Cria uma arma mágica temporária.";
    case "clerigo-forja:alma da forja":
      return "Ganha resistência a dano de fogo.";
    case "clerigo-forja:corpo de ferro":
      return "Ganha grande resistência física.";
    case "clerigo-guerra:sacerdote da guerra":
      return "Pode fazer um ataque como ação bônus.";
    case "clerigo-guerra:golpe guiado":
      return "Usa Canalizar Divindade para garantir o acerto de um ataque.";
    case "clerigo-guerra:avatar da batalha":
      return "Ganha resistência a dano físico.";
    case "clerigo-luz:luz radiante":
      return "Cega inimigos próximos com um clarão sagrado.";
    case "clerigo-luz:explosao solar":
      return "Causa dano radiante em área.";
    case "clerigo-luz:potencia divina":
      return "Aumenta o dano das suas magias.";
    case "clerigo-luz:aura solar":
      return "Emana luz que fere inimigos continuamente.";
    case "clerigo-morte:ceifador":
      return "Aprimora suas magias de necromancia.";
    case "clerigo-morte:toque da morte":
      return "Inflige dano necrótico massivo.";
    case "clerigo-morte:mestre da morte":
      return "Ganha resistência a dano necrótico.";
    case "clerigo-natureza:acolito da natureza":
      return "Aprende um truque druídico.";
    case "clerigo-natureza:encantar animais":
      return "Usa Canalizar Divindade para afetar criaturas naturais.";
    case "clerigo-natureza:mestre da natureza":
      return "Controla criaturas naturais com mais facilidade.";
    case "clerigo-ordem:voz da autoridade":
      return "Quando fortalece um aliado com magia, ele pode atacar.";
    case "clerigo-ordem:exigir obediencia":
      return "Usa Canalizar Divindade para compelir inimigos a obedecer.";
    case "clerigo-ordem:ordem suprema":
      return "Controla vários inimigos ao mesmo tempo.";
    case "clerigo-paz:vinculo emocional":
      return "Cria um vínculo entre aliados para compartilhar bônus.";
    case "clerigo-paz:canalizar paz":
      return "Usa Canalizar Divindade para mover aliados e restaurá-los.";
    case "clerigo-paz:vinculo protetor":
      return "Permite dividir dano entre aliados ligados.";
    case "clerigo-paz:potencia divina":
      return "Aumenta o dano das suas magias.";
    case "clerigo-paz:unidade suprema":
      return "Amplia bastante a proteção do grupo.";
    case "clerigo-tempestade:ira da tempestade":
      return "Ao ser atingido, reage causando dano.";
    case "clerigo-tempestade:furia da tempestade":
      return "Maximiza dano elétrico e trovejante.";
    case "clerigo-tempestade:golpe trovejante":
      return "Empurra inimigos com força trovejante.";
    case "clerigo-tempestade:tempestade viva":
      return "Ganha deslocamento de voo e controle climático.";
    case "clerigo-vida:discipulo da vida":
      return "Melhora o poder das suas curas.";
    case "clerigo-vida:preservar vida":
      return "Usa Canalizar Divindade para curar vários aliados.";
    case "clerigo-vida:cura abencoada":
      return "Ao curar outras criaturas, também recupera pontos de vida.";
    case "clerigo-vida:cura suprema":
      return "Maximiza a cura das suas magias.";
    case "clerigo-conhecimento:conhecimento bonus":
      return "Ganha perícias e idiomas adicionais.";
    case "clerigo-conhecimento:potencia divina":
      return "Aumenta o dano das suas magias.";
    case "clerigo-conhecimento:conhecimento supremo":
      return "Pode dominar qualquer perícia.";
    case "clerigo-crepusculo:visao noturna":
      return "Ganha visão no escuro ampliada.";
    case "clerigo-crepusculo:santuario do crepusculo":
      return "Cria uma aura protetora ao redor do grupo.";
    case "clerigo-crepusculo:potencia divina":
      return "Aumenta o dano das suas magias.";
    case "clerigo-crepusculo:escudo do crepusculo":
      return "Mantém uma proteção constante em área.";
    case "paladino-conquista:magias de juramento":
      return "Mantém magias de juramento sempre preparadas.";
    case "paladino-conquista:canalizar divindade":
      return "Usa Canalizar Divindade para espalhar medo ou garantir um ataque decisivo.";
    case "paladino-conquista:aura de conquista":
      return "Inimigos amedrontados perdem mobilidade e sofrem dano.";
    case "paladino-conquista:espirito invencivel":
      return "Resiste melhor a dano enquanto estiver sob medo.";
    case "paladino-conquista:conquistador invencivel":
      return "Ganha resistência a dano e mais pressão ofensiva.";
    case "paladino-coroa:magias de juramento":
      return "Mantém magias de juramento sempre preparadas.";
    case "paladino-coroa:canalizar divindade":
      return "Usa Canalizar Divindade para chamar inimigos para si ou curar aliados.";
    case "paladino-coroa:lealdade divina":
      return "Usa a reação para sofrer no lugar de um aliado próximo o dano que ele receberia.";
    case "paladino-coroa:guarda inabalavel":
      return "Reduz o dano sofrido por aliados.";
    case "paladino-coroa:defensor exemplar":
      return "Protege aliados e intercepta ataques automaticamente.";
    case "paladino-devocao:magias de juramento":
      return "Mantém magias de juramento sempre preparadas.";
    case "paladino-devocao:canalizar divindade":
      return "Usa Canalizar Divindade para santificar a arma ou expulsar criaturas profanas.";
    case "paladino-devocao:aura de devocao":
      return "Aliados próximos não podem ser enfeitiçados.";
    case "paladino-devocao:pureza de espirito":
      return "Mantém Proteção contra o Bem e Mal de forma constante.";
    case "paladino-devocao:aureola sagrada":
      return "Emana luz divina que protege aliados e fere inimigos.";
    case "paladino-gloria:magias de juramento":
      return "Mantém magias de juramento sempre preparadas.";
    case "paladino-gloria:inspiracao heroica":
      return "Concede bônus físicos a você ou a aliados.";
    case "paladino-gloria:aura de alacridade":
      return "Aumenta a velocidade de aliados próximos.";
    case "paladino-gloria:corpo perfeito":
      return "Ganha bônus físicos e mais resistência.";
    case "paladino-gloria:lenda viva":
      return "Assume uma forma heroica que amplia seu potencial em combate.";
    case "paladino-redencao:magias de juramento":
      return "Mantém magias de juramento sempre preparadas.";
    case "paladino-redencao:canalizar divindade":
      return "Usa Canalizar Divindade para pacificar inimigos ou refletir dano.";
    case "paladino-redencao:aura do guardiao":
      return "Pode sofrer dano no lugar de aliados próximos.";
    case "paladino-redencao:espirito protetor":
      return "Recupera pontos de vida no fim do turno quando estiver ferido.";
    case "paladino-redencao:anjo da redencao":
      return "Reflete dano e protege aliados automaticamente.";
    case "paladino-vinganca:magias de juramento":
      return "Mantém magias de juramento sempre preparadas.";
    case "paladino-vinganca:canalizar divindade":
      return "Usa Canalizar Divindade para marcar ou amedrontar sua presa.";
    case "paladino-vinganca:vingador implacavel":
      return "Move-se para perseguir inimigos após ataques de oportunidade.";
    case "paladino-vinganca:alma da vinganca":
      return "Pode reagir contra inimigos marcados quando eles atacam.";
    case "paladino-vinganca:anjo vingador":
      return "Ganha voo, aura de medo e mobilidade superior.";
    case "paladino-ancioes:magias de juramento":
      return "Mantém magias de juramento sempre preparadas.";
    case "paladino-ancioes:canalizar divindade":
      return "Usa Canalizar Divindade para prender inimigos ou recuperar vida rapidamente.";
    case "paladino-ancioes:aura de protecao":
      return "Aliados próximos recebem resistência a dano de magia.";
    case "paladino-ancioes:guardiao imortal":
      return "Recupera pontos de vida no início do turno se estiver ferido.";
    case "paladino-ancioes:campeao anciao":
      return "Assume uma forma ancestral com cura, resistência e bônus mágicos.";
    case "paladino-vigilantes:magias de juramento":
      return "Mantém magias de juramento sempre preparadas.";
    case "paladino-vigilantes:canalizar divindade":
      return "Usa Canalizar Divindade para revelar ameaças ocultas ou reforçar a mente.";
    case "paladino-vigilantes:aura do sentinela":
      return "Aliados próximos ganham bônus em iniciativa.";
    case "paladino-vigilantes:vigilancia constante":
      return "Ganha vantagem em testes mentais.";
    case "paladino-vigilantes:sentinela eterna":
      return "Recebe bônus especiais contra criaturas extraplanares.";
    case "paladino-quebrador-de-juramento:magias de juramento":
      return "Mantém magias de juramento sempre preparadas.";
    case "paladino-quebrador-de-juramento:canalizar divindade":
      return "Usa Canalizar Divindade para controlar mortos-vivos ou enfraquecer inimigos.";
    case "paladino-quebrador-de-juramento:aura de odio":
      return "Você e seus aliados causam dano extra em ataques corpo a corpo.";
    case "paladino-quebrador-de-juramento:resistencia sobrenatural":
      return "Ganha resistência a dano não mágico.";
    case "paladino-quebrador-de-juramento:avatar do terror":
      return "Assusta inimigos próximos e amplia seu poder ofensivo.";
    case "feiticeiro-alma-favorecida:asas sobrenaturais":
      return "Manifesta asas espectrais e ganha deslocamento de voo.";
    case "feiticeiro-alma-favorecida:recuperacao transcendente":
      return "Recupera grande parte dos próprios pontos de vida.";
    case "feiticeiro-alma-mecanica:magia ordenada":
      return "Ganha magias adicionais ligadas à ordem e ao equilíbrio.";
    case "feiticeiro-alma-mecanica:protecao mecanica":
    case "feiticeiro-alma-mecanica:proteção mecânica":
      return "Reduz dano com proteção mágica de natureza mecânica.";
    case "feiticeiro-alma-mecanica:perfeicao arcana":
    case "feiticeiro-alma-mecanica:perfeição arcana":
      return "Maximiza resultados em momentos decisivos.";
    case "feiticeiro-tempestade:magia tempestuosa":
      return "Move-se logo após conjurar uma magia.";
    case "feiticeiro-tempestade:coracao da tempestade":
    case "feiticeiro-tempestade:coração da tempestade":
      return "Espalha dano tempestuoso ao redor ao conjurar magia.";
    case "feiticeiro-tempestade:alma da tempestade":
      return "Ganha deslocamento de voo.";
    case "feiticeiro-tempestade:tempestade viva":
      return "Passa a controlar ventos e tempestades ao seu redor.";
    case "feiticeiro-sombras:olhos das trevas":
      return "Ganha visão no escuro ampliada.";
    case "feiticeiro-sombras:cao das sombras":
    case "feiticeiro-sombras:cão das sombras":
      return "Invoca um cão sombrio para perseguir a presa.";
    case "feiticeiro-sombras:passo sombrio":
      return "Teleporta-se entre sombras.";
    case "feiticeiro-sombras:forma sombria":
      return "Assume uma forma sombria para evitar dano.";
    case "feiticeiro-lunar:fases lunares":
      return "Muda de fase para receber benefícios diferentes.";
    case "feiticeiro-lunar:luz lunar":
      return "Canaliza luz lunar para curar e causar dano radiante.";
    case "feiticeiro-lunar:forma lunar":
      return "Assume uma forma lunar poderosa.";
    case "feiticeiro-draconico:resiliencia draconica":
    case "feiticeiro-draconico:resiliência dracônica":
      return "Aumenta sua proteção natural e seus pontos de vida.";
    case "feiticeiro-draconico:afinidade elemental":
      return "Aumenta o dano do elemento associado à linhagem.";
    case "feiticeiro-draconico:asas draconicas":
    case "feiticeiro-draconico:asas dracônicas":
      return "Manifesta asas e ganha deslocamento de voo.";
    case "feiticeiro-draconico:presenca draconica":
    case "feiticeiro-draconico:presença dracônica":
      return "Emana uma presença dracônica que intimida inimigos.";
    case "feiticeiro-magia-selvagem:surto selvagem":
      return "Produz efeitos mágicos aleatórios ao conjurar.";
    case "feiticeiro-magia-selvagem:manipular sorte":
      return "Altera rolagens com sorte caótica.";
    case "feiticeiro-magia-selvagem:controle do caos":
      return "Passa a controlar melhor seus efeitos selvagens.";
    case "feiticeiro-magia-selvagem:surto supremo":
      return "Leva seus efeitos de magia selvagem ao auge.";
    case "feiticeiro-mente-aberrante:magias psiquicas":
    case "feiticeiro-mente-aberrante:magias psíquicas":
      return "Ganha magias ligadas à mente e ao psiquismo.";
    case "feiticeiro-mente-aberrante:forma aberrante":
      return "Assume traços aberrantes para ganhar resistência.";
    case "feiticeiro-mente-aberrante:mente suprema":
      return "Domina inimigos por força mental.";
    case "ladino-assassino:assassinar":
      return "Tem vantagem contra inimigos que ainda não agiram e amplia o dano em emboscadas.";
    case "ladino-assassino:infiltracao especialista":
    case "ladino-assassino:infiltração especialista":
      return "Cria identidades falsas convincentes.";
    case "ladino-assassino:impostor":
      return "Imita aparência e voz com grande precisão.";
    case "ladino-assassino:golpe mortal":
      return "Dobra o dano contra alvos surpresos.";
    case "ladino-batedor:escaramucador":
    case "ladino-batedor:escaramuçador":
      return "Move-se como reação quando um inimigo se aproxima.";
    case "ladino-batedor:sobrevivente":
      return "Ganha perícias ligadas à vida selvagem.";
    case "ladino-batedor:mobilidade superior":
      return "Aumenta seu deslocamento.";
    case "ladino-batedor:emboscador":
      return "Ganha vantagem no primeiro turno do combate.";
    case "ladino-batedor:golpe subito":
    case "ladino-batedor:golpe súbito":
      return "Realiza um ataque adicional em combate.";
    case "ladino-faca-alma:laminas psiquicas":
    case "ladino-faca-alma:lâminas psíquicas":
      return "Cria lâminas mentais para atacar.";
    case "ladino-faca-alma:energia psiquica":
    case "ladino-faca-alma:energia psíquica":
      return "Usa dados psíquicos para melhorar ações e testes.";
    case "ladino-faca-alma:veu psiquico":
    case "ladino-faca-alma:véu psíquico":
      return "Fica invisível temporariamente.";
    case "ladino-faca-alma:golpe mental":
      return "Descarrega dano psíquico massivo.";
    case "ladino-fantasma:sussurros dos mortos":
      return "Recebe proficiências temporárias dos mortos.";
    case "ladino-fantasma:lamentos":
      return "Espalha dano extra a outro alvo.";
    case "ladino-fantasma:alma errante":
      return "Interage com espíritos de forma mais profunda.";
    case "ladino-fantasma:forma fantasmagorica":
    case "ladino-fantasma:forma fantasmagórica":
      return "Move-se através de objetos como um fantasma.";
    case "ladino-fantasma:morte roubada":
      return "Adia a morte ao consumir energia espiritual.";
    case "ladino-inquiridor:olho para fraqueza":
      return "Lê o inimigo para encontrar seus pontos fracos.";
    case "ladino-inquiridor:detector de mentiras":
      return "Percebe enganos com facilidade.";
    case "ladino-inquiridor:leitura de movimento":
      return "Prevê ações inimigas em combate.";
    case "ladino-inquiridor:olho impecavel":
    case "ladino-inquiridor:olho impecável":
      return "Detecta ameaças ocultas e invisíveis.";
    case "ladino-inquiridor:mente superior":
      return "Leva sua leitura de combate ao auge.";
    case "ladino-ladrao:maos rapidas":
    case "ladino-ladrao:mãos rápidas":
      return "Usa a ação bônus para manipular objetos com agilidade.";
    case "ladino-ladrao:escalada agil":
    case "ladino-ladrao:escalada ágil":
      return "Escala com mais rapidez.";
    case "ladino-ladrao:furtividade suprema":
      return "Aprimora sua furtividade ao máximo.";
    case "ladino-ladrao:uso de dispositivos":
      return "Usa itens mágicos com mais facilidade.";
    case "ladino-ladrao:reflexos rapidos":
    case "ladino-ladrao:reflexos rápidos":
      return "Age duas vezes no primeiro turno.";
    case "ladino-trapaceiro-arcano:conjuracao":
    case "ladino-trapaceiro-arcano:conjuração":
      return "Aprende magias de mago para reforçar seus truques e enganos.";
    case "ladino-trapaceiro-arcano:mao magica aprimorada":
    case "ladino-trapaceiro-arcano:mão mágica aprimorada":
      return "Sua mão mágica fica invisível e mais poderosa.";
    case "ladino-trapaceiro-arcano:emboscada magica":
    case "ladino-trapaceiro-arcano:emboscada mágica":
      return "Alvos têm mais dificuldade para resistir às suas magias.";
    case "ladino-trapaceiro-arcano:enganador versatil":
    case "ladino-trapaceiro-arcano:enganador versátil":
      return "Distrai inimigos com ilusões e truques arcanos.";
    case "ladino-trapaceiro-arcano:ladrao de magia":
    case "ladino-trapaceiro-arcano:ladrão de magia":
      return "Rouba magia de inimigos.";
    case "mago-cronurgista:consciencia temporal":
    case "mago-cronurgista:consciência temporal":
      return "Adiciona Inteligência à iniciativa.";
    case "mago-cronurgista:retroceder momento":
      return "Força uma rerrolagem ao retroceder um instante no tempo.";
    case "mago-cronurgista:estase momentanea":
    case "mago-cronurgista:estase momentânea":
      return "Prende uma criatura em estase temporária.";
    case "mago-cronurgista:aceleracao arcana":
    case "mago-cronurgista:aceleração arcana":
      return "Acelera uma magia para conjurá-la com mais rapidez.";
    case "mago-cronurgista:fragmentar linha temporal":
      return "Ignora uma falha ou um golpe ao quebrar a linha do tempo.";
    case "mago-abjuracao:protecao arcana":
    case "mago-abjuracao:proteção arcana":
      return "Cria um escudo mágico ao conjurar abjuração.";
    case "mago-abjuracao:protecao projetada":
    case "mago-abjuracao:proteção projetada":
      return "Seu escudo também pode proteger aliados.";
    case "mago-abjuracao:melhoria na abjuracao":
    case "mago-abjuracao:melhoria na abjuração":
      return "Ganha bônus em testes contra magia.";
    case "mago-abjuracao:resistencia a magia":
    case "mago-abjuracao:resistência à magia":
      return "Ganha vantagem contra magias.";
    case "mago-adivinhacao:pressagio":
    case "mago-adivinhacao:presságio":
      return "Rola dados após o descanso e os usa para substituir resultados futuros.";
    case "mago-adivinhacao:adivinhacao especializada":
    case "mago-adivinhacao:adivinhação especializada":
      return "Recupera espaço ao conjurar magias de adivinhação.";
    case "mago-adivinhacao:terceiro olho":
      return "Ganha sentidos mágicos temporários.";
    case "mago-adivinhacao:grande pressagio":
    case "mago-adivinhacao:grande presságio":
      return "Amplia o uso de Presságio.";
    case "mago-conjuracao:conjuracao menor":
    case "mago-conjuracao:conjuração menor":
      return "Cria um objeto simples e temporário.";
    case "mago-conjuracao:transporte benigno":
      return "Teleporta-se a curta distância como ação.";
    case "mago-conjuracao:foco em conjuracao":
    case "mago-conjuracao:foco em conjuração":
      return "Suas conjurações mantêm a concentração com mais facilidade.";
    case "mago-conjuracao:conjuracao duradoura":
    case "mago-conjuracao:conjuração duradoura":
      return "Suas invocações ficam mais resistentes.";
    case "mago-evocacao:esculpir magia":
      return "Poupa aliados dos piores efeitos das suas magias em área.";
    case "mago-evocacao:truque potente":
      return "Seus truques ainda causam dano mesmo quando resistidos.";
    case "mago-evocacao:evocacao potente":
    case "mago-evocacao:evocação potente":
      return "Adiciona Inteligência ao dano de magias evocadas.";
    case "mago-evocacao:sobrecarga":
      return "Maximiza o dano de uma magia em um momento decisivo.";
    case "mago-ilusao:ilusao aprimorada":
    case "mago-ilusao:ilusão aprimorada":
      return "Melhora suas ilusões e concede um truque adicional.";
    case "mago-ilusao:maleabilidade":
      return "Altera ilusões já conjuradas.";
    case "mago-ilusao:ilusao ilusoria":
    case "mago-ilusao:ilusão ilusória":
      return "Dá substância parcial às suas ilusões.";
    case "mago-ilusao:realidade ilusoria":
    case "mago-ilusao:realidade ilusória":
      return "Torna parte de uma ilusão real.";
    case "mago-necromancia:ceifador":
      return "Recupera vitalidade ao matar criaturas com magia.";
    case "mago-necromancia:servos mortos-vivos":
      return "Fortalece mortos-vivos que você cria.";
    case "mago-necromancia:resistencia necrotica":
    case "mago-necromancia:resistência necrótica":
      return "Ganha resistência a dano necrótico.";
    case "mago-necromancia:comandar mortos":
      return "Controla mortos-vivos inimigos.";
    case "mago-transmutacao:alquimia menor":
      return "Transmuta materiais simples temporariamente.";
    case "mago-transmutacao:pedra do transmutador":
      return "Cria uma pedra com benefícios passivos.";
    case "mago-transmutacao:moldar forma":
      return "Altera o próprio corpo de forma limitada.";
    case "mago-transmutacao:transmutacao suprema":
    case "mago-transmutacao:transmutação suprema":
      return "Realiza grandes transformações mágicas.";
    case "mago-encantamento:olhar hipnotico":
    case "mago-encantamento:olhar hipnótico":
      return "Hipnotiza uma criatura com o olhar.";
    case "mago-encantamento:encantamento instintivo":
      return "Redireciona ataques com magia de encantamento.";
    case "mago-encantamento:encantamento dividido":
      return "Afeta múltiplos alvos com o mesmo encantamento.";
    case "mago-encantamento:memoria alterada":
    case "mago-encantamento:memória alterada":
      return "Apaga ou modifica lembranças.";
    case "mago-graviturgista:ajuste de densidade":
      return "Altera peso e velocidade de uma criatura.";
    case "mago-graviturgista:pressao intensa":
    case "mago-graviturgista:pressão intensa":
      return "Aumenta dano e controle com gravidade concentrada.";
    case "mago-graviturgista:colapso gravitacional":
      return "Cria uma área de gravidade esmagadora.";
    case "mago-lamina-cantante:cancao da lamina":
    case "mago-lamina-cantante:canção da lâmina":
      return "Entra em uma postura arcana que melhora CA, mobilidade e concentração.";
    case "mago-lamina-cantante:defesa arcana":
      return "Reduz dano com reação.";
    case "mago-lamina-cantante:cancao da vitoria":
    case "mago-lamina-cantante:canção da vitória":
      return "Adiciona Inteligência ao dano dos ataques.";
    case "mago-guerra:reflexos arcanos":
      return "Recebe bônus em iniciativa.";
    case "mago-guerra:deflexao arcana":
    case "mago-guerra:deflexão arcana":
      return "Usa reação para ganhar bônus em CA ou resistência.";
    case "mago-guerra:escudo duravel":
    case "mago-guerra:escudo durável":
      return "Mantém concentração com mais facilidade.";
    case "mago-guerra:sobrecarregar magia":
      return "Libera dano extra massivo ao custo de instabilidade.";
    case "mago-escribas:mente desperta":
      return "Conjura através do grimório desperto.";
    case "mago-escribas:manifestar mente":
      return "Seu grimório ganha uma manifestação própria.";
    case "mago-escribas:maestria de pergaminhos":
      return "Cria pergaminhos com mais rapidez.";
    case "mago-escribas:grimorio supremo":
    case "mago-escribas:grimório supremo":
      return "Evita a morte destruindo o próprio grimório.";
    case "barbaro-fera:forma da fera":
      return "Ao entrar em Fúria, manifesta armas naturais bestiais.";
    case "barbaro-fera:alma bestial":
      return "Seus ataques se tornam mágicos e você ganha adaptação física.";
    case "barbaro-fera:furia infecciosa":
    case "barbaro-fera:fúria infecciosa":
      return "Contamina o alvo com sua fúria e o força a atacar ou sofrer dano.";
    case "barbaro-fera:chamado da cacada":
    case "barbaro-fera:chamado da caçada":
      return "Concede bônus de combate a aliados próximos.";
    case "barbaro-magia-selvagem:surto de magia selvagem":
      return "Ao entrar em Fúria, libera um efeito mágico aleatório.";
    case "barbaro-magia-selvagem:fluxo instavel":
    case "barbaro-magia-selvagem:fluxo instável":
      return "Pode alterar o efeito da sua magia selvagem.";
    case "barbaro-magia-selvagem:reacao controlada":
    case "barbaro-magia-selvagem:reação controlada":
      return "Passa a escolher o resultado da sua magia selvagem.";
    case "barbaro-arauto-tempestade:aura da tempestade":
      return "Durante a Fúria, sua aura causa dano elemental ao redor.";
    case "barbaro-arauto-tempestade:alma da tempestade":
      return "Ganha resistência elemental ligada ao ambiente escolhido.";
    case "barbaro-arauto-tempestade:escudo tempestuoso":
      return "Usa a tempestade para proteger aliados.";
    case "barbaro-arauto-tempestade:furia da tempestade":
    case "barbaro-arauto-tempestade:fúria da tempestade":
      return "Reflete dano elemental quando é atingido.";
    case "barbaro-berserker:frenesi":
      return "Durante a Fúria, faz um ataque extra como ação bônus.";
    case "barbaro-berserker:intimidacao":
    case "barbaro-berserker:intimidação":
      return "Assusta inimigos com presença feroz.";
    case "barbaro-berserker:retaliacao":
    case "barbaro-berserker:retaliação":
      return "Contra-ataca imediatamente após sofrer dano.";
    case "barbaro-fanatico:furia divina":
    case "barbaro-fanatico:fúria divina":
      return "Seus ataques causam dano radiante ou necrótico adicional.";
    case "barbaro-fanatico:presenca fanatica":
    case "barbaro-fanatico:presença fanática":
      return "Fortalece aliados próximos com fervor divino.";
    case "barbaro-fanatico:furia alem da morte":
    case "barbaro-fanatico:fúria além da morte":
      return "Continua lutando mesmo à beira da morte.";
    case "barbaro-gigante:poder do gigante":
      return "Aumenta de tamanho e alcance ao liberar poder gigante.";
    case "barbaro-gigante:forma gigante":
      return "Cresce ainda mais e causa mais dano.";
    case "barbaro-gigante:forca titanica":
    case "barbaro-gigante:força titânica":
      return "Recebe um grande aumento de força e dano.";
    case "barbaro-guardiao-ancestral:protetores ancestrais":
      return "Inimigos que você marca causam menos dano a aliados.";
    case "barbaro-guardiao-ancestral:escudo espiritual":
      return "Usa espíritos ancestrais para reduzir dano em aliados.";
    case "barbaro-guardiao-ancestral:consulta espiritual":
      return "Ganha orientação e comunicação através dos ancestrais.";
    case "barbaro-guardiao-ancestral:vinganca ancestral":
    case "barbaro-guardiao-ancestral:vingança ancestral":
      return "Reflete dano de volta aos inimigos que ferem seus aliados.";
    case "barbaro-coracao-selvagem:buscador espiritual":
      return "Usa rituais para se comunicar e perceber pelos espíritos animais.";
    case "barbaro-coracao-selvagem:espirito totemico":
    case "barbaro-coracao-selvagem:espírito totêmico":
      return "Escolhe um espírito animal que reforça sua Fúria.";
    case "barbaro-coracao-selvagem:aspecto da fera":
      return "Recebe um benefício utilitário permanente do seu totem.";
    case "barbaro-coracao-selvagem:andarilho espiritual":
      return "Pede orientação sobrenatural aos espíritos.";
    case "barbaro-coracao-selvagem:sintonia totemica":
    case "barbaro-coracao-selvagem:sintonia totêmica":
      return "Seu espírito totêmico evolui e concede um poder marcante.";
    case "bardo-bravura:proficiencias de combate":
    case "bardo-bravura:proficiências de combate":
      return "Ganha proficiência com armas e armaduras médias.";
    case "bardo-bravura:inspiracao de combate":
    case "bardo-bravura:inspiração de combate":
      return "Aliados podem usar Inspiração para aumentar dano ou CA.";
    case "bardo-bravura:magia de batalha":
      return "Após conjurar magia, pode fazer um ataque como ação bônus.";
    case "bardo-criacao:nota da criacao":
    case "bardo-criacao:nota da criação":
      return "Cria um objeto mágico temporário.";
    case "bardo-criacao:inspiracao criativa":
    case "bardo-criacao:inspiração criativa":
      return "Sua Inspiração de Bardo concede efeitos adicionais.";
    case "bardo-criacao:performance animada":
      return "Dá vida a um objeto para lutar ao seu lado.";
    case "bardo-criacao:criacao superior":
    case "bardo-criacao:criação superior":
      return "Cria objetos maiores sem custo extra.";
    case "bardo-eloquencia:lingua prateada":
    case "bardo-eloquencia:língua prateada":
      return "Não rola baixo em testes sociais importantes.";
    case "bardo-eloquencia:palavras inquietantes":
      return "Enfraquece as resistências de um inimigo com suas palavras.";
    case "bardo-eloquencia:inspiracao infalivel":
    case "bardo-eloquencia:inspiração infalível":
      return "A Inspiração de Bardo não é desperdiçada ao falhar.";
    case "bardo-eloquencia:discurso universal":
      return "Todos conseguem entender suas palavras.";
    case "bardo-conhecimento:palavras cortantes":
      return "Usa Inspiração para reduzir ataques, testes ou dano inimigos.";
    case "bardo-conhecimento:segredos magicos adicionais":
    case "bardo-conhecimento:segredos mágicos adicionais":
      return "Aprende magias de outras listas.";
    case "bardo-conhecimento:habilidade inigualavel":
    case "bardo-conhecimento:habilidade inigualável":
      return "Usa Inspiração para melhorar testes de habilidade.";
    case "bardo-espiritos:sussurros espirituais":
      return "Ganha magias e comunicação com espíritos.";
    case "bardo-espiritos:contos sobrenaturais":
      return "Ao usar Inspiração, desencadeia um conto com efeito aleatório.";
    case "bardo-espiritos:contos guiados":
      return "Passa a escolher o efeito dos seus contos.";
    case "bardo-sussurros:laminas psiquicas":
    case "bardo-sussurros:lâminas psíquicas":
      return "Seus ataques causam dano psíquico adicional.";
    case "bardo-sussurros:palavras do terror":
      return "Assusta um inimigo após uma conversa tensa.";
    case "bardo-sussurros:manto dos sussurros":
      return "Rouba a identidade de mortos recentes.";
    case "bardo-sussurros:sombra sombria":
      return "Passa a controlar melhor criaturas aterrorizadas.";
    case "druida-lua:forma de combate":
      return "Usa Forma Selvagem para assumir criaturas mais poderosas.";
    case "druida-lua:forma elemental":
      return "Usa Forma Selvagem para virar um elemental.";
    case "druida-lua:mil formas":
      return "Altera a própria aparência livremente.";
    case "druida-terra:magias do circulo":
    case "druida-terra:magias do círculo":
      return "Mantém magias ligadas ao terreno sempre preparadas.";
    case "druida-terra:recuperacao natural":
    case "druida-terra:recuperação natural":
      return "Recupera alguns espaços de magia.";
    case "druida-terra:passo da terra":
      return "Ignora terreno difícil natural e obstáculos do ambiente.";
    case "druida-terra:camuflagem natural":
      return "Fica difícil de detectar em ambientes naturais.";
    case "druida-terra:corpo da natureza":
      return "Ganha imunidade a veneno e doença.";
    case "druida-pastor:totem espiritual":
      return "Invoca um espírito totêmico que concede bônus ao grupo.";
    case "druida-pastor:invocador poderoso":
      return "Fortalece as criaturas que você invoca.";
    case "druida-pastor:espirito guardiao":
    case "druida-pastor:espírito guardião":
      return "Cura aliados invocados e próximos.";
    case "druida-pastor:invocacao suprema":
    case "druida-pastor:invocação suprema":
      return "Suas invocações ficam muito mais fortes.";
    case "druida-esporos:halo de esporos":
      return "Usa esporos para causar dano a criaturas próximas.";
    case "druida-esporos:forma simbiotica":
    case "druida-esporos:forma simbiótica":
      return "Ganha pontos de vida temporários e dano extra.";
    case "druida-esporos:esporos expandido":
      return "Aumenta o alcance dos seus esporos.";
    case "druida-esporos:corpo fungico":
    case "druida-esporos:corpo fúngico":
      return "Ganha imunidade a certas condições.";
    case "druida-sonhos:balsamo da corte de verao":
    case "druida-sonhos:bálsamo da corte de verão":
      return "Cura aliados à distância com energia feérica.";
    case "druida-sonhos:protecao dos sonhos":
    case "druida-sonhos:proteção dos sonhos":
      return "Protege criaturas durante o descanso.";
    case "druida-sonhos:caminho dos sonhos":
      return "Viaja entre planos através do reino dos sonhos.";
    case "guerreiro-arqueiro-arcano:tiro arcano":
      return "Seus disparos ganham efeitos mágicos especiais.";
    case "guerreiro-arqueiro-arcano:conhecimento arcano":
      return "Ganha treinamento adicional em saberes arcanos.";
    case "guerreiro-arqueiro-arcano:flecha magica":
    case "guerreiro-arqueiro-arcano:flecha mágica":
      return "Seus disparos com arco superam resistência e imunidade a ataques não mágicos.";
    case "guerreiro-arqueiro-arcano:tiro curvo":
      return "Redireciona uma flecha que errou o alvo.";
    case "guerreiro-arqueiro-arcano:tiro aprimorado":
      return "Aumenta o dano dos seus tiros arcanos.";
    case "guerreiro-arqueiro-arcano:tiro constante":
      return "Recupera um uso de Tiro Arcano quando está sem nenhum.";
    case "guerreiro-arqueiro-arcano:tiro aprimorado superior":
      return "Melhora ainda mais o dano dos seus tiros arcanos.";
    case "guerreiro-cavaleiro-do-eco:manifestar eco":
      return "Cria um eco para atacar e se posicionar em outro ponto do campo.";
    case "guerreiro-cavaleiro-do-eco:troca de lugar":
      return "Troca de posição com o próprio eco.";
    case "guerreiro-cavaleiro-do-eco:avatar do eco":
      return "Transfere os sentidos ao eco para explorar à distância.";
    case "guerreiro-cavaleiro-do-eco:sombra protetora":
      return "Seu eco protege aliados próximos.";
    case "guerreiro-cavaleiro-do-eco:eco aprimorado":
      return "Consegue fazer ainda mais ataques através do eco.";
    case "guerreiro-cavaleiro-do-eco:legiao de ecos":
    case "guerreiro-cavaleiro-do-eco:legião de ecos":
      return "Cria vários ecos ao mesmo tempo.";
    case "guerreiro-cavaleiro-runico:inscricoes runicas":
    case "guerreiro-cavaleiro-runico:inscrições rúnicas":
      return "Aprende runas com efeitos passivos e ativos.";
    case "guerreiro-cavaleiro-runico:poder do gigante":
      return "Cresce e ganha vantagens de combate inspiradas nos gigantes.";
    case "guerreiro-cavaleiro-runico:escudo runico":
    case "guerreiro-cavaleiro-runico:escudo rúnico":
      return "Força a rerrolagem de um ataque contra um aliado.";
    case "guerreiro-cavaleiro-runico:grande estatura":
      return "Aumenta tamanho e dano.";
    case "guerreiro-cavaleiro-runico:maestria runica":
    case "guerreiro-cavaleiro-runico:maestria rúnica":
      return "Pode ativar runas com mais frequência.";
    case "guerreiro-cavaleiro-runico:forma do colosso":
      return "Assume uma forma gigante extremamente poderosa.";
    case "guerreiro-guerreiro-psiquico:poder psiquico":
    case "guerreiro-guerreiro-psiquico:poder psíquico":
      return "Usa dados psíquicos para ataque, defesa e mobilidade.";
    case "guerreiro-guerreiro-psiquico:adepto telecinetico":
    case "guerreiro-guerreiro-psiquico:adepto telecinético":
      return "Aprimora Movimento Telecinético e permite empurrar ou derrubar com Golpe Psiônico.";
    case "guerreiro-guerreiro-psiquico:escudo psiquico":
    case "guerreiro-guerreiro-psiquico:escudo psíquico":
      return "Usa energia mental para reduzir dano.";
    case "guerreiro-guerreiro-psiquico:golpe telecinetico":
    case "guerreiro-guerreiro-psiquico:golpe telecinético":
      return "Empurra inimigos com força mental ao acertá-los.";
    case "guerreiro-guerreiro-psiquico:mestre psiquico":
    case "guerreiro-guerreiro-psiquico:mestre psíquico":
      return "Recupera recursos psíquicos com mais frequência.";
    case "guerreiro-mestre-de-batalha:superioridade em combate":
      return "Aprende manobras que usam dados de superioridade.";
    case "guerreiro-mestre-de-batalha:estudante da guerra":
      return "Ganha proficiência em uma ferramenta artesanal.";
    case "guerreiro-mestre-de-batalha:conhecer o inimigo":
      return "Avalia as capacidades de combate de um alvo observando-o.";
    case "guerreiro-mestre-de-batalha:superioridade aprimorada":
      return "Seus dados de superioridade aumentam.";
    case "guerreiro-mestre-de-batalha:implacavel":
    case "guerreiro-mestre-de-batalha:implacável":
      return "Recupera um dado de superioridade quando começa sem nenhum.";
    case "guerreiro-mestre-de-batalha:superioridade suprema":
      return "Seus dados de superioridade atingem o máximo.";
    case "guerreiro-samurai:espirito lutador":
    case "guerreiro-samurai:espírito lutador":
      return "Ganha vantagem nos ataques e pontos de vida temporários.";
    case "guerreiro-samurai:elegancia cortesa":
    case "guerreiro-samurai:elegância cortesã":
      return "Adiciona Sabedoria aos testes sociais.";
    case "guerreiro-samurai:espirito incansavel":
    case "guerreiro-samurai:espírito incansável":
      return "Recupera uso de Espírito Lutador ao iniciar combate.";
    case "guerreiro-samurai:golpe rapido":
    case "guerreiro-samurai:golpe rápido":
      return "Troca vantagem por um ataque adicional.";
    case "guerreiro-samurai:forca antes da morte":
    case "guerreiro-samurai:força antes da morte":
      return "Age mesmo quando cai a 0 pontos de vida.";
    case "bardo-espadas:floradas de lamina":
      return "Gasta Inspiração de Bardo para aplicar efeitos extras aos ataques e à movimentação.";
    case "druida-estrelas:forma estelar":
      return "Assume uma forma astral ligada às constelações, com benefícios conforme a constelação escolhida.";
    case "druida-estrelas:pressagio cosmico":
      return "Após um descanso longo, role 1d6 para determinar o presságio do dia.";
    case "druida-estrelas:constelacoes brilhantes":
      return "Melhora sua Forma Estelar.";
    case "druida-estrelas:corpo estelar":
      return "Enquanto estiver em Forma Estelar, ganha resistência física e deslocamento de voo.";
    case "druida-fogo-selvagem:transporte ardente":
      return "Teleporta-se em meio às chamas e espalha fogo ao redor.";
    case "druida-fogo-selvagem:renascer das cinzas":
      return "Ao cair a 0 PV, pode provocar uma explosão de fogo e retornar.";
    case "guerreiro-cavaleiro-arcano:conjuracao":
      return "Aprende magias de mago, com foco em abjuração e evocação.";
    case "guerreiro-cavaleiro-arcano:golpe mistico":
      return "Ao acertar um ataque, o alvo faz o próximo teste de resistência contra sua magia com desvantagem.";
    case "guerreiro-cavaleiro-arcano:magia de guerra aprimorada":
      return "Após conjurar uma magia, pode fazer um ataque com arma como ação bônus.";
    case "monge-forma-astral:bracos astrais":
      return "Manifesta braços astrais que aumentam o alcance e o controle em combate.";
    case "monge-forma-astral:corpo astral":
      return "Manifesta mais do corpo astral para ganhar defesa e mobilidade.";
    case "monge-forma-astral:forma completa":
      return "Conjura um avatar astral completo e mais poderoso.";
    case "monge-misericordia:mao da cura":
      return "Gasta ki para curar aliados ao toque.";
    case "monge-misericordia:mao do dano":
      return "Gasta ki para causar dano extra com energia nociva.";
    case "monge-misericordia:fluxo vital":
      return "Combina cura e dano com mais eficiência.";
    case "monge-misericordia:mestre da misericordia":
      return "Eleva ao máximo seu potencial de cura e execução.";
    case "monge-palma-aberta:tecnica da palma aberta":
      return "Ao usar Rajada de Golpes, pode empurrar, derrubar ou impedir reações.";
    case "monge-palma-aberta:tranquilidade":
      return "Ganha uma proteção mágica constante fora do combate.";
    case "monge-sombras:artes das sombras":
      return "Gasta ki para conjurar magias ligadas à escuridão e furtividade.";
    case "monge-sombras:invisibilidade sombria":
      return "Fica invisível em pouca luz ou escuridão.";
    case "monge-sombras:forma sombria":
      return "Move-se com liberdade pela escuridão e se torna difícil de detectar.";
    case "monge-dragao:sopro draconico":
      return "Libera um sopro elemental em área.";
    case "monge-dragao:asas draconicas":
      return "Manifesta asas para ganhar mobilidade aérea.";
    case "monge-dragao:forma draconica":
      return "Reforça dano e resistência com poder dracônico.";
    case "monge-dragao:presenca draconica":
      return "Exala uma presença dracônica que assusta inimigos.";
    case "monge-kensei:armas do kensei":
      return "Escolhe armas especiais para integrar ao seu estilo marcial.";
    case "monge-kensei:afiar lamina":
      return "Gasta ki para aumentar o dano da arma.";
    case "monge-kensei:precisao mortal":
      return "Seus ataques com armas do kensei ficam mais letais.";
    case "monge-quatro-elementos:disciplinas elementais":
      return "Aprende disciplinas que imitam técnicas elementais.";
    case "monge-quatro-elementos:controle elemental":
      return "Amplia o controle sobre suas disciplinas.";
    case "monge-quatro-elementos:mestre dos elementos":
      return "Domina suas técnicas elementais no nível máximo.";
    case "patrulheiro-andarilho-horizonte:detector planar":
      return "Detecta portais e presenças extraplanares.";
    case "patrulheiro-andarilho-horizonte:golpe planar":
      return "Converte parte do dano em força e causa dano adicional.";
    case "patrulheiro-andarilho-horizonte:passo etereo":
      return "Move-se parcialmente pelo Plano Etéreo.";
    case "patrulheiro-andarilho-horizonte:golpe distante":
      return "Teleporta-se entre ataques.";
    case "patrulheiro-andarilho-horizonte:defesa espectral":
      return "Reduz o dano recebido ao se desfazer momentaneamente.";
    case "patrulheiro-andarilho-feerico:golpe feerico":
      return "Causa dano psíquico adicional.";
    case "patrulheiro-andarilho-feerico:presenca feerica":
      return "Pode enfeitiçar ou assustar inimigos.";
    case "patrulheiro-andarilho-feerico:reviravolta sedutora":
      return "Resiste melhor a encanto e medo e pode redirecionar essas condições contra outra criatura.";
    case "patrulheiro-andarilho-feerico:ataque encantado":
      return "Aumenta o dano contra alvos afetados pelos seus efeitos feéricos.";
    case "patrulheiro-andarilho-feerico:forma feerica":
      return "Ganha resistência e mobilidade sobrenatural.";
    case "patrulheiro-cacador:presa do cacador":
      return "Escolhe Colosso, Matador de Gigantes ou Rompedor de Horda.";
    case "patrulheiro-cacador:taticas defensivas":
      return "Escolhe Escapar da Horda, Defesa contra Ataques Múltiplos ou Vontade de Aço.";
    case "patrulheiro-cacador:ataque multiplo":
      return "Escolhe Saraivada ou Ataque Giratório para atingir vários inimigos.";
    case "patrulheiro-cacador:defesa superior do cacador":
      return "Escolhe Evasão, Resistir à Maré ou Esquiva Sobrenatural.";
    case "patrulheiro-exterminador:caca ao monstro":
      return "Marca um inimigo para ampliar sua pressão ofensiva.";
    case "patrulheiro-exterminador:conhecimento sobrenatural":
      return "Revela resistências, imunidades e vulnerabilidades do alvo.";
    case "patrulheiro-exterminador:defesa sobrenatural":
      return "Resiste melhor aos efeitos das criaturas que caça.";
    case "patrulheiro-exterminador:contra-ataque":
      return "Ataca quando um inimigo erra você.";
    case "patrulheiro-exterminador:matador supremo":
      return "Maximiza o dano contra sua presa marcada.";
    case "patrulheiro-enxame:enxame":
      return "Um enxame aliado ajuda a causar dano, mover alvos ou reposicioná-lo.";
    case "patrulheiro-enxame:mare inquieta":
    case "patrulheiro-enxame:maré inquieta":
      return "O enxame concede voo temporário e permite pairar.";
    case "patrulheiro-enxame:enxame aprimorado":
      return "Seu enxame ganha mais dano e controle.";
    case "patrulheiro-enxame:forma de enxame":
      return "Dispersa o próprio corpo em criaturas do enxame.";
    case "patrulheiro-dracos:companheiro draconico":
      return "Invoca um companheiro dracônico.";
    case "patrulheiro-dracos:vinculo de presas e escamas":
    case "patrulheiro-dracos:vínculo de presas e escamas":
      return "O draco cresce, pode servir de montaria e reforça ataques e resistência elemental.";
    case "patrulheiro-dracos:furia draconica":
      return "Aumenta o dano elemental causado.";
    case "patrulheiro-dracos:dragao supremo":
      return "Fortalece bastante o companheiro dracônico.";
    case "patrulheiro-mestre-feras:companheiro animal":
      return "Ganha uma fera companheira.";
    case "patrulheiro-mestre-feras:treinamento excepcional":
      return "Aprimora os comandos da fera e torna mágicos os ataques dela.";
    case "patrulheiro-mestre-feras:fera aprimorada":
      return "Sua fera fica mais forte e eficiente.";
    case "patrulheiro-mestre-feras:vinculo perfeito":
      return "O vínculo com a fera atinge o auge.";
    case "patrulheiro-perseguidor:emboscador sombrio":
      return "Ganha bônus no primeiro turno e em emboscadas.";
    case "patrulheiro-perseguidor:visao sombria":
      return "Melhora sua visão no escuro.";
    case "patrulheiro-perseguidor:mente de ferro":
      return "Ganha resistência contra efeitos mentais.";
    case "patrulheiro-perseguidor:ataque sombrio":
      return "Realiza um ataque adicional em combate.";
    case "patrulheiro-perseguidor:desaparecimento":
      return "Pode ficar invisível ao se mover.";
    case "barbaro-espinhos:abandono temerario":
      return "Ao usar Ataque Descuidado durante a Fúria, recebe pontos de vida temporários.";
    case "barbaro-espinhos:investida do batalhador":
      return "Enquanto estiver em Fúria, pode Disparar como ação bônus.";
    case "bardo-conhecimento:pericias adicionais":
    case "bardo-conhecimento:perícias adicionais":
      return "Ganha proficiência em perícias adicionais.";
    case "bardo-espadas:florada mestre":
      return "Pode usar floradas sem gastar Inspiração de Bardo.";
    case "bruxo-imperecivel:entre os mortos":
      return "Aprende um truque de necromancia e se protege de mortos-vivos comuns.";
    case "bruxo-infernal:sorte do infernal":
      return "Após rolar, pode somar 1d10 a um teste de habilidade ou resistência.";
    case "bruxo-abismal:tentaculo das profundezas":
    case "bruxo-abismal:tentáculo das profundezas":
      return "Invoca um tentáculo espectral que ataca, reduz deslocamento e pode ser reposicionado.";
    case "clerigo-sepultura:olhos da sepultura":
      return "Percebe mortos-vivos próximos mesmo quando estão ocultos.";
    case "clerigo-sepultura:caminho para a sepultura":
      return "Usa Canalizar Divindade para deixar um alvo vulnerável ao próximo ataque.";
    case "clerigo-sepultura:sentinela a porta da morte":
    case "clerigo-sepultura:sentinela à porta da morte":
      return "Cancela acertos críticos contra criaturas próximas.";
    case "clerigo-sepultura:conjuracao potente":
      return "Adiciona Sabedoria ao dano dos seus truques de clérigo.";
    case "druida-estrelas:mapa estelar":
      return "Ganha um mapa estelar como foco mágico e recebe magias adicionais.";
    case "druida-fogo-selvagem:espirito selvagem":
    case "druida-fogo-selvagem:espírito selvagem":
      return "Invoca um espírito de fogo para lutar ao seu lado.";
    case "feiticeiro-alma-favorecida:magia divina":
      return "Aprende uma magia adicional e pode escolher magias de clérigo como magias de feiticeiro.";
    case "feiticeiro-alma-favorecida:cura empoderada":
      return "Gasta pontos de feitiçaria para rerrolar dados baixos de cura.";
    case "feiticeiro-alma-favorecida:favorecido pelos deuses":
      return "Ao falhar em um ataque ou teste de resistência, pode somar 2d4 ao resultado uma vez por descanso.";
    case "guerreiro-campeao:estilo de combate adicional":
      return "Escolhe um segundo Estilo de Combate.";
    case "guerreiro-cavaleiro:investida feroz":
      return "Ao avançar e atacar, pode derrubar o alvo.";
    case "guerreiro-cavaleiro:defensor vigilante":
      return "Ganha reações extras para ataques de oportunidade.";
    case "guerreiro-cavaleiro-arcano:investida arcana":
      return "Ao usar Surto de Ação, pode se teletransportar.";
    case "guerreiro-porta-estandarte:emissario real":
    case "guerreiro-porta-estandarte:emissário real":
      return "Ganha perícias sociais reforçadas para agir como representante e líder.";
    case "ladino-duelista:audacia rasteira":
    case "ladino-duelista:audácia rasteira":
      return "Recebe bônus de iniciativa e aplica Ataque Furtivo com mais facilidade em duelos corpo a corpo.";
    case "ladino-duelista:panache":
      return "Usa Carisma para provocar um inimigo ou encantar outras criaturas em situações sociais.";
    case "ladino-mentor:mestre da intriga":
      return "Ganha proficiências sociais, imita fala e gestos e cria disfarces convincentes.";
    case "ladino-mentor:mestre da tatica":
    case "ladino-mentor:mestre da tática":
      return "Usa a ação Ajudar à distância e com mais eficiência.";
    case "monge-alma-solar:explosao solar ardente":
    case "monge-alma-solar:explosão solar ardente":
      return "Lança uma esfera radiante que explode e fere criaturas em área.";
    case "monge-morte-ampla:hora da ceifa":
      return "Assusta criaturas próximas com uma onda de presença mortal.";
    case "monge-morte-ampla:dominio da morte":
    case "monge-morte-ampla:domínio da morte":
      return "Gasta ki para evitar cair a 0 pontos de vida.";
    case "monge-palma-aberta:integridade corporal":
      return "Recupera pontos de vida com disciplina interior.";
    case "monge-palma-aberta:palma vibrante":
      return "Marca um inimigo com vibrações letais que pode detonar depois.";
    case "monge-sombras:passo sombrio":
      return "Teleporta-se entre sombras.";
    case "monge-mestre-bebado:proficiencias extras":
    case "monge-mestre-bebado:proficiências extras":
      return "Ganha proficiência em Atuação e em ferramentas ligadas a bebidas.";
    case "barbaro-espinhos:armadura do batalhador":
      return "Com armadura espinhosa, pode atacar com os espinhos como ação bônus e ferir inimigos agarrados.";
    case "barbaro-espinhos:retaliacao espinhosa":
    case "barbaro-espinhos:retaliação espinhosa":
      return "Quando uma criatura adjacente o acerta corpo a corpo, seus espinhos devolvem dano perfurante.";
    case "bardo-glamour:manto da inspiracao":
    case "bardo-glamour:manto da inspiração":
      return "Concede pontos de vida temporários e reposiciona aliados sem ataques de oportunidade.";
    case "bardo-glamour:manto da majestade":
      return "Envolve-se em presença sobrenatural e pode repetir comandos com mais facilidade.";
    case "bruxo-imperecivel:desafiar a morte":
      return "Ao estabilizar alguém ou resistir à morte, pode recuperar pontos de vida.";
    case "bruxo-imperecivel:vida indestrutivel":
    case "bruxo-imperecivel:vida indestrutível":
      return "Como ação bônus, recompõe o próprio corpo e se recupera de ferimentos graves.";
    case "bruxo-infernal:arremessar ao inferno":
      return "Bane momentaneamente um alvo aos Planos Inferiores, causando dano psíquico ao retornar.";
    case "clerigo-sepultura:circulo da mortalidade":
    case "clerigo-sepultura:círculo da mortalidade":
      return "Suas curas ficam mais fortes em alvos à beira da morte, e você aprende um truque de necromancia.";
    case "clerigo-sepultura:guardiao das almas":
    case "clerigo-sepultura:guardião das almas":
      return "Quando inimigos morrem perto de você, pode converter essa passagem em cura para aliados.";
    case "guerreiro-campeao:critico aprimorado":
    case "guerreiro-campeao:crítico aprimorado":
      return "Seus ataques com arma causam acerto crítico com 19 ou 20 no d20.";
    case "guerreiro-campeao:atleta notavel":
    case "guerreiro-campeao:atleta notável":
      return "Recebe metade da proficiência em testes físicos sem proficiência e melhora seus saltos.";
    case "guerreiro-cavaleiro:nascido para a sela":
      return "Tem vantagem para manter-se montado, cai em pé e monta ou desmonta mais rápido.";
    case "guerreiro-cavaleiro:marca inabalavel":
    case "guerreiro-cavaleiro:marca inabalável":
      return "Marca um inimigo, dificulta ataques contra aliados e ganha um contra-ataque mais forte.";
    case "guerreiro-cavaleiro:mantenha a formacao":
    case "guerreiro-cavaleiro:mantenha a formação":
      return "Inimigos provocam ataques ao se mover por perto e podem ter o deslocamento zerado.";
    case "guerreiro-porta-estandarte:grito de incentivo":
      return "Ao usar Segundo Fôlego, também pode curar aliados próximos.";
    case "guerreiro-porta-estandarte:surto inspirador":
      return "Ao usar Surto de Ação, permite que um aliado ataque com reação.";
    case "guerreiro-porta-estandarte:baluarte":
      return "Ao usar Indomável, pode permitir que um aliado repita o mesmo teste.";
    case "guerreiro-porta-estandarte:surto inspirador aprimorado":
      return "Seu Surto Inspirador passa a permitir que dois aliados ataquem.";
    case "ladino-duelista:passos elegantes":
      return "Criaturas atacadas por você não podem fazer ataques de oportunidade contra você no mesmo turno.";
    case "ladino-duelista:manobra elegante":
      return "Como ação bônus, recebe vantagem em testes de Acrobacia ou Atletismo no mesmo turno.";
    case "ladino-duelista:mestre duelista":
      return "Se errar um ataque, pode repetir a rolagem uma vez por descanso curto ou longo.";
    case "ladino-mentor:manipulador perspicaz":
      return "Observa uma criatura para comparar as capacidades dela com as suas.";
    case "ladino-mentor:desvio":
      return "Redireciona um ataque para outra criatura quando um inimigo erra você.";
    case "ladino-mentor:alma da enganacao":
    case "ladino-mentor:alma da enganação":
      return "Sua mente e suas intenções ficam muito mais difíceis de ler magicamente.";
    case "monge-alma-solar:raio solar radiante":
      return "Substitui ataques por raios radiantes à distância que escalam com seu dado marcial.";
    case "monge-alma-solar:golpe do arco ardente":
      return "Após acertar com seus raios, gasta ki para lançar uma onda radiante em cone.";
    case "monge-alma-solar:escudo solar":
      return "Emite luz intensa e fere inimigos que o acertam em combate corpo a corpo.";
    case "monge-morte-ampla:toque da morte":
      return "Ao reduzir uma criatura próxima a 0 pontos de vida, recebe pontos de vida temporários.";
    case "monge-mestre-bebado:tecnica do bebado":
    case "monge-mestre-bebado:técnica do bêbado":
      return "Após Rajada de Golpes, recebe Desengajar e deslocamento extra.";
    case "monge-mestre-bebado:balanco cambaleante":
    case "monge-mestre-bebado:balanço cambaleante":
      return "Levanta-se com pouco movimento e redireciona ataques errados contra outro alvo.";
    case "monge-mestre-bebado:sorte do bebado":
    case "monge-mestre-bebado:sorte do bêbado":
      return "Gasta ki para cancelar desvantagem em ataques, testes ou resistências.";
    case "monge-mestre-bebado:frenesi intoxicante":
      return "Ao usar Rajada de Golpes, distribui ataques adicionais entre criaturas próximas.";
    default:
      break;
  }

  switch (featureName) {
    case "ataque extra":
      return "Pode atacar duas vezes na ação Atacar.";
    case "ataque divino":
      return "Seus ataques com arma causam dano adicional.";
    case "estilo de combate":
      return "Ganha um Estilo de Combate.";
    default:
      return summary;
  }
}

export function compactSubclassFeatureDetails(feature, entry = null) {
  if (!feature) return [];

  const featureName = normalizePt(feature?.nome || feature?.name || "");
  const subclassId = normalizePt(entry?.subclassData?.id || "");
  const key = `${subclassId}:${featureName}`;

  switch (key) {
    case "druida-estrelas:pressagio cosmico":
      return [
        "Par: Bem-estar; conceda 1d6 a uma rolagem de um aliado, uma vez.",
        "Ímpar: Aflição; imponha -1d6 a uma rolagem de um inimigo, uma vez.",
      ];
    default:
      return (Array.isArray(feature?.detalhes) ? feature.detalhes : [])
        .map((detail) => compactSubclassSummaryText(detail))
        .filter(Boolean);
  }
}

export function compactSubclassFeature(feature, entry = null) {
  if (!feature || typeof feature !== "object" || Array.isArray(feature)) return feature;

  return {
    ...feature,
    nome: compactSubclassFeatureName(feature?.nome || feature?.name || "", entry),
    descricao: compactSubclassFeatureSummary(feature, entry),
    detalhes: compactSubclassFeatureDetails(feature, entry),
    subfeatures: Array.isArray(feature?.subfeatures)
      ? feature.subfeatures.map((subfeature) => compactSubclassFeature(subfeature, entry))
      : feature?.subfeatures,
  };
}

