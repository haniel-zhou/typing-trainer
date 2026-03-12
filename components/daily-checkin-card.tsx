"use client";

import { Coins, Gift, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { syncCloudProfile } from "@/lib/cloud";
import { claimDailyCheckIn, getTodayDateString } from "@/lib/typing";
import { loadFriendProfile, loadProgress, saveProgress } from "@/lib/storage";
import { AppProgress } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  progress: AppProgress;
  onProgressChange: (progress: AppProgress) => void;
};

export function DailyCheckInCard({ progress, onProgressChange }: Props) {
  const [message, setMessage] = useState("");
  const today = getTodayDateString();
  const claimedToday = progress.lastCheckInDate === today;

  const streakLabel = useMemo(() => {
    if (progress.streak >= 7) return "状态正热，适合冲榜。";
    if (progress.streak >= 3) return "节奏稳定，继续保持。";
    return "先把每日打开网页的习惯建立起来。";
  }, [progress.streak]);

  function handleCheckIn() {
    const result = claimDailyCheckIn(loadProgress());
    if (!result.claimed) {
      setMessage("今天已经签到过了，去完成一轮训练把奖励吃满。");
      return;
    }

    saveProgress(result.progress);
    void syncCloudProfile(loadFriendProfile(), result.progress);
    onProgressChange(result.progress);
    setMessage(`签到成功，获得 ${result.rewardXp} XP 和 ${result.rewardCoins} 金币。`);
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-sky-500" />
          每日签到
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-[24px] bg-sky-950 p-5 text-white">
          <div className="text-sm uppercase tracking-[0.18em] text-sky-200">今日状态</div>
          <div className="mt-3 flex items-end gap-3">
            <div className="font-display text-4xl">{claimedToday ? "已签到" : "待领取"}</div>
            <div className="rounded-full bg-white/10 px-3 py-1 text-sm">{progress.totalCheckIns} 次累计签到</div>
          </div>
          <p className="mt-3 text-sm leading-7 text-sky-100/80">{streakLabel}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[22px] bg-sky-50/90 p-4">
            <div className="text-sm text-sky-600/75">签到奖励</div>
            <div className="mt-2 flex items-center gap-2 text-lg font-semibold text-sky-950">
              <Sparkles className="h-4 w-4 text-sky-500" />
              +18 XP
            </div>
          </div>
          <div className="rounded-[22px] bg-sky-50/90 p-4">
            <div className="text-sm text-sky-600/75">习惯币</div>
            <div className="mt-2 flex items-center gap-2 text-lg font-semibold text-sky-950">
              <Coins className="h-4 w-4 text-amber-500" />
              +25 金币
            </div>
          </div>
        </div>

        <Button onClick={handleCheckIn} disabled={claimedToday} className="w-full">
          {claimedToday ? "今天已签到" : "领取今日签到"}
        </Button>

        <div className="rounded-[22px] bg-white/70 p-4 text-sm leading-7 text-sky-800/80">
          <div>当前金币：{progress.coins}</div>
          <div>上次签到：{progress.lastCheckInDate ?? "还没有记录"}</div>
          {message ? <div className="mt-2 text-sky-700">{message}</div> : null}
        </div>
      </CardContent>
    </Card>
  );
}
