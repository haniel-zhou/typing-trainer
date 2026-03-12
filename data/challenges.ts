import { ChallengeCardData, LeaderboardEntry } from "@/lib/types";

export const FRIENDS_LEADERBOARD: LeaderboardEntry[] = [
  { id: "f1", name: "Mia", country: "CN", wpm: 62, accuracy: 98, streak: 18, badge: "稳定王" },
  { id: "f2", name: "Leo", country: "SG", wpm: 58, accuracy: 97, streak: 9, badge: "节奏感" },
  { id: "f3", name: "Ava", country: "JP", wpm: 54, accuracy: 99, streak: 14, badge: "零失误" },
  { id: "f4", name: "Noah", country: "CN", wpm: 51, accuracy: 96, streak: 7, badge: "闯关快手" }
];

export const GLOBAL_LEADERBOARD: LeaderboardEntry[] = [
  { id: "g1", name: "PixelFox", country: "US", wpm: 109, accuracy: 99, streak: 42, badge: "世界级" },
  { id: "g2", name: "Kana", country: "JP", wpm: 103, accuracy: 98, streak: 36, badge: "超稳输出" },
  { id: "g3", name: "Rohan", country: "IN", wpm: 101, accuracy: 97, streak: 31, badge: "限时赛王者" },
  { id: "g4", name: "Luna", country: "BR", wpm: 98, accuracy: 99, streak: 28, badge: "极限专注" },
  { id: "g5", name: "Theo", country: "DE", wpm: 94, accuracy: 98, streak: 22, badge: "冲榜玩家" }
];

export const CHALLENGES: ChallengeCardData[] = [
  {
    id: "c1",
    title: "60 秒极速赛",
    description: "在 1 分钟内尽可能多地完成正确输入，优先守住节奏和准确率。",
    reward: "+120 XP",
    goal: "目标 45 WPM / 96%",
    timeLimit: "01:00",
    goalAccuracy: 96,
    goalWpm: 45,
    timeLimitSeconds: 60,
    accent: "from-sky-500 to-cyan-400",
    content:
      "asdf jkl asdf jkl fj fj dk dk sl sl asdf jkl and the skill grows with rhythm and calm focus asdf jkl asdf jkl fj fj dk dk sl sl typing with balance makes every move cleaner and faster"
  },
  {
    id: "c2",
    title: "三连关挑战",
    description: "连续完成 3 关训练，中间不重开。适合建立连击手感和专注力。",
    reward: "限定徽章",
    goal: "目标 3 关全过",
    timeLimit: "03:30",
    goalAccuracy: 94,
    goalWpm: 24,
    timeLimitSeconds: 210,
    accent: "from-amber-400 to-yellow-300",
    content:
      "asdf jkl asdf jkl fj fj dk dk sl sl skill and speed stay calm and steady the home row keeps my hands relaxed and clean this is my first typing lesson and i will keep going every day typing slowly and correctly will help me become faster later"
  },
  {
    id: "c3",
    title: "零失误练习",
    description: "把速度放在第二位，只用最稳的节奏冲一次 100% 正确率。",
    reward: "+80 XP",
    goal: "目标 100% 准确率",
    timeLimit: "不限时",
    goalAccuracy: 100,
    goalWpm: 18,
    accent: "from-emerald-400 to-teal-400",
    content:
      "f j d k s l a a s d f j k l slow and steady hands return to home row every time and accuracy leads the whole round"
  }
];

export function getChallengeById(id?: string) {
  return CHALLENGES.find((item) => item.id === id);
}
