import { DuelSession } from "@/lib/types";

export const FRIEND_DUEL_TEMPLATE = {
  title: "好友 60 秒对战",
  description: "同一段文本，60 秒内看谁又快又稳。点开链接后直接进入浏览器训练。",
  content:
    "asdf jkl asdf jkl fj fj dk dk sl sl and the rhythm stays steady while focus keeps every key clean typing with calm hands makes every second count in this friend duel",
  goalAccuracy: 96,
  goalWpm: 36,
  timeLimitSeconds: 60
};

export function buildDuelIntro(session: DuelSession) {
  return `${session.challengerName} 向 ${session.opponentName} 发起了好友对战`;
}
