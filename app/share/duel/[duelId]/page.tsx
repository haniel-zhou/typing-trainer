import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { DuelShareView } from "@/components/duel-share-view";
import { PageHero } from "@/components/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { getDuelSnapshot } from "@/lib/supabase/duels";

export async function generateMetadata({
  params
}: {
  params: Promise<{ duelId: string }>;
}): Promise<Metadata> {
  const { duelId } = await params;
  const { session, attempts } = await getDuelSnapshot(duelId);

  if (!session) {
    return {
      title: "对战结果分享卡 | Typing Trainer"
    };
  }

  const ranked = [...attempts].sort((a, b) => b.wpm - a.wpm || b.accuracy - a.accuracy);
  const winner = ranked[0];
  const image = `/api/og/share?kind=duel&title=${encodeURIComponent(session.title)}&subtitle=${encodeURIComponent(winner ? `${winner.name} 当前领先` : "等待双方成绩")}&statPrimary=${encodeURIComponent(winner ? `${winner.wpm} WPM` : `${session.goalWpm} WPM`)}&statPrimaryLabel=${encodeURIComponent(winner ? "领先速度" : "目标速度")}&statSecondary=${encodeURIComponent(winner ? `${winner.accuracy}%` : `${session.goalAccuracy}%`)}&statSecondaryLabel=${encodeURIComponent(winner ? "领先正确率" : "目标正确率")}`;

  return {
    title: `${session.title} 对战结果卡 | Typing Trainer`,
    description: winner
      ? `${winner.name} 当前领先，速度 ${winner.wpm} WPM，正确率 ${winner.accuracy}%。`
      : `${session.title} 的对战已经开始。`,
    openGraph: {
      title: `${session.title} 对战结果卡`,
      description: winner ? `${winner.name} 当前领先` : "等待双方成绩",
      images: [{ url: image, width: 1200, height: 630 }]
    },
    twitter: {
      card: "summary_large_image",
      title: `${session.title} 对战结果卡`,
      description: winner ? `${winner.name} 当前领先` : "等待双方成绩",
      images: [image]
    }
  };
}

export default async function DuelSharePage({
  params
}: {
  params: Promise<{ duelId: string }>;
}) {
  const { duelId } = await params;
  const { session, attempts } = await getDuelSnapshot(duelId);

  return (
    <AppShell>
      <PageHero
        eyebrow="Share duel"
        title="对战结果分享卡"
        description="这张分享卡会收拢好友对战的胜负、速度和正确率，适合赛后直接发出去。"
      />
      {session ? (
        <DuelShareView session={session} attempts={attempts} />
      ) : (
        <Card>
          <CardContent className="p-6 text-sm leading-7 text-sky-800/80">
            没有找到这场对战，可能链接已经失效。
          </CardContent>
        </Card>
      )}
    </AppShell>
  );
}
