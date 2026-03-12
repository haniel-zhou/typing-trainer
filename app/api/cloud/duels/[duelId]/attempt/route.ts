import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";
import { DuelAttempt } from "@/lib/types";

type Params = {
  params: Promise<{ duelId: string }>;
};

export async function POST(request: NextRequest, { params }: Params) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ configured: false }, { status: 503 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ configured: false }, { status: 503 });
  }

  const { duelId } = await params;
  const body = (await request.json()) as { attempt?: DuelAttempt };
  const attempt = body.attempt;

  if (!duelId || !attempt?.shareCode || !attempt.name) {
    return NextResponse.json({ error: "缺少对战成绩数据。" }, { status: 400 });
  }

  const { error } = await supabase.from("duel_attempts").upsert(
    {
      id: attempt.id,
      duel_id: duelId,
      share_code: attempt.shareCode,
      name: attempt.name,
      accuracy: attempt.accuracy,
      wpm: attempt.wpm,
      duration: attempt.duration,
      correct_chars: attempt.correctChars,
      wrong_chars: attempt.wrongChars,
      created_at: attempt.createdAt
    },
    { onConflict: "duel_id,share_code" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
