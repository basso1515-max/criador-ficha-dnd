// Static class progression and granted-spell tables used by the 2024 editor.

export const BARBARIAN_PROGRESSION_2024 = {
  rages: [0, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6],
  rageDamage: [0, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4],
  weaponMastery: [0, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
};
export const FIGHTER_PROGRESSION_2024 = {
  secondWind: [0, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  weaponMastery: [0, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6],
  actionSurge: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2],
  indomitable: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3],
  attacks: [0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
};
export const MONK_PROGRESSION_2024 = {
  martialArtsDie: [0, 6, 6, 6, 6, 8, 8, 8, 8, 8, 8, 10, 10, 10, 10, 10, 10, 12, 12, 12, 12],
  focusPoints: [0, 0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  unarmoredMovementFeet: [0, 0, 10, 10, 10, 10, 15, 15, 15, 15, 20, 20, 20, 20, 25, 25, 25, 25, 30, 30, 30],
};
export const BARD_BARDIC_DIE_BY_LEVEL_2024 = [0, 6, 6, 6, 6, 8, 8, 8, 8, 8, 10, 10, 10, 10, 10, 12, 12, 12, 12, 12, 12];
export const BARD_MAGICAL_SECRETS_CLASS_IDS_2024 = ["bardo", "clerigo", "druida", "mago"];
export const BARD_WORDS_OF_CREATION_SPELL_IDS_2024 = ["palavra-do-poder-cura", "palavra-do-poder-matar"];
export const BARD_GLAMOUR_GRANTED_SPELL_IDS_2024 = {
  3: ["enfeiticar-pessoa", "reflexos"],
  6: ["comando"],
};
export const CLERIC_CHANNEL_DIVINITY_BY_LEVEL_2024 = [0, 0, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4];
export const CLERIC_DOMAIN_GRANTED_SPELL_IDS_2024 = {
  "clerigo-guerra": {
    3: ["disparo-guia", "arma-magica", "escudo-da-fe", "arma-espiritual"],
    5: ["manto-do-cruzado", "guardioes-espirituais"],
    7: ["escudo-de-fogo", "movimento-livre"],
    9: ["imobilizar-monstro", "golpe-do-vento-de-aco"],
  },
  "clerigo-luz": {
    3: ["maos-flamejantes", "fogo-feerico", "raio-ardente", "ver-invisibilidade"],
    5: ["luz-do-dia", "bola-de-fogo"],
    7: ["olho-arcano", "muralha-de-fogo"],
    9: ["golpe-de-chama", "espionagem"],
  },
  "clerigo-enganacao": {
    3: ["enfeiticar-pessoa", "disfarçar-se", "invisibilidade", "passos-sem-pegadas"],
    5: ["padrao-hipnotico", "antideteccao"],
    7: ["confusao", "porta-dimensional"],
    9: ["dominar-pessoa", "modificar-memoria"],
  },
  "clerigo-vida": {
    3: ["ajuda", "bencao", "curar-ferimentos", "restauracao-menor"],
    5: ["palavra-de-cura-em-massa", "revificar"],
    7: ["aura-da-vida", "protecao-contra-morte"],
    9: ["restauracao-maior", "curar-ferimentos-em-massa"],
  },
};
