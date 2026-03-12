import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { PageHero } from "@/components/page-hero";
import { ProfileShareView } from "@/components/profile-share-view";
import { getFriendSnapshotByShareCode } from "@/lib/supabase/profiles";

export async function generateMetadata({
  params
}: {
  params: Promise<{ shareCode: string }>;
}): Promise<Metadata> {
  const { shareCode } = await params;
  const snapshot = await getFriendSnapshotByShareCode(shareCode);

  if (!snapshot) {
    return {
      title: "个人战绩分享卡 | Typing Trainer"
    };
  }

  const image = `/api/og/share?kind=profile&title=${encodeURIComponent(snapshot.name)}&subtitle=${encodeURIComponent("最高速度、成就和最近状态一页直达")}&statPrimary=${encodeURIComponent(`${snapshot.bestWpm} WPM`)}&statPrimaryLabel=${encodeURIComponent("最高速度")}&statSecondary=${encodeURIComponent(`${snapshot.bestAccuracy}%`)}&statSecondaryLabel=${encodeURIComponent("正确率")}`;

  return {
    title: `${snapshot.name} 的个人战绩卡 | Typing Trainer`,
    description: `${snapshot.name} 的最高速度 ${snapshot.bestWpm} WPM，最佳正确率 ${snapshot.bestAccuracy}%。`,
    openGraph: {
      title: `${snapshot.name} 的个人战绩卡`,
      description: `${snapshot.name} 的 Typing Trainer 成绩概览`,
      images: [{ url: image, width: 1200, height: 630 }]
    },
    twitter: {
      card: "summary_large_image",
      title: `${snapshot.name} 的个人战绩卡`,
      description: `${snapshot.name} 的 Typing Trainer 成绩概览`,
      images: [image]
    }
  };
}

export default async function ProfileSharePage({
  params
}: {
  params: Promise<{ shareCode: string }>;
}) {
  const { shareCode } = await params;

  return (
    <AppShell>
      <PageHero
        eyebrow="Share profile"
        title="个人战绩分享卡"
        description="把你的打字成绩压成一张能直接发出去的网页卡片。对方点开就能看到核心数据，不需要先理解整个产品。"
      />
      <ProfileShareView shareCode={shareCode} />
    </AppShell>
  );
}
