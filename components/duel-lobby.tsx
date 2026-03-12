"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Copy, Swords, Trophy } from "lucide-react";
import { DuelAttempt, DuelSession } from "@/lib/types";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  session: DuelSession;
  attempts: DuelAttempt[];
};

export function DuelLobby({ session, attempts }: Props) {
  const [hint, setHint] = useState("把这个链接发给对方，对方点开就能直接进浏览器开始对战。");
  const duelLink = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/duel/${session.id}`;
  }, [session.id]);

  async function copyLink() {
    if (!duelLink) return;
    await navigator.clipboard.writeText(duelLink);
    setHint("对战链接已复制，现在可以直接发给好友。");
  }

  const ranked = [...attempts].sort((a, b) => b.wpm - a.wpm || b.accuracy - a.accuracy);

  return (
    <div className="space-y-6">
      <Card className="page-intro overflow-hidden">
        <CardContent className="grid gap-6 p-6 md:p-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <div className="inline-flex rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 shadow-sm">
              Friend duel
            </div>
            <CardTitle className="text-4xl">{session.title}</CardTitle>
            <p className="text-sm leading-8 text-sky-800/80">{session.description}</p>
            <div className="flex flex-wrap gap-2 text-sm text-sky-700/80">
              <span className="rounded-full bg-white px-3 py-1">限时 {session.timeLimitSeconds}s</span>
              <span className="rounded-full bg-white px-3 py-1">目标 {session.goalWpm} WPM</span>
              <span className="rounded-full bg-white px-3 py-1">目标 {session.goalAccuracy}%</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => void copyLink()} className={buttonStyles({ className: "gap-2" })}>
                <Copy className="h-4 w-4" />
                复制对战链接
              </button>
              <Link
                href={`/share/duel/${encodeURIComponent(session.id)}`}
                className={buttonStyles({ variant: "outline", className: "gap-2" })}
              >
                <Trophy className="h-4 w-4" />
                分享结果卡
              </Link>
              <Link href={`/trainer?duel=${encodeURIComponent(session.id)}`} className={buttonStyles({ variant: "outline", className: "gap-2" })}>
                <Swords className="h-4 w-4" />
                进入对战
              </Link>
            </div>
            <p className="text-sm leading-7 text-sky-800/80">{hint}</p>
          </div>

          <div className="rounded-[28px] bg-white/75 p-5 shadow-sm">
            <div className="text-sm font-semibold text-sky-700">对战双方</div>
            <div className="mt-4 grid gap-3">
              <div className="rounded-[22px] bg-sky-50/90 p-4">
                <div className="text-xs text-sky-500">发起人</div>
                <div className="mt-2 text-2xl font-semibold text-sky-950">{session.challengerName}</div>
              </div>
              <div className="rounded-[22px] bg-sky-50/90 p-4">
                <div className="text-xs text-sky-500">应战人</div>
                <div className="mt-2 text-2xl font-semibold text-sky-950">{session.opponentName}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>对战成绩</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {ranked.length === 0 ? (
            <div className="rounded-[22px] bg-sky-50/90 p-4 text-sm text-sky-800/80">
              还没有成绩。你可以先打一轮，再把链接发给好友。
            </div>
          ) : (
            ranked.map((attempt, index) => (
              <div key={attempt.id} className="grid gap-3 rounded-[22px] bg-sky-50/90 p-4 md:grid-cols-5">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs text-sky-500">
                    <Trophy className="h-3.5 w-3.5" />
                    排名 {index + 1}
                  </div>
                  <div className="mt-1 font-medium text-sky-950">{attempt.name}</div>
                </div>
                <div>
                  <div className="text-xs text-sky-500">速度</div>
                  <div className="mt-1 font-medium text-sky-950">{attempt.wpm} WPM</div>
                </div>
                <div>
                  <div className="text-xs text-sky-500">正确率</div>
                  <div className="mt-1 font-medium text-sky-950">{attempt.accuracy}%</div>
                </div>
                <div>
                  <div className="text-xs text-sky-500">错误</div>
                  <div className="mt-1 font-medium text-sky-950">{attempt.wrongChars}</div>
                </div>
                <div>
                  <div className="text-xs text-sky-500">时间</div>
                  <div className="mt-1 font-medium text-sky-950">{attempt.createdAt}</div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
