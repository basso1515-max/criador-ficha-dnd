let communityStatsModulePromise = null;

function loadCommunityStatsModule() {
  if (!communityStatsModulePromise) {
    communityStatsModulePromise = import("../src/shared/community-stats.js");
  }
  return communityStatsModulePromise;
}

export async function recordCommunityCharacterCreated(redis, character, date = new Date()) {
  const {
    COMMUNITY_STATS_MONTH_TTL_SECONDS,
    buildCommunityAnalyticsPayload,
    extractCommunityStatsEvent,
    getCommunityStatsKeys,
  } = await loadCommunityStatsModule();
  const event = extractCommunityStatsEvent(character, date);
  if (!event) return null;

  const keys = getCommunityStatsKeys(event.month);
  const monthKeys = [
    keys.monthTotal,
    keys.editionsMonth,
    keys.classesMonth,
    keys.spellsMonth,
    keys.weaponsMonth,
  ];

  const operations = [
    redis.incr(keys.total),
    redis.incr(keys.monthTotal),
    redis.set(keys.updatedAt, event.createdAt),
    redis.hincrby(keys.editionsAll, event.edition, 1),
    redis.hincrby(keys.editionsMonth, event.edition, 1),
  ];

  if (event.classId) {
    const classKey = `${event.edition}:${event.classId}`;
    operations.push(
      redis.hincrby(keys.classesAll, classKey, 1),
      redis.hincrby(keys.classesMonth, classKey, 1),
    );
  }

  event.spellIds.forEach((spellId) => {
    operations.push(
      redis.hincrby(keys.spellsAll, spellId, 1),
      redis.hincrby(keys.spellsMonth, spellId, 1),
    );
  });

  event.startingWeaponIds.forEach((weaponId) => {
    operations.push(
      redis.hincrby(keys.weaponsAll, weaponId, 1),
      redis.hincrby(keys.weaponsMonth, weaponId, 1),
    );
  });

  await Promise.all(operations);
  await Promise.all(monthKeys.map((key) => redis.expire(key, COMMUNITY_STATS_MONTH_TTL_SECONDS)));
  return buildCommunityAnalyticsPayload(event);
}

export async function readCommunityStats(redis, date = new Date()) {
  const {
    buildCommunityStatsResponse,
    getCommunityStatsKeys,
    getCommunityStatsMonth,
    normalizeCounterMap,
  } = await loadCommunityStatsModule();
  const month = getCommunityStatsMonth(date);
  const keys = getCommunityStatsKeys(month);
  const [
    total,
    monthTotal,
    updatedAt,
    editionsAll,
    editionsMonth,
    classesAll,
    classesMonth,
    spellsAll,
    spellsMonth,
    weaponsAll,
    weaponsMonth,
  ] = await Promise.all([
    redis.get(keys.total),
    redis.get(keys.monthTotal),
    redis.get(keys.updatedAt),
    redis.hgetall(keys.editionsAll),
    redis.hgetall(keys.editionsMonth),
    redis.hgetall(keys.classesAll),
    redis.hgetall(keys.classesMonth),
    redis.hgetall(keys.spellsAll),
    redis.hgetall(keys.spellsMonth),
    redis.hgetall(keys.weaponsAll),
    redis.hgetall(keys.weaponsMonth),
  ]);

  return buildCommunityStatsResponse({
    month,
    total,
    monthTotal,
    updatedAt,
    editionsAll: normalizeCounterMap(editionsAll),
    editionsMonth: normalizeCounterMap(editionsMonth),
    classesAll: normalizeCounterMap(classesAll),
    classesMonth: normalizeCounterMap(classesMonth),
    spellsAll: normalizeCounterMap(spellsAll),
    spellsMonth: normalizeCounterMap(spellsMonth),
    weaponsAll: normalizeCounterMap(weaponsAll),
    weaponsMonth: normalizeCounterMap(weaponsMonth),
  }, date);
}
