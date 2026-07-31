export const DIVINITY_ICON_IDS = Object.freeze(`
  arvoreen brandobaris cyrrollalee sheela_peryroyl urogalan yondalla
  abbathor berronar_truesilver clangeddin_silverbeard deep_duerra
  dugmaren_brightmantle dumathoin gorm_gulthyn haela_brightaxe laduguer
  marthammor_duin moradin sharindlar vergadain bahamut enlil finder_wyvernspur
  ghaunadaur gilgeam lurue moander nobanion raven_queen shaundakul tiamat
  akadi amaunator asmodeus auril azuth bane beshaba bhaal cavaleira_vermelha
  chauntea cyric deneir eldath gond grumbar gwaeron helm hoar ilmater istishia
  jergal kelemvor kossuth lathander leira lliira loviatar malar mask mielikki
  milil myrkul mystra oghma savras selune shar silvanus sune talona talos
  tempus torm tymora tyr umberlee valkur waukeen anhur bast geb hathor horus
  isis nephthys osiris re sebek set thoth bahgtru gruumsh ilneval luthic
  shargaas yurtrus aerdrie_faenya angharradh corellon deep_sashelas erevan
  fenmarel_mestarine hanali_celanil labelas_enoreth rillifane_rallathil
  sehanine_moonbow shevarash solonor_thelandira eilistraee kiaransalee lolth
  selvetarm vhaeraun baervan_wildwanderer baravar_cloakshadow
  callarduran_smoothhands flandal_steelskin gaerdal_ironhand garl_glittergold
  nebelun segojan_earthcaller urdlen
`.trim().split(/\s+/));

const DIVINITY_ICON_ID_SET = new Set(DIVINITY_ICON_IDS);
const SLOT_SELECTOR = ".contextual-divinity-symbol-slot[data-divinity-id]";
let iconStylesPromise = null;

export function getDivinityIconPath(divinityId) {
  const normalizedId = String(divinityId || "").trim();
  return DIVINITY_ICON_ID_SET.has(normalizedId)
    ? `/assets/icons/divinities/${normalizedId}.webp`
    : "";
}

function ensureIconStyles() {
  if (iconStylesPromise) return iconStylesPromise;

  iconStylesPromise = new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/src/styles/divinity-icons.css";
    link.dataset.divinityIcons = "";
    link.addEventListener("load", resolve, { once: true });
    link.addEventListener("error", reject, { once: true });
    document.head.append(link);
  });
  return iconStylesPromise;
}

function hydrateSlot(slot) {
  const id = slot.dataset.divinityId || "";
  const iconPath = getDivinityIconPath(id);
  slot.hidden = true;
  slot.removeAttribute("role");
  slot.replaceChildren();
  if (!iconPath) return;

  ensureIconStyles().then(() => {
    if (!slot.isConnected || slot.dataset.divinityId !== id) return;
    const image = document.createElement("img");
    image.className = "contextual-divinity-symbol-image";
    image.src = iconPath;
    image.alt = "";
    image.width = 48;
    image.height = 48;
    image.decoding = "async";
    image.addEventListener("error", () => {
      slot.hidden = true;
      slot.removeAttribute("role");
      slot.replaceChildren();
    }, { once: true });
    slot.replaceChildren(image);
    slot.setAttribute("role", "img");
    slot.hidden = false;
  }).catch(() => {});
}

export function hydrateDivinityIconSlots(root = document) {
  if (!root?.querySelectorAll) return;
  if (root.matches?.(SLOT_SELECTOR)) hydrateSlot(root);
  root.querySelectorAll(SLOT_SELECTOR).forEach(hydrateSlot);
}

if (typeof document !== "undefined" && typeof MutationObserver !== "undefined") {
  hydrateDivinityIconSlots();
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "attributes") hydrateSlot(mutation.target);
      mutation.addedNodes.forEach((node) => hydrateDivinityIconSlots(node));
    });
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-divinity-id"],
    childList: true,
    subtree: true,
  });
}
