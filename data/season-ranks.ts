import { SeasonRank } from "@/lib/types";

export const SEASON_RANKS: SeasonRank[] = [
  {
    id: "bronze",
    title: "青铜学徒",
    minPoints: 0,
    maxPoints: 119,
    accent: "from-orange-500 to-amber-400",
    summary: "先建立稳定训练习惯，完成基础挑战。"
  },
  {
    id: "silver",
    title: "白银冲刺",
    minPoints: 120,
    maxPoints: 279,
    accent: "from-slate-500 to-slate-300",
    summary: "速度和准确率开始稳定，可以逐步冲榜。"
  },
  {
    id: "gold",
    title: "黄金输出",
    minPoints: 280,
    maxPoints: 479,
    accent: "from-amber-500 to-yellow-300",
    summary: "你已经进入稳定输出阶段，适合长期挑战。"
  },
  {
    id: "platinum",
    title: "铂金节奏",
    minPoints: 480,
    maxPoints: 739,
    accent: "from-cyan-500 to-sky-400",
    summary: "节奏、连击和准确率都已经形成产品级体验。"
  },
  {
    id: "master",
    title: "王者段位",
    minPoints: 740,
    accent: "from-fuchsia-500 to-violet-400",
    summary: "你已经能把日常训练打成竞争玩法。"
  }
];
