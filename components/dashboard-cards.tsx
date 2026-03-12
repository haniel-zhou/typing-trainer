import { Flame, Rocket, Star, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type Props = {
  level: number;
  xp: number;
  streak: number;
  bestWpm: number;
  coins?: number;
};

export function DashboardCards({ level, xp, streak, bestWpm, coins = 0 }: Props) {
  const levelProgress = xp % 100;
  const items = [
    {
      label: "当前等级",
      value: `Lv.${level}`,
      hint: `距离 Lv.${level + 1} 还差 ${100 - levelProgress} XP`,
      progress: levelProgress,
      icon: Rocket
    },
    {
      label: "总经验",
      value: `${xp}`,
      hint: "每次完成训练都会获得经验",
      progress: Math.min(100, Math.round(((xp % 300) / 300) * 100)),
      icon: Star
    },
    {
      label: "连续训练",
      value: `${streak} 天`,
      hint: streak >= 7 ? "状态很好，继续保持" : "每天打一点，进步更稳定",
      progress: Math.min(100, streak * 12),
      icon: Flame
    },
    {
      label: "最高速度",
      value: `${bestWpm} WPM`,
      hint: bestWpm >= 30 ? "已经进入进阶节奏" : "准确率稳定后再提速",
      progress: Math.min(100, Math.round((bestWpm / 60) * 100)),
      icon: Trophy
    },
    {
      label: "习惯金币",
      value: `${coins}`,
      hint: "签到、挑战和三星通关都会给你金币",
      progress: Math.min(100, Math.round((coins / 500) * 100)),
      icon: Star
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => (
        <Card key={item.label} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-sm text-sky-700/75">{item.label}</CardTitle>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-lg">
                <item.icon className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="font-display text-3xl font-bold text-sky-950">{item.value}</div>
            <Progress value={item.progress} />
            <p className="text-sm leading-6 text-sky-800/75">{item.hint}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
