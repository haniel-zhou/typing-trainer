"use client";

import { useMemo } from "react";
import { Crown, Swords, Trophy } from "lucide-react";
import { DuelAttempt, DuelSession } from "@/lib/types";
import { ShareCardActions } from "@/components/share-card-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DuelShareView({
  session,
  attempts
}: {
  session: DuelSession;
  attempts: DuelAttempt[];
}) {
  const ranked = [...attempts].sort((a, b) => b.wpm - a.wpm || b.accuracy - a.accuracy);
  const winner = ranked[0];
  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);

  return (
    <div id="duel-share-poster" className="space-y-6">
      <Card
        id="duel-share-card"
        className="overflow-hidden border-sky-200 bg-[linear-gradient(135deg,rgba(9,20,46,0.98),rgba(11,83,148,0.92),rgba(250,204,21,0.45))] text-white shadow-[0_34px_95px_rgba(11,31,65,0.35)]"
      >
        <CardContent className="grid gap-6 p-6 md:p-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/85">
              <Swords className="h-4 w-4" />
              Duel result card
            </div>
            <div>
              <div className="text-sm uppercase tracking-[0.2em] text-white/70">好友对战分享卡</div>
              <CardTitle className="mt-3 text-4xl text-white">{session.title}</CardTitle>
              <p className="mt-3 max-w-xl text-sm leading-8 text-white/85">
                同一段文本、同一条规则，这张卡会直接展示当前对战排名和胜出者。
              </p>
            </div>
            <ShareCardActions
              shareUrl={shareUrl}
              title={`${session.title} 对战结果`}
              text={winner ? `${winner.name} 在 ${session.title} 中领先，速度 ${winner.wpm} WPM。` : `${session.title} 的对战已经开始。`}
              captureId="duel-share-card"
              posterId="duel-share-poster"
              kind="duel"
            />
          </div>

          <div className="grid gap-3">
            <div className="rounded-[24px] bg-white/12 p-4 backdrop-blur">
              <div className="text-sm text-white/75">对战双方</div>
              <div className="mt-2 text-2xl font-semibold">{session.challengerName} vs {session.opponentName}</div>
            </div>
            <div className="rounded-[24px] bg-white/12 p-4 backdrop-blur">
              <div className="text-sm text-white/75">本局目标</div>
              <div className="mt-2 flex flex-wrap gap-2 text-sm">
                <span className="rounded-full bg-white/10 px-3 py-1">限时 {session.timeLimitSeconds}s</span>
                <span className="rounded-full bg-white/10 px-3 py-1">{session.goalWpm} WPM</span>
                <span className="rounded-full bg-white/10 px-3 py-1">{session.goalAccuracy}%</span>
              </div>
            </div>
            <div className="rounded-[24px] bg-white/12 p-4 backdrop-blur">
              <div className="flex items-center gap-2 text-sm text-white/75">
                <Crown className="h-4 w-4 text-amber-300" />
                当前领先
              </div>
              <div className="mt-2 text-3xl font-semibold">{winner ? winner.name : "等待成绩"}</div>
              <div className="mt-1 text-sm text-white/75">{winner ? `${winner.wpm} WPM · ${winner.accuracy}%` : "双方还没有完成一轮"}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>对战排行</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {ranked.length === 0 ? (
            <div className="rounded-[22px] bg-sky-50/90 p-4 text-sm leading-7 text-sky-800/80">
              这场对战暂时还没有成绩。
            </div>
          ) : (
            ranked.map((attempt, index) => (
              <div key={attempt.id} className="grid gap-3 rounded-[22px] bg-sky-50/90 p-4 md:grid-cols-[88px_minmax(0,1fr)_120px_120px]">
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-sky-950">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  #{index + 1}
                </div>
                <div className="font-medium text-sky-950">{attempt.name}</div>
                <div className="text-sky-950">{attempt.wpm} WPM</div>
                <div className="text-sky-950">{attempt.accuracy}%</div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
