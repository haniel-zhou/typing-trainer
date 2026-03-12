export type Lesson = {
  id: number;
  title: string;
  description: string;
  content: string;
  goalAccuracy: number;
  goalWpm: number;
};

export type ErrorHotspot = {
  key: string;
  count: number;
};

export type ErrorAnalysis = {
  totalMistakes: number;
  fingerDriftMistakes: number;
  transposeMistakes: number;
  caseMistakes: number;
  spaceMistakes: number;
  repeatMistakes: number;
  substitutionMistakes: number;
  hotspots: ErrorHotspot[];
  tips: string[];
};

export type TrainingRecord = {
  id: string;
  lessonId?: number;
  challengeId?: string;
  duelId?: string;
  title: string;
  mode: "lesson" | "custom" | "challenge" | "duel" | "boss";
  accuracy: number;
  wpm: number;
  duration: number;
  correctChars: number;
  wrongChars: number;
  xpGained: number;
  stars: number;
  errorAnalysis?: ErrorAnalysis;
  createdAt: string;
};

export type AppProgress = {
  level: number;
  xp: number;
  streak: number;
  lastPracticeDate: string | null;
  totalCheckIns: number;
  coins: number;
  lastCheckInDate: string | null;
  seasonPoints: number;
};

export type CustomExercise = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

export type WordBankPreset = {
  id: string;
  title: string;
  description: string;
  category: "programming" | "medical" | "business" | "daily";
  terms: string[];
  accent: string;
};

export type PersonalWordBank = {
  id: string;
  title: string;
  category: "programming" | "medical" | "business" | "daily" | "custom";
  terms: string[];
  createdAt: string;
  source: "preset" | "manual" | "imported";
};

export type LeaderboardEntry = {
  id: string;
  name: string;
  country: string;
  wpm: number;
  accuracy: number;
  streak: number;
  badge: string;
};

export type ChallengeCardData = {
  id: string;
  title: string;
  description: string;
  reward: string;
  goal: string;
  timeLimit: string;
  goalAccuracy: number;
  goalWpm: number;
  timeLimitSeconds?: number;
  content: string;
  accent: string;
};

export type BossChallengeData = {
  id: string;
  bossName: string;
  title: string;
  description: string;
  difficulty: "normal" | "hard" | "extreme";
  reward: string;
  badgeReward: string;
  goal: string;
  goalAccuracy: number;
  goalWpm: number;
  timeLimit: string;
  timeLimitSeconds: number;
  seasonRewardPoints: number;
  content: string;
  accent: string;
};

export type RhythmPreset = {
  id: string;
  name: string;
  bpm: number;
  mood: string;
  rootHz: number;
  kickPattern: string;
  snarePattern: string;
  hatPattern: string;
  bassline: number[];
  leadline: Array<number | null>;
};

export type RhythmSettings = {
  uploadedTrackId?: string;
  volume: number;
  musicEnabled: boolean;
  sfxEnabled: boolean;
};

export type TrainerViewSettings = {
  theme: "default" | "eye-care" | "night";
  smartAssistEnabled: boolean;
};

export type TypingSuggestion = {
  completion: string;
  preview: string;
  kind: "word" | "phrase";
  savedKeystrokes: number;
};

export type UploadedTrack = {
  id: string;
  name: string;
  bpm: number;
  duration: number;
  createdAt: string;
  type: string;
  size: number;
};

export type ExternalTrack = {
  id: string;
  provider: "apple-music";
  url: string;
  title: string;
  artist: string;
  album?: string;
  createdAt: string;
};

export type ShareChannel = "wechat" | "qq" | "browser" | "manual";

export type FriendProfile = {
  id: string;
  name: string;
  shareCode: string;
  updatedAt: string;
};

export type FriendLink = {
  id: string;
  name: string;
  shareCode: string;
  source: ShareChannel;
  joinedAt: string;
  inviteUrl: string;
};

export type FriendSnapshot = {
  shareCode: string;
  name: string;
  bestWpm: number;
  bestAccuracy: number;
  averageWpm: number;
  totalDuration: number;
  totalSessions: number;
  seasonPoints: number;
  coins: number;
  totalCheckIns: number;
  achievements: AchievementUnlock[];
  recentRecords: TrainingRecord[];
};

export type DuelSession = {
  id: string;
  title: string;
  description: string;
  content: string;
  goalAccuracy: number;
  goalWpm: number;
  timeLimitSeconds: number;
  challengerShareCode: string;
  challengerName: string;
  opponentShareCode: string;
  opponentName: string;
  createdAt: string;
};

export type DuelAttempt = {
  id: string;
  duelId: string;
  shareCode: string;
  name: string;
  accuracy: number;
  wpm: number;
  duration: number;
  correctChars: number;
  wrongChars: number;
  createdAt: string;
};

export type AchievementBadge = {
  id: string;
  title: string;
  description: string;
  tier: "bronze" | "silver" | "gold";
  progress: number;
  goal: number;
  unlocked: boolean;
  metricLabel: string;
};

export type AchievementUnlock = {
  id: string;
  title: string;
  description: string;
  tier: "bronze" | "silver" | "gold";
  metricLabel: string;
  unlockedAt: string;
};

export type ProductCapabilitySection = {
  id: string;
  title: string;
  description: string;
  items: Array<{
    title: string;
    detail: string;
    status: "ready" | "building" | "planned";
  }>;
};

export type ProductPageNode = {
  id: string;
  title: string;
  goal: string;
  modules: string[];
  route: string;
};

export type DatabaseTableSpec = {
  name: string;
  purpose: string;
  stage: "online" | "next";
  fields: string[];
};

export type GrowthLayer = {
  id: string;
  title: string;
  summary: string;
  loops: string[];
};

export type GameMechanic = {
  id: string;
  title: string;
  summary: string;
  rewards: string[];
};

export type DailyMission = {
  id: string;
  title: string;
  description: string;
  progress: number;
  goal: number;
  rewardXp: number;
  rewardCoins: number;
  completed: boolean;
  claimed: boolean;
};

export type DailyMissionState = {
  date: string;
  claimedMissionIds: string[];
};

export type SeasonRank = {
  id: string;
  title: string;
  minPoints: number;
  maxPoints?: number;
  accent: string;
  summary: string;
};

export type SeasonLeaderboardEntry = {
  id: string;
  name: string;
  seasonPoints: number;
  bestWpm: number;
  totalSessions: number;
  title: string;
  highlight: string;
};

export type ShareRecord = {
  id: string;
  kind: "profile" | "season" | "duel";
  title: string;
  shareUrl: string;
  action: "share" | "copy" | "download" | "download-poster";
  createdAt: string;
};

export type VoiceCommandAction =
  | "pause"
  | "resume"
  | "reset"
  | "exit"
  | "theme-default"
  | "theme-eye-care"
  | "theme-night"
  | "accept-suggestion";

export type VoiceIntent =
  | {
      kind: "route";
      label: string;
      confidence: number;
      route: string;
    }
  | {
      kind: "trainer";
      label: string;
      confidence: number;
      action: VoiceCommandAction;
    }
  | {
      kind: "unknown";
      label: string;
      confidence: number;
    };

export type ProductRoadmapMilestone = {
  id: string;
  stage: string;
  title: string;
  summary: string;
  status: "online" | "next" | "vision";
  items: string[];
};
