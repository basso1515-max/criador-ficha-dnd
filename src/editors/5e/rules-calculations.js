const SPELL_SLOT_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function clampInt(value, min, max) {
  const number = Math.floor(Number(value));
  if (Number.isNaN(number)) return min;
  return Math.max(min, Math.min(max, number));
}

export function proficiencyBonus(level) {
  const safeLevel = clampInt(level, 1, 20);
  return 2 + Math.floor((safeLevel - 1) / 4);
}

export function averageHitDieRoundedUp(hitDieSides) {
  const sides = Number(hitDieSides) || 0;
  return Math.ceil((sides + 1) / 2);
}

export function buildHitPointLevelEntries(entries = [], { labelFromClassId = defaultLabelFromSlug } = {}) {
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

export function calculateHitPointsFromClasses(entries = [], conMod = 0, { mode = "fixed", rolls = {} } = {}) {
  let hpTotal = 0;
  const levelEntries = buildHitPointLevelEntries(entries);

  levelEntries.forEach((entry) => {
    if (entry.characterLevel === 1) {
      hpTotal += entry.hitDie + conMod;
      return;
    }

    const rolledValue = clampInt(rolls?.[entry.key], 1, entry.hitDie);
    const levelValue = mode === "rolled" && Number.isFinite(Number(rolls?.[entry.key]))
      ? rolledValue
      : averageHitDieRoundedUp(entry.hitDie);
    hpTotal += levelValue + conMod;
  });

  return Math.max(1, hpTotal || (1 + conMod));
}

export function getEmptySpellSlotTotals(spellSlotLevels = SPELL_SLOT_LEVELS) {
  return Object.fromEntries(spellSlotLevels.map((level) => [level, 0]));
}

export function getSpellSlotTotalsFromSlotsArray(slots = [], spellSlotLevels = SPELL_SLOT_LEVELS) {
  const totals = getEmptySpellSlotTotals(spellSlotLevels);
  spellSlotLevels.forEach((level) => {
    totals[level] = Number(slots[level - 1] || 0);
  });
  return totals;
}

export function getSpellSlotTotalsForLimits(limits, spellSlotLevels = SPELL_SLOT_LEVELS) {
  const totals = getEmptySpellSlotTotals(spellSlotLevels);
  if (!limits) return totals;

  if (limits.pactSlots && limits.pactSlotLevel) {
    totals[limits.pactSlotLevel] = limits.pactSlots;
    return totals;
  }

  return getSpellSlotTotalsFromSlotsArray(limits.slots, spellSlotLevels);
}

export function getSpellcastingContribution(level, progression) {
  const classLevel = clampInt(level, 0, 20);
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

function defaultLabelFromSlug(value) {
  return String(value || "")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
