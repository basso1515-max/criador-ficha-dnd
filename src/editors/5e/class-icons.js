export const CLASS_ICON_PATH_BY_ID_5E = Object.freeze({
  barbaro: "/assets/icons/classes/5e/barbaro.svg",
  bardo: "/assets/icons/classes/5e/bardo.svg",
  clerigo: "/assets/icons/classes/5e/clerigo.svg",
  druida: "/assets/icons/classes/5e/druida.svg",
  guerreiro: "/assets/icons/classes/5e/guerreiro.svg",
  monge: "/assets/icons/classes/5e/monge.svg",
  paladino: "/assets/icons/classes/5e/paladino.svg",
  patrulheiro: "/assets/icons/classes/5e/patrulheiro.svg",
  ladino: "/assets/icons/classes/5e/ladino.svg",
  feiticeiro: "/assets/icons/classes/5e/feiticeiro.svg",
  bruxo: "/assets/icons/classes/5e/bruxo.svg",
  mago: "/assets/icons/classes/5e/mago.svg",
  artifice: "/assets/icons/classes/5e/artifice.svg",
});

export function getClassIconPath5e(classId) {
  return CLASS_ICON_PATH_BY_ID_5E[String(classId || "").trim()] || "";
}
