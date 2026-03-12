import { NextRequest, NextResponse } from "next/server";
import { DailyMissionState } from "@/lib/types";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ configured: false, state: null }, { status: 503 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ configured: false, state: null }, { status: 503 });
  }

  const shareCode = request.nextUrl.searchParams.get("shareCode")?.trim();
  const date = request.nextUrl.searchParams.get("date")?.trim();

  if (!shareCode || !date) {
    return NextResponse.json({ error: "缺少 shareCode 或 date。" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("daily_mission_claims")
    .select("mission_id")
    .eq("share_code", shareCode)
    .eq("mission_date", date);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const state: DailyMissionState = {
    date,
    claimedMissionIds: (data ?? []).map((item) => item.mission_id)
  };

  return NextResponse.json({ state });
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ configured: false }, { status: 503 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ configured: false }, { status: 503 });
  }

  const body = (await request.json()) as { shareCode?: string; state?: DailyMissionState };
  if (!body.shareCode || !body.state?.date) {
    return NextResponse.json({ error: "缺少任务同步数据。" }, { status: 400 });
  }

  const shareCode = body.shareCode;
  const date = body.state.date;
  const missionIds = body.state.claimedMissionIds ?? [];

  const { error: deleteError } = await supabase
    .from("daily_mission_claims")
    .delete()
    .eq("share_code", shareCode)
    .eq("mission_date", date);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  if (missionIds.length === 0) {
    return NextResponse.json({ ok: true });
  }

  const rows = missionIds.map((missionId) => ({
    id: `${shareCode}-${date}-${missionId}`,
    share_code: shareCode,
    mission_date: date,
    mission_id: missionId
  }));

  const { error } = await supabase.from("daily_mission_claims").upsert(rows, {
    onConflict: "share_code,mission_date,mission_id"
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
