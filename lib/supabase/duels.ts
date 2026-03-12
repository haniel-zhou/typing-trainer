import { getSupabaseAdmin } from "@/lib/supabase/server";
import { DuelAttempt, DuelSession } from "@/lib/types";

export async function getDuelSnapshot(duelId: string): Promise<{
  session: DuelSession | null;
  attempts: DuelAttempt[];
}> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { session: null, attempts: [] };
  }

  const [{ data: sessionRow }, { data: attemptRows }] = await Promise.all([
    supabase
      .from("duels")
      .select(
        "id, title, description, content, goal_accuracy, goal_wpm, time_limit_seconds, challenger_share_code, challenger_name, opponent_share_code, opponent_name, created_at"
      )
      .eq("id", duelId)
      .maybeSingle(),
    supabase
      .from("duel_attempts")
      .select(
        "id, duel_id, share_code, name, accuracy, wpm, duration, correct_chars, wrong_chars, created_at"
      )
      .eq("duel_id", duelId)
      .order("wpm", { ascending: false })
  ]);

  if (!sessionRow) {
    return { session: null, attempts: [] };
  }

  const session: DuelSession = {
    id: sessionRow.id,
    title: sessionRow.title,
    description: sessionRow.description,
    content: sessionRow.content,
    goalAccuracy: sessionRow.goal_accuracy,
    goalWpm: sessionRow.goal_wpm,
    timeLimitSeconds: sessionRow.time_limit_seconds,
    challengerShareCode: sessionRow.challenger_share_code,
    challengerName: sessionRow.challenger_name,
    opponentShareCode: sessionRow.opponent_share_code,
    opponentName: sessionRow.opponent_name,
    createdAt: sessionRow.created_at
  };

  const attempts: DuelAttempt[] = (attemptRows ?? []).map((row) => ({
    id: row.id,
    duelId: row.duel_id,
    shareCode: row.share_code,
    name: row.name,
    accuracy: row.accuracy,
    wpm: row.wpm,
    duration: row.duration,
    correctChars: row.correct_chars,
    wrongChars: row.wrong_chars,
    createdAt: row.created_at
  }));

  return { session, attempts };
}
