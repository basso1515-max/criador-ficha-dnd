// Static options shared across the 2024 editor.

export const ABILITY_LABELS = {
  for: "Força",
  des: "Destreza",
  con: "Constituição",
  int: "Inteligência",
  sab: "Sabedoria",
  car: "Carisma",
};
export const ABILITY_ORDER = ["for", "des", "con", "int", "sab", "car"];
export const OMITTED_PDF_FEATURE_NAMES_2024 = new Set(["Aumento no Valor de Atributo"]);
export const STANDARD_ABILITY_SET_2024 = [15, 14, 13, 12, 10, 8];
export const STANDARD_ABILITY_SET_BY_CLASS_2024 = {
  barbaro: { for: 15, des: 13, con: 14, int: 10, sab: 12, car: 8 },
  bardo: { for: 8, des: 14, con: 12, int: 13, sab: 10, car: 15 },
  bruxo: { for: 8, des: 14, con: 13, int: 12, sab: 10, car: 15 },
  clerigo: { for: 14, des: 8, con: 13, int: 10, sab: 15, car: 12 },
  druida: { for: 8, des: 12, con: 14, int: 13, sab: 15, car: 10 },
  feiticeiro: { for: 10, des: 13, con: 14, int: 8, sab: 12, car: 15 },
  patrulheiro: { for: 12, des: 15, con: 13, int: 8, sab: 14, car: 10 },
  guerreiro: { for: 15, des: 14, con: 13, int: 8, sab: 10, car: 12 },
  ladino: { for: 12, des: 15, con: 13, int: 14, sab: 10, car: 8 },
  mago: { for: 8, des: 12, con: 13, int: 15, sab: 14, car: 10 },
  monge: { for: 12, des: 15, con: 13, int: 10, sab: 14, car: 8 },
  paladino: { for: 15, des: 10, con: 13, int: 8, sab: 12, car: 14 },
};
export const POINT_BUY_COSTS_2024 = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
};
export const DISTANCE_UNITS_2024 = {
  ft: { label: "ft", factorToMeters: 0.3048, decimals: 0 },
  m: { label: "m", factorToMeters: 1, decimals: 0 },
};
export const WEIGHT_UNITS_2024 = {
  lb: { label: "lb", factorToKg: 0.45359237, decimals: 0 },
  kg: { label: "kg", factorToKg: 1, decimals: 1 },
};
