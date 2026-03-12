import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";
import { AppProgress, TrainingRecord } from "@/lib/types";

async function updateProfileStats(
  supabase: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  shareCode: string,
  profileName: string,
  progress?: AppProgress
) {
  const { data, error } = await supabase
    .from("training_records")
    .select("wpm, accuracy, duration")
    .eq("share_code", shareCode);

  if (error) {
    return error.message;
  }

  const rows = data ?? [];
  const totalSessions = rows.length;
  const bestWpm = rows.length ? Math.max(...rows.map((item) => item.wpm)) : 0;
  const bestAccuracy = rows.length ? Math.max(...rows.map((item) => item.accuracy)) : 0;
  const totalDuration = rows.reduce((sum, item) => sum + item.duration, 0);
  const averageWpm = rows.length
    ? Math.round(rows.reduce((sum, item) => sum + item.wpm, 0) / rows.length)
    : 0;

  const { error: upsertError } = await supabase.from("profiles").upsert(
    {
      share_code: shareCode,
      name: profileName,
      best_wpm: bestWpm,
      best_accuracy: bestAccuracy,
      average_wpm: averageWpm,
      total_duration: totalDuration,
      total_sessions: totalSessions,
      ...(progress
        ? {
            coins: progress.coins,
            total_check_ins: progress.totalCheckIns,
            season_points: progress.seasonPoints
          }
        : {}),
      updated_at: new Date().toISOString()
    },
    { onConflict: "share_code" }
  );

  return upsertError?.message ?? null;
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ configured: false }, { status: 503 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ configured: false }, { status: 503 });
  }

  const body = (await request.json()) as {
    shareCode?: string;
    profileName?: string;
    records?: TrainingRecord[];
    progress?: AppProgress;
  };

  if (!body.shareCode || !body.profileName) {
    return NextResponse.json({ error: "缺少 shareCode 或 profileName。" }, { status: 400 });
  }

  const rows =
    body.records?.map((record) => ({
      id: record.id,
      share_code: body.shareCode,
      lesson_id: record.lessonId ?? null,
      challenge_id: record.challengeId ?? null,
      duel_id: record.duelId ?? null,
      title: record.title,
      mode: record.mode,
      accuracy: record.accuracy,
      wpm: record.wpm,
      duration: record.duration,
      correct_chars: record.correctChars,
      wrong_chars: record.wrongChars,
      xp_gained: record.xpGained,
      stars: record.stars,
      error_analysis: record.errorAnalysis ?? null,
      created_at: record.createdAt
    })) ?? [];

  if (rows.length > 0) {
    const { error } = await supabase.from("training_records").upsert(rows, { onConflict: "id" });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  const statsError = await updateProfileStats(supabase, body.shareCode, body.profileName, body.progress);
  if (statsError) {
    return NextResponse.json({ error: statsError }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
