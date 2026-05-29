const SPELL_SLOT_LEVELS_2024 = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function clampInt2024(value, min, max) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : min;
}

export function getProficiencyBonus2024(level) {
  return 2 + Math.floor((Math.max(1, Number(level) || 1) - 1) / 4);
}

export function averageHitDieRoundedUp2024(hitDie) {
  const value = Number(hitDie || 0);
  return value > 0 ? Math.floor(value / 2) + 1 : 1;
}

export function buildHitPointLevelEntries2024(entries = [], { labelFromClassId = defaultLabelFromSlug2024 } = {}) {
  const levels = [];
  let characterLevel = 0;

  (entries || []).forEach((entry) => {
    const hitDie = Number(entry?.hitDie || entry?.classData?.dadoVida || 0);
    const className = entry?.classe || entry?.classData?.nome || labelFromClassId(entry?.classId || "");
    for (let classLevel = 1; classLevel <= Number(entry?.level || 0); classLevel += 1) {
      characterLevel += 1;
      levels.push({
        key: `${entry?.uid || entry?.classId || "classe"}:${classLevel}:${characterLevel}:d${hitDie}`,
        characterLevel,
        classLevel,
        className,
        hitDie,
      });
    }
  });

  return levels;
}

export function calculateHitPointsFromClassEntries2024(entries = [], conMod = 0, { mode = "fixed", rolls = {} } = {}) {
  let hpTotal = 0;
  const levelEntries = buildHitPointLevelEntries2024(entries);

  levelEntries.forEach((entry) => {
    if (entry.characterLevel === 1) {
      hpTotal += entry.hitDie + conMod;
      return;
    }

    const rolledValue = clampInt2024(rolls?.[entry.key], 1, entry.hitDie);
    const levelValue = mode === "rolled" && Number.isFinite(Number(rolls?.[entry.key]))
      ? rolledValue
      : averageHitDieRoundedUp2024(entry.hitDie);
    hpTotal += levelValue + conMod;
  });

  return Math.max(1, hpTotal || (1 + conMod));
}

export function getSpellcastingContribution2024(level, progression) {
  const classLevel = clampInt2024(level, 0, 20);
  switch (progression) {
    case "half":
      return Math.floor(classLevel / 2);
    case "half-up":
      return Math.ceil(classLevel / 2);
    case "third":
      return Math.floor(classLevel / 3);
    case "pact":
      return 0;
    case "full":
    default:
      return classLevel;
  }
}

export function getSpellSlotTotalsForLimits2024(limits, spellSlotLevels = SPELL_SLOT_LEVELS_2024) {
  const totals = Object.fromEntries(spellSlotLevels.map((level) => [level, 0]));
  if (!limits) return totals;

  if (limits.pactSlots && limits.pactSlotLevel) {
    totals[limits.pactSlotLevel] = limits.pactSlots;
    return totals;
  }

  spellSlotLevels.forEach((level) => {
    totals[level] = Number(limits.slots?.[level - 1] || 0);
  });
  return totals;
}

export function calculateWeaponMasteryLimit2024(
  entry,
  {
    hasWeaponMastery = false,
    barbarianWeaponMasteryByLevel = [],
    fighterWeaponMasteryByLevel = [],
  } = {}
) {
  if (!hasWeaponMastery) return 0;

  const level = clampInt2024(entry?.level, 1, 20);
  if (entry?.classId === "barbaro") return barbarianWeaponMasteryByLevel[level] || 0;
  if (entry?.classId === "guerreiro") return fighterWeaponMasteryByLevel[level] || 0;
  if (["ladino", "paladino", "guardiao"].includes(entry?.classId)) return 2;
  return Number.POSITIVE_INFINITY;
}

function defaultLabelFromSlug2024(value) {
  return String(value || "")
    .replaceAll("-", " ")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toLocaleUpperCase("pt-BR"));
}
