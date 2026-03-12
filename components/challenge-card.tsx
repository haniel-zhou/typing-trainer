import Link from "next/link";
import { Clock3, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChallengeCardData, TrainingRecord } from "@/lib/types";

export function ChallengeCard({
  challenge,
  personalBest,
  cleared = false
}: {
  challenge: ChallengeCardData;
  personalBest?: TrainingRecord;
  cleared?: boolean;
}) {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <CardHeader>
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
          <Sparkles className="h-3.5 w-3.5" />
          Challenge mode
        </div>
        <CardTitle>{challenge.title}</CardTitle>
        <div className="text-sm text-sky-700/75">{cleared ? "已达标，可继续冲榜" : "尚未达标"}</div>
      </CardHeader>
      <CardContent className="flex h-full flex-col space-y-4">
        <p className="text-sm leading-7 text-sky-800/80">{challenge.description}</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[20px] bg-sky-50/85 p-4">
            <div className="flex items-center gap-2 text-xs text-sky-600/75">
              <Trophy className="h-3.5 w-3.5" />
              奖励
            </div>
            <div className="mt-2 font-semibold text-sky-950">{challenge.reward}</div>
          </div>
          <div className="rounded-[20px] bg-sky-50/85 p-4">
            <div className="text-xs text-sky-600/75">挑战目标</div>
            <div className="mt-2 font-semibold text-sky-950">{challenge.goal}</div>
          </div>
          <div className="rounded-[20px] bg-sky-50/85 p-4">
            <div className="flex items-center gap-2 text-xs text-sky-600/75">
              <Clock3 className="h-3.5 w-3.5" />
              时限
            </div>
            <div className="mt-2 font-semibold text-sky-950">{challenge.timeLimit}</div>
          </div>
        </div>
        <div className="rounded-[20px] bg-white/80 p-4 text-sm text-sky-800/80">
          <div className="text-xs uppercase tracking-[0.16em] text-sky-500">你的最佳成绩</div>
          <div className="mt-2 font-semibold text-sky-950">
            {personalBest
              ? `${personalBest.wpm} WPM · ${personalBest.accuracy}% · ${personalBest.duration}s`
              : "还没有挑战记录"}
          </div>
        </div>
        <Link href={`/trainer?challenge=${challenge.id}`} className="mt-auto block">
          <Button className="w-full">加入挑战</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
