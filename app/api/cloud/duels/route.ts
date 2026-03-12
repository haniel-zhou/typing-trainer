import { NextRequest, NextResponse } from "next/server";
import { FRIEND_DUEL_TEMPLATE } from "@/data/duels";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";
import { DuelSession, FriendProfile } from "@/lib/types";

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ configured: false }, { status: 503 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ configured: false }, { status: 503 });
  }

  const body = (await request.json()) as {
    challenger?: FriendProfile;
    opponent?: { shareCode?: string; name?: string };
  };

  if (!body.challenger?.shareCode || !body.challenger.name || !body.opponent?.shareCode || !body.opponent.name) {
    return NextResponse.json({ error: "缺少发起对战所需的信息。" }, { status: 400 });
  }

  const session: DuelSession = {
    id: `duel-${Date.now()}`,
    title: FRIEND_DUEL_TEMPLATE.title,
    description: FRIEND_DUEL_TEMPLATE.description,
    content: FRIEND_DUEL_TEMPLATE.content,
    goalAccuracy: FRIEND_DUEL_TEMPLATE.goalAccuracy,
    goalWpm: FRIEND_DUEL_TEMPLATE.goalWpm,
    timeLimitSeconds: FRIEND_DUEL_TEMPLATE.timeLimitSeconds,
    challengerShareCode: body.challenger.shareCode,
    challengerName: body.challenger.name,
    opponentShareCode: body.opponent.shareCode,
    opponentName: body.opponent.name,
    createdAt: new Date().toISOString()
  };

  const { error } = await supabase.from("duels").insert({
    id: session.id,
    title: session.title,
    description: session.description,
    content: session.content,
    goal_accuracy: session.goalAccuracy,
    goal_wpm: session.goalWpm,
    time_limit_seconds: session.timeLimitSeconds,
    challenger_share_code: session.challengerShareCode,
    challenger_name: session.challengerName,
    opponent_share_code: session.opponentShareCode,
    opponent_name: session.opponentName,
    created_at: session.createdAt
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ session });
}
