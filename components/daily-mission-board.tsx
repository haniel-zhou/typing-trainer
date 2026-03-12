"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Coins, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { fetchCloudDailyMissionState, syncCloudDailyMissionState, syncCloudProfile } from "@/lib/cloud";
import {
  loadDailyMissionState,
  loadFriendProfile,
  loadProgress,
  saveDailyMissionState,
  saveProgress
} from "@/lib/storage";
import { buildDailyMissions, claimDailyMissionReward, getTodayDateString } from "@/lib/typing";
import { AppProgress, DailyMission, TrainingRecord } from "@/lib/types";

type Props = {
  records: TrainingRecord[];
  progress: AppProgress;
  onProgressChange: (progress: AppProgress) => void;
};

export function DailyMissionBoard({ records, progress, onProgressChange }: Props) {
  const [message, setMessage] = useState("");
  const [claimedState, setClaimedState] = useState(() => loadDailyMissionState());
  const missions = useMemo(
    () => buildDailyMissions(records, claimedState),
    [claimedState, records]
  );

  useEffect(() => {
    const localState = loadDailyMissionState();
    const shareCode = loadFriendProfile().shareCode;
    const today = getTodayDateString();

    void fetchCloudDailyMissionState(shareCode, today).then((cloudState) => {
      if (!cloudState) return;
      const merged = {
        date: today,
        claimedMissionIds: Array.from(
          new Set([
            ...(localState.date === today ? localState.claimedMissionIds : []),
            ...cloudState.claimedMissionIds
          ])
        )
      };
      saveDailyMissionState(merged);
      setClaimedState(merged);
    });
  }, []);

  function claimMission(mission: DailyMission) {
    const currentProgress = loadProgress();
    const currentState = loadDailyMissionState();
    const result = claimDailyMissionReward(currentProgress, mission, {
      date: currentState.date || getTodayDateString(),
      claimedMissionIds: currentState.claimedMissionIds
    });

    if (!result.claimed) {
      setMessage("这个任务还不能领取，先完成目标。");
      return;
    }

    saveProgress(result.progress);
    saveDailyMissionState(result.missionState);
    setClaimedState(result.missionState);
    const profile = loadFriendProfile();
    void syncCloudProfile(profile, result.progress);
    void syncCloudDailyMissionState(profile.shareCode, result.missionState);
    onProgressChange(result.progress);
    setMessage(`领取成功：+${mission.rewardXp} XP，+${mission.rewardCoins} 金币。`);
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-sky-500" />
          每日任务
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {missions.map((mission) => (
          <div key={mission.id} className="rounded-[24px] border border-sky-100 bg-white/80 p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-semibold text-sky-950">{mission.title}</div>
                <div className="mt-1 text-sm leading-7 text-sky-800/80">{mission.description}</div>
              </div>
              <div className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                {mission.progress}/{mission.goal}
              </div>
            </div>
            <div className="mt-4">
              <Progress value={Math.round((mission.progress / mission.goal) * 100)} />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2 text-sm text-sky-800/80">
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-amber-700">
                  <Coins className="h-4 w-4" />
                  +{mission.rewardCoins} 金币
                </span>
                <span className="rounded-full bg-sky-50 px-3 py-1 text-sky-700">+{mission.rewardXp} XP</span>
              </div>
              <Button
                type="button"
                variant={mission.claimed ? "outline" : "default"}
                onClick={() => claimMission(mission)}
                disabled={mission.claimed || !mission.completed}
                className="gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                {mission.claimed ? "已领取" : mission.completed ? "领取奖励" : "进行中"}
              </Button>
            </div>
          </div>
        ))}
        <div className="rounded-[22px] bg-sky-50/80 p-4 text-sm leading-7 text-sky-800/80">
          今天金币：{progress.coins} · 今日任务完成后会自动强化签到奖励的留存感。
          {message ? <div className="mt-2 text-sky-700">{message}</div> : null}
        </div>
      </CardContent>
    </Card>
  );
}
