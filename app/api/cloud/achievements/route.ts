import { NextRequest, NextResponse } from "next/server";
import { AchievementBadge, AchievementUnlock } from "@/lib/types";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ configured: false, items: [] }, { status: 503 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ configured: false, items: [] }, { status: 503 });
  }

  const shareCode = request.nextUrl.searchParams.get("shareCode")?.trim();
  if (!shareCode) {
    return NextResponse.json({ error: "缺少 shareCode。" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("achievement_unlocks")
    .select("achievement_id, unlocked_at, meta")
    .eq("share_code", shareCode)
    .order("unlocked_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const items: AchievementUnlock[] = (data ?? []).map((item) => ({
    id: item.achievement_id,
    title: item.meta?.title ?? item.achievement_id,
    description: item.meta?.description ?? "",
    tier: item.meta?.tier ?? "bronze",
    metricLabel: item.meta?.metricLabel ?? "进度",
    unlockedAt: item.unlocked_at
  }));

  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ configured: false }, { status: 503 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ configured: false }, { status: 503 });
  }

  const body = (await request.json()) as { shareCode?: string; badges?: AchievementBadge[] };
  if (!body.shareCode) {
    return NextResponse.json({ error: "缺少 shareCode。" }, { status: 400 });
  }

  const unlockedBadges = (body.badges ?? []).filter((badge) => badge.unlocked);

  const { error: deleteError } = await supabase
    .from("achievement_unlocks")
    .delete()
    .eq("share_code", body.shareCode);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  if (unlockedBadges.length === 0) {
    return NextResponse.json({ ok: true });
  }

  const rows = unlockedBadges.map((badge) => ({
    id: `${body.shareCode}-${badge.id}`,
    share_code: body.shareCode,
    achievement_id: badge.id,
    meta: {
      title: badge.title,
      description: badge.description,
      tier: badge.tier,
      metricLabel: badge.metricLabel
    }
  }));

  const { error } = await supabase.from("achievement_unlocks").upsert(rows, {
    onConflict: "share_code,achievement_id"
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
