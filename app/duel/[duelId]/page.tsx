import { AppShell } from "@/components/app-shell";
import { DuelLobby } from "@/components/duel-lobby";
import { PageHero } from "@/components/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { getDuelSnapshot } from "@/lib/supabase/duels";

export default async function DuelPage({
  params
}: {
  params: Promise<{ duelId: string }>;
}) {
  const { duelId } = await params;
  const { session, attempts } = await getDuelSnapshot(duelId);

  return (
    <AppShell>
      <PageHero
        eyebrow="Duel mode"
        title="好友挑战赛"
        description="同一段文本、同一套目标，发链接过去，对方点开就能直接进入浏览器开打。"
      />
      {session ? (
        <DuelLobby session={session} attempts={attempts} />
      ) : (
        <Card>
          <CardContent className="p-6 text-sm leading-7 text-sky-800/80">
            没有找到这场对战。可能链接失效了，或者云端还没有配置完成。
          </CardContent>
        </Card>
      )}
    </AppShell>
  );
}
