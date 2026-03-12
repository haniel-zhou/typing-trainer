import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { PageHero } from "@/components/page-hero";
import { SeasonShareView } from "@/components/season-share-view";
import { getFriendSnapshotByShareCode } from "@/lib/supabase/profiles";
import { getSeasonProgress } from "@/lib/typing";

export async function generateMetadata({
  params
}: {
  params: Promise<{ shareCode: string }>;
}): Promise<Metadata> {
  const { shareCode } = await params;
  const snapshot = await getFriendSnapshotByShareCode(shareCode);

  if (!snapshot) {
    return {
      title: "赛季分享卡 | Typing Trainer"
    };
  }

  const season = getSeasonProgress(snapshot.seasonPoints);
  const image = `/api/og/share?kind=season&title=${encodeURIComponent(snapshot.name)}&subtitle=${encodeURIComponent(`${season.current.title} · ${snapshot.seasonPoints} 赛季分`)}&statPrimary=${encodeURIComponent(`${snapshot.seasonPoints} 分`)}&statPrimaryLabel=${encodeURIComponent("赛季积分")}&statSecondary=${encodeURIComponent(`${snapshot.achievements.length} 枚`)}&statSecondaryLabel=${encodeURIComponent("成就数量")}`;

  return {
    title: `${snapshot.name} 的赛季分享卡 | Typing Trainer`,
    description: `${snapshot.name} 当前段位 ${season.current.title}，赛季积分 ${snapshot.seasonPoints}。`,
    openGraph: {
      title: `${snapshot.name} 的赛季分享卡`,
      description: `${season.current.title} · ${snapshot.seasonPoints} 赛季分`,
      images: [{ url: image, width: 1200, height: 630 }]
    },
    twitter: {
      card: "summary_large_image",
      title: `${snapshot.name} 的赛季分享卡`,
      description: `${season.current.title} · ${snapshot.seasonPoints} 赛季分`,
      images: [image]
    }
  };
}

export default async function SeasonSharePage({
  params
}: {
  params: Promise<{ shareCode: string }>;
}) {
  const { shareCode } = await params;

  return (
    <AppShell>
      <PageHero
        eyebrow="Share season"
        title="赛季分享卡"
        description="当前段位、Boss 进度和赛季奖励都会收进这一张卡片，适合直接发到聊天工具里。"
      />
      <SeasonShareView shareCode={shareCode} />
    </AppShell>
  );
}
