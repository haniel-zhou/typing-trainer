import { NextRequest, NextResponse } from "next/server";
import { SeasonLeaderboardEntry } from "@/lib/types";
import { getSeasonRank } from "@/lib/typing";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ configured: false, entries: [] }, { status: 503 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ configured: false, entries: [] }, { status: 503 });
  }

  const limit = Number(request.nextUrl.searchParams.get("limit") ?? "20");
  const codes = request.nextUrl.searchParams
    .get("codes")
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  let query = supabase
    .from("profiles")
    .select("share_code, name, season_points, best_wpm, total_sessions")
    .order("season_points", { ascending: false })
    .limit(limit);

  if (codes && codes.length > 0) {
    query = query.in("share_code", codes);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const entries: SeasonLeaderboardEntry[] = (data ?? []).map((item, index) => {
    const rank = getSeasonRank(item.season_points ?? 0);
    return {
      id: item.share_code,
      name: item.name,
      seasonPoints: item.season_points ?? 0,
      bestWpm: item.best_wpm ?? 0,
      totalSessions: item.total_sessions ?? 0,
      title: rank.title,
      highlight: index === 0 ? "当前领跑" : "赛季冲刺中"
    };
  });

  return NextResponse.json({ entries });
}
