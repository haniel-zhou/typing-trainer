import { AppShell } from "@/components/app-shell";
import { TrainerPanel } from "@/components/trainer-panel";
import { getBossChallengeById } from "@/data/boss-challenges";
import { getChallengeById } from "@/data/challenges";
import { LESSONS } from "@/data/lessons";
import { getDuelSnapshot } from "@/lib/supabase/duels";

export default async function TrainerPage({
  searchParams
}: {
  searchParams: Promise<{ lesson?: string; custom?: string; challenge?: string; duel?: string; boss?: string }>;
}) {
  const params = await searchParams;
  const lessonId = Number(params.lesson);
  const lesson = LESSONS.find((item) => item.id === lessonId);
  const challenge = getChallengeById(params.challenge);
  const boss = getBossChallengeById(params.boss);
  const duel = params.duel ? (await getDuelSnapshot(params.duel)).session : null;

  return (
    <AppShell compact>
      <TrainerPanel
        lesson={lesson}
        customId={params.custom}
        challenge={challenge}
        boss={boss}
        duel={duel}
      />
    </AppShell>
  );
}
