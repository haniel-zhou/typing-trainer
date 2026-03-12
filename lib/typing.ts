import {
  AchievementBadge,
  AchievementUnlock,
  AppProgress,
  DailyMission,
  DailyMissionState,
  ErrorAnalysis,
  ErrorHotspot,
  SeasonRank,
  TypingSuggestion,
  TrainingRecord
} from "@/lib/types";
import { BOSS_CHALLENGES } from "@/data/boss-challenges";
import { SEASON_RANKS } from "@/data/season-ranks";

const KEY_NEIGHBORS: Record<string, string[]> = {
  a: ["q", "w", "s", "z"],
  b: ["v", "g", "h", "n"],
  c: ["x", "d", "f", "v"],
  d: ["e", "r", "s", "f", "c", "x"],
  e: ["w", "s", "d", "r"],
  f: ["r", "t", "d", "g", "v", "c"],
  g: ["t", "y", "f", "h", "b", "v"],
  h: ["y", "u", "g", "j", "n", "b"],
  i: ["u", "j", "k", "o"],
  j: ["u", "i", "h", "k", "m", "n"],
  k: ["i", "o", "j", "l", ",", "m"],
  l: ["o", "p", "k", ";", "."],
  m: ["n", "j", "k", ","],
  n: ["b", "h", "j", "m"],
  o: ["i", "k", "l", "p"],
  p: ["o", "l", ";"],
  q: ["w", "a"],
  r: ["e", "d", "f", "t"],
  s: ["w", "e", "a", "d", "x", "z"],
  t: ["r", "f", "g", "y"],
  u: ["y", "h", "j", "i"],
  v: ["c", "f", "g", "b"],
  w: ["q", "a", "s", "e"],
  x: ["z", "s", "d", "c"],
  y: ["t", "g", "h", "u"],
  z: ["a", "s", "x"],
  ",": ["m", "k", "l", "."],
  ".": [",", "l", ";", "/"],
  ";": ["l", "p", ".", "/"],
  "/": [".", ";"]
};

export function calculateWPM(correctChars: number, seconds: number): number {
  if (seconds <= 0) return 0;
  return Math.round((correctChars / 5) / (seconds / 60));
}

export function countCorrectChars(input: string, target: string): number {
  let count = 0;
  for (let i = 0; i < input.length; i += 1) {
    if (input[i] === target[i]) count += 1;
  }
  return count;
}

export function countWrongChars(input: string, target: string): number {
  let count = 0;
  for (let i = 0; i < input.length; i += 1) {
    if (input[i] !== target[i]) count += 1;
  }
  return count;
}

export function calculateAccuracy(input: string, target: string): number {
  if (!input.length) return 100;
  const correct = countCorrectChars(input, target);
  return Math.round((correct / input.length) * 100);
}

export function calculateStars(
  accuracy: number,
  wpm: number,
  goalAccuracy: number,
  goalWpm: number
): number {
  let stars = 1;
  if (accuracy >= goalAccuracy) stars = 2;
  if (accuracy >= goalAccuracy && wpm >= goalWpm) stars = 3;
  return stars;
}

export function calculateXp(wpm: number, combo: number, stars: number): number {
  return 20 + wpm + combo + stars * 10;
}

export function calculateCoins(wpm: number, accuracy: number, stars: number): number {
  return Math.max(12, Math.round(wpm * 0.6 + accuracy * 0.15 + stars * 8));
}

export function calculateSeasonPoints(
  mode: TrainingRecord["mode"] | "lesson" | "custom" | "challenge" | "duel" | "boss",
  stars: number,
  accuracy: number,
  wpm: number
) {
  if (mode === "challenge") {
    return Math.max(16, Math.round(stars * 7 + wpm * 0.35 + accuracy * 0.08));
  }
  if (mode === "duel") {
    return Math.max(18, Math.round(stars * 8 + wpm * 0.4 + accuracy * 0.1));
  }
  if (mode === "boss") {
    return Math.max(28, Math.round(stars * 12 + wpm * 0.45 + accuracy * 0.12));
  }
  return 0;
}

export function getHighlightedIndex(input: string): number {
  return input.length;
}

export function formatTarget(target: string): string[] {
  return target.split("");
}

export function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function updateStreak(lastPracticeDate: string | null, currentStreak: number): number {
  const today = getTodayDateString();
  if (!lastPracticeDate) return 1;

  const prev = new Date(lastPracticeDate);
  const now = new Date(today);
  const diff = Math.round((now.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));

  if (diff === 0) return currentStreak;
  if (diff === 1) return currentStreak + 1;
  return 1;
}

function normalizeKeyLabel(char: string) {
  if (!char || char === " ") return "空格";
  return char.toUpperCase();
}

function isAdjacentKey(actual: string, expected: string) {
  if (!actual || !expected) return false;
  const actualKey = actual.toLowerCase();
  const expectedKey = expected.toLowerCase();
  return KEY_NEIGHBORS[expectedKey]?.includes(actualKey) ?? false;
}

function uniqueTerms(terms: string[]) {
  return Array.from(new Set(terms.map((item) => item.trim()).filter(Boolean)));
}

export function parseTermsInput(raw: string): string[] {
  return uniqueTerms(raw.split(/[\n,，;；、\t]+/));
}

export function buildPracticeTextFromTerms(terms: string[]) {
  const cleanTerms = uniqueTerms(terms);
  if (cleanTerms.length === 0) return "";
  const firstWave = cleanTerms.slice(0, 8);
  const secondWave = cleanTerms.slice(0, 4).reverse();
  const grouped = [
    firstWave.join(" "),
    cleanTerms.map((item) => `${item} ${item}`).slice(0, 6).join(" "),
    [...firstWave.slice(0, 4), ...secondWave].join(" "),
    cleanTerms.join(" ")
  ];

  return grouped.join(" ");
}

export function getAutocompleteSuggestion(input: string, target: string): TypingSuggestion | null {
  if (!input || input.length >= target.length) return null;
  if (target.slice(0, input.length) !== input) return null;

  const remaining = target.slice(input.length);
  if (!remaining.trim()) return null;

  const trimmedRemaining = remaining.trimStart();
  const hasLeadingSpace = remaining.length !== trimmedRemaining.length;
  const words = trimmedRemaining.split(/\s+/).filter(Boolean);
  if (words.length === 0) return null;

  if (hasLeadingSpace && words.length >= 2) {
    const phrase = `${remaining.startsWith(" ") ? " " : ""}${words[0]} ${words[1]}${
      trimmedRemaining.includes("  ") ? "" : " "
    }`;
    return {
      completion: phrase,
      preview: phrase.trim(),
      kind: "phrase",
      savedKeystrokes: phrase.length
    };
  }

  const firstWord = words[0];
  const nextBoundary = remaining.search(/\s/);
  const completion = nextBoundary === -1 ? firstWord : remaining.slice(0, nextBoundary + 1);

  if (completion.trim().length < 2) return null;

  return {
    completion,
    preview: completion.trim(),
    kind: "word",
    savedKeystrokes: completion.length
  };
}

export function analyzeTypingErrors(input: string, target: string): ErrorAnalysis {
  let fingerDriftMistakes = 0;
  let transposeMistakes = 0;
  let caseMistakes = 0;
  let spaceMistakes = 0;
  let repeatMistakes = 0;
  let substitutionMistakes = 0;
  let totalMistakes = 0;
  const hotspots = new Map<string, number>();

  for (let index = 0; index < Math.max(input.length, target.length); index += 1) {
    const actual = input[index] ?? "";
    const expected = target[index] ?? "";

    if (actual === expected) continue;

    totalMistakes += 1;
    const hotspotKey = normalizeKeyLabel(expected || actual);
    hotspots.set(hotspotKey, (hotspots.get(hotspotKey) ?? 0) + 1);

    const nextActual = input[index + 1] ?? "";
    const nextExpected = target[index + 1] ?? "";

    if (actual && nextActual && expected && nextExpected && actual === nextExpected && nextActual === expected) {
      transposeMistakes += 1;
      index += 1;
      continue;
    }

    if (actual && expected && actual.toLowerCase() === expected.toLowerCase() && actual !== expected) {
      caseMistakes += 1;
      continue;
    }

    if (actual === " " || expected === " ") {
      spaceMistakes += 1;
      continue;
    }

    if (actual && index > 0 && input[index - 1] === actual && actual !== expected) {
      repeatMistakes += 1;
      continue;
    }

    if (isAdjacentKey(actual, expected)) {
      fingerDriftMistakes += 1;
      continue;
    }

    substitutionMistakes += 1;
  }

  const hotspotList: ErrorHotspot[] = Array.from(hotspots.entries())
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const tips: string[] = [];

  if (fingerDriftMistakes > 0) {
    tips.push("错误主要来自相邻键位偏移。每次击键后先回基准键，再去找下一个字母。");
  }
  if (spaceMistakes > 0) {
    tips.push("空格节奏有点乱。把拇指动作放慢半拍，单词结束后再按空格。");
  }
  if (transposeMistakes > 0) {
    tips.push("有字母顺序颠倒，说明你在抢下一个键。先盯住当前高亮字符，不要提前跳。");
  }
  if (repeatMistakes > 0) {
    tips.push("重复击键偏多。落键后手指马上放松，不要把同一个键压得太久。");
  }
  if (caseMistakes > 0) {
    tips.push("大小写切换不稳。遇到大写前先确认 Shift，再开始下一组输入。");
  }
  if (substitutionMistakes > 0 && hotspotList[0]) {
    tips.push(`最常错的是 ${hotspotList[0].key}。下一轮先把这个键的出手节奏放慢一点。`);
  }
  if (tips.length === 0) {
    tips.push("这一轮基本没有明显错误，继续保持当前节奏就行。");
  }

  return {
    totalMistakes,
    fingerDriftMistakes,
    transposeMistakes,
    caseMistakes,
    spaceMistakes,
    repeatMistakes,
    substitutionMistakes,
    hotspots: hotspotList,
    tips: tips.slice(0, 3)
  };
}

export function aggregateErrorHotspots(records: TrainingRecord[]) {
  const buckets = new Map<string, number>();

  records.forEach((record) => {
    record.errorAnalysis?.hotspots.forEach((item) => {
      buckets.set(item.key, (buckets.get(item.key) ?? 0) + item.count);
    });
  });

  return Array.from(buckets.entries())
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

export function claimDailyCheckIn(progress: AppProgress) {
  const today = getTodayDateString();
  if (progress.lastCheckInDate === today) {
    return {
      claimed: false,
      rewardXp: 0,
      rewardCoins: 0,
      progress
    };
  }

  const rewardXp = 18;
  const rewardCoins = 25;
  const nextXp = progress.xp + rewardXp;

  return {
    claimed: true,
    rewardXp,
    rewardCoins,
    progress: {
      ...progress,
      xp: nextXp,
      level: Math.floor(nextXp / 100) + 1,
      coins: progress.coins + rewardCoins,
      totalCheckIns: progress.totalCheckIns + 1,
      lastCheckInDate: today,
      seasonPoints: progress.seasonPoints
    }
  };
}

function resolveRecordDate(record: TrainingRecord) {
  const fromId = Number(record.id);
  if (Number.isFinite(fromId)) {
    const byId = new Date(fromId);
    if (!Number.isNaN(byId.getTime())) return byId;
  }

  const byCreated = new Date(record.createdAt);
  if (!Number.isNaN(byCreated.getTime())) return byCreated;
  return null;
}

function sameLocalDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export function buildDailyMissions(
  records: TrainingRecord[],
  missionState: DailyMissionState,
  date = new Date()
): DailyMission[] {
  const todayRecords = records.filter((record) => {
    const resolved = resolveRecordDate(record);
    return resolved ? sameLocalDay(resolved, date) : false;
  });

  const practiceSessions = todayRecords.length;
  const precisionSessions = todayRecords.filter((record) => record.accuracy >= 96).length;
  const challengeSessions = todayRecords.filter(
    (record) =>
      record.mode === "challenge" || record.mode === "duel" || record.mode === "boss" || record.stars >= 3
  ).length;

  const claimedIds = missionState.date === getTodayDateString() ? missionState.claimedMissionIds : [];

  return [
    {
      id: "daily-practice",
      title: "完成 2 次训练",
      description: "先把今天的练习打开两次，建立每日回访习惯。",
      progress: Math.min(practiceSessions, 2),
      goal: 2,
      rewardXp: 24,
      rewardCoins: 20,
      completed: practiceSessions >= 2,
      claimed: claimedIds.includes("daily-practice")
    },
    {
      id: "daily-accuracy",
      title: "打一轮 96% 正确率",
      description: "先守住准确率，让今天的手感稳定下来。",
      progress: Math.min(precisionSessions, 1),
      goal: 1,
      rewardXp: 28,
      rewardCoins: 24,
      completed: precisionSessions >= 1,
      claimed: claimedIds.includes("daily-accuracy")
    },
    {
      id: "daily-challenge",
      title: "完成 1 次三星或挑战",
      description: "通过挑战、对战或三星成绩拉高当天成就感。",
      progress: Math.min(challengeSessions, 1),
      goal: 1,
      rewardXp: 34,
      rewardCoins: 30,
      completed: challengeSessions >= 1,
      claimed: claimedIds.includes("daily-challenge")
    }
  ];
}

export function claimDailyMissionReward(
  progress: AppProgress,
  mission: DailyMission,
  missionState: DailyMissionState
) {
  if (!mission.completed || mission.claimed) {
    return { progress, missionState, claimed: false };
  }

  const nextXp = progress.xp + mission.rewardXp;
  const nextClaimed = Array.from(new Set([...missionState.claimedMissionIds, mission.id]));

  return {
    claimed: true,
    progress: {
      ...progress,
      xp: nextXp,
      level: Math.floor(nextXp / 100) + 1,
      coins: progress.coins + mission.rewardCoins
    },
    missionState: {
      date: getTodayDateString(),
      claimedMissionIds: nextClaimed
    }
  };
}

export function getSeasonRank(points: number): SeasonRank {
  const matched =
    [...SEASON_RANKS]
      .reverse()
      .find((rank) => points >= rank.minPoints && (rank.maxPoints === undefined || points <= rank.maxPoints)) ??
    SEASON_RANKS[0];

  return matched;
}

export function getSeasonProgress(points: number) {
  const current = getSeasonRank(points);
  const next = SEASON_RANKS.find((rank) => rank.minPoints > points);

  if (!next) {
    return { current, next: null, progress: 100, pointsToNext: 0 };
  }

  const range = next.minPoints - current.minPoints;
  const gained = points - current.minPoints;
  return {
    current,
    next,
    progress: Math.max(0, Math.min(100, Math.round((gained / range) * 100))),
    pointsToNext: next.minPoints - points
  };
}

export function buildAchievementBadges(records: TrainingRecord[], progress: AppProgress): AchievementBadge[] {
  const bestWpm = records.length ? Math.max(...records.map((record) => record.wpm)) : 0;
  const bestAccuracy = records.length ? Math.max(...records.map((record) => record.accuracy)) : 0;
  const totalDuration = records.reduce((sum, record) => sum + record.duration, 0);
  const perfectSessions = records.filter((record) => record.stars >= 3).length;
  const clearedBossIds = new Set(
    records
      .filter((record) => record.mode === "boss")
      .filter((record) => {
        const boss = BOSS_CHALLENGES.find((item) => item.id === record.challengeId);
        return boss ? record.wpm >= boss.goalWpm && record.accuracy >= boss.goalAccuracy : false;
      })
      .map((record) => record.challengeId ?? "")
      .filter(Boolean)
  );

  const badges: AchievementBadge[] = [
    {
      id: "first-steps",
      title: "稳定起步",
      description: "累计完成 5 次训练，形成第一波练习习惯。",
      tier: "bronze",
      progress: Math.min(records.length, 5),
      goal: 5,
      unlocked: records.length >= 5,
      metricLabel: "训练次数"
    },
    {
      id: "speed-runner",
      title: "加速中",
      description: "把历史最高速度推到 40 WPM。",
      tier: "silver",
      progress: Math.min(bestWpm, 40),
      goal: 40,
      unlocked: bestWpm >= 40,
      metricLabel: "最高 WPM"
    },
    {
      id: "precision-core",
      title: "精准核心",
      description: "把历史最高正确率打到 98%。",
      tier: "silver",
      progress: Math.min(bestAccuracy, 98),
      goal: 98,
      unlocked: bestAccuracy >= 98,
      metricLabel: "正确率"
    },
    {
      id: "streak-master",
      title: "连续打卡王",
      description: "连续训练 7 天，让练习变成稳定习惯。",
      tier: "gold",
      progress: Math.min(progress.streak, 7),
      goal: 7,
      unlocked: progress.streak >= 7,
      metricLabel: "连续天数"
    },
    {
      id: "boss-clear",
      title: "三星彩蛋",
      description: "拿下 8 次三星成绩，说明准确率和速度都已稳定。",
      tier: "gold",
      progress: Math.min(perfectSessions, 8),
      goal: 8,
      unlocked: perfectSessions >= 8,
      metricLabel: "三星次数"
    },
    {
      id: "endurance-builder",
      title: "耐力构建",
      description: "累计练习 60 分钟，让肌肉记忆真正形成。",
      tier: "bronze",
      progress: Math.min(Math.round(totalDuration / 60), 60),
      goal: 60,
      unlocked: totalDuration >= 60 * 60,
      metricLabel: "累计分钟"
    },
    {
      id: "boss-first-blood",
      title: "Boss 初见杀",
      description: "击败任意 1 个 Boss，拿到第一枚高难度徽章。",
      tier: "silver",
      progress: Math.min(clearedBossIds.size, 1),
      goal: 1,
      unlocked: clearedBossIds.size >= 1,
      metricLabel: "Boss 数"
    },
    {
      id: "boss-hunter",
      title: "Boss 狩猎者",
      description: "击败全部 3 个 Boss，完成当前赛季的核心挑战线。",
      tier: "gold",
      progress: Math.min(clearedBossIds.size, BOSS_CHALLENGES.length),
      goal: BOSS_CHALLENGES.length,
      unlocked: clearedBossIds.size >= BOSS_CHALLENGES.length,
      metricLabel: "Boss 数"
    }
  ];

  return badges;
}

export function mergeAchievementBadges(
  badges: AchievementBadge[],
  unlockedItems: AchievementUnlock[]
) {
  const unlockedMap = new Map(unlockedItems.map((item) => [item.id, item]));

  return badges.map((badge) => {
    const cloudBadge = unlockedMap.get(badge.id);
    if (!cloudBadge) return badge;

    return {
      ...badge,
      unlocked: true,
      progress: badge.goal,
      title: cloudBadge.title || badge.title,
      description: cloudBadge.description || badge.description,
      tier: cloudBadge.tier || badge.tier,
      metricLabel: cloudBadge.metricLabel || badge.metricLabel
    };
  });
}
