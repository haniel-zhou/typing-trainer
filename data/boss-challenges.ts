import { BossChallengeData, SeasonLeaderboardEntry } from "@/lib/types";

export const BOSS_CHALLENGES: BossChallengeData[] = [
  {
    id: "boss-echo-falcon",
    bossName: "回声猎隼",
    title: "Boss 1：回声猎隼",
    description: "高频短词和快速折返混在一起，专门考你的稳态节奏和回指准确率。",
    difficulty: "normal",
    reward: "+160 XP / +80 金币",
    badgeReward: "猎隼徽章",
    goal: "目标 52 WPM / 96%",
    goalAccuracy: 96,
    goalWpm: 52,
    timeLimit: "01:10",
    timeLimitSeconds: 70,
    seasonRewardPoints: 48,
    accent: "from-sky-500 via-cyan-400 to-emerald-300",
    content:
      "flow frame flick focus flame field fast fold flare focus clean form finger follow focus fast lane laser logic launch light line flex force frame focus",
  },
  {
    id: "boss-neon-titan",
    bossName: "霓虹泰坦",
    title: "Boss 2：霓虹泰坦",
    description: "长词和短词交替出现，要求你在连续输出里保持手型不散。",
    difficulty: "hard",
    reward: "+220 XP / +120 金币",
    badgeReward: "泰坦徽章",
    goal: "目标 60 WPM / 97%",
    goalAccuracy: 97,
    goalWpm: 60,
    timeLimit: "01:25",
    timeLimitSeconds: 85,
    seasonRewardPoints: 64,
    accent: "from-fuchsia-500 via-violet-500 to-sky-400",
    content:
      "momentum method mission mirror matrix rhythm rocket memory motion steady signal system secure structure shadow switch steady signal modern rhythm",
  },
  {
    id: "boss-obsidian-core",
    bossName: "黑曜核心",
    title: "Boss 3：黑曜核心",
    description: "终局 Boss。文本更长、节奏更密，要求速度和稳定度同时在线。",
    difficulty: "extreme",
    reward: "+320 XP / +180 金币",
    badgeReward: "核心王冠",
    goal: "目标 68 WPM / 98%",
    goalAccuracy: 98,
    goalWpm: 68,
    timeLimit: "01:40",
    timeLimitSeconds: 100,
    seasonRewardPoints: 88,
    accent: "from-slate-900 via-indigo-700 to-cyan-500",
    content:
      "control cadence memory focus pattern velocity balance return center control cadence steady pressure keeps the rhythm alive and every clean strike turns pressure into momentum and momentum into mastery",
  }
];

export const SEASON_FRIENDS_LEADERBOARD: SeasonLeaderboardEntry[] = [
  { id: "sf1", name: "Mia", seasonPoints: 286, bestWpm: 63, totalSessions: 18, title: "黄金 III", highlight: "任务全勤" },
  { id: "sf2", name: "Leo", seasonPoints: 248, bestWpm: 58, totalSessions: 15, title: "白银 I", highlight: "Boss 首杀" },
  { id: "sf3", name: "Ava", seasonPoints: 231, bestWpm: 55, totalSessions: 13, title: "白银 I", highlight: "准确率稳定" }
];

export const SEASON_GLOBAL_LEADERBOARD: SeasonLeaderboardEntry[] = [
  { id: "sg1", name: "PixelFox", seasonPoints: 648, bestWpm: 109, totalSessions: 52, title: "大师", highlight: "全球冲榜" },
  { id: "sg2", name: "Kana", seasonPoints: 612, bestWpm: 103, totalSessions: 47, title: "大师", highlight: "Boss 三连过" },
  { id: "sg3", name: "Rohan", seasonPoints: 588, bestWpm: 101, totalSessions: 44, title: "铂金 I", highlight: "对战强势" }
];

export function getBossChallengeById(id?: string) {
  return BOSS_CHALLENGES.find((item) => item.id === id);
}
