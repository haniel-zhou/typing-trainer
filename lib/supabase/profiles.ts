import { AchievementUnlock, FriendSnapshot, TrainingRecord } from "@/lib/types";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function getFriendSnapshotByShareCode(shareCode: string): Promise<FriendSnapshot | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase || !shareCode) {
    return null;
  }

  const [
    { data: profile },
    { data: records },
    { data: achievements }
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "share_code, name, best_wpm, best_accuracy, average_wpm, total_duration, total_sessions, season_points, coins, total_check_ins"
      )
      .eq("share_code", shareCode)
      .maybeSingle(),
    supabase
      .from("training_records")
      .select(
        "id, lesson_id, challenge_id, title, mode, accuracy, wpm, duration, correct_chars, wrong_chars, xp_gained, stars, created_at"
      )
      .eq("share_code", shareCode)
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("achievement_unlocks")
      .select("achievement_id, unlocked_at, meta")
      .eq("share_code", shareCode)
      .order("unlocked_at", { ascending: false })
      .limit(8)
  ]);

  if (!profile) {
    return null;
  }

  const recentRecords: TrainingRecord[] = (records ?? []).map((item) => ({
    id: item.id,
    lessonId: item.lesson_id ?? undefined,
    challengeId: item.challenge_id ?? undefined,
    title: item.title,
    mode: item.mode,
    accuracy: item.accuracy,
    wpm: item.wpm,
    duration: item.duration,
    correctChars: item.correct_chars,
    wrongChars: item.wrong_chars,
    xpGained: item.xp_gained,
    stars: item.stars,
    createdAt: item.created_at
  }));

  const unlockedAchievements: AchievementUnlock[] = (achievements ?? []).map((item) => ({
    id: item.achievement_id,
    title: item.meta?.title ?? item.achievement_id,
    description: item.meta?.description ?? "",
    tier: item.meta?.tier ?? "bronze",
    metricLabel: item.meta?.metricLabel ?? "进度",
    unlockedAt: item.unlocked_at
  }));

  return {
    shareCode: profile.share_code,
    name: profile.name,
    bestWpm: profile.best_wpm ?? 0,
    bestAccuracy: profile.best_accuracy ?? 0,
    averageWpm: profile.average_wpm ?? 0,
    totalDuration: profile.total_duration ?? 0,
    totalSessions: profile.total_sessions ?? 0,
    seasonPoints: profile.season_points ?? 0,
    coins: profile.coins ?? 0,
    totalCheckIns: profile.total_check_ins ?? 0,
    achievements: unlockedAchievements,
    recentRecords
  };
}
