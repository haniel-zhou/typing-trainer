import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";
import { LeaderboardEntry } from "@/lib/types";

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
    .select("share_code, name, best_wpm, best_accuracy, total_sessions")
    .order("best_wpm", { ascending: false })
    .limit(limit);

  if (codes && codes.length > 0) {
    query = query.in("share_code", codes);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const entries: LeaderboardEntry[] = (data ?? []).map((item, index) => ({
    id: item.share_code,
    name: item.name,
    country: "WEB",
    wpm: item.best_wpm ?? 0,
    accuracy: item.best_accuracy ?? 0,
    streak: item.total_sessions ?? 0,
    badge: index === 0 ? "云端第一" : "云端玩家"
  }));

  return NextResponse.json({ entries });
}
