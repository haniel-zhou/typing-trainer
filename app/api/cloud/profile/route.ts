import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";
import { AppProgress, FriendProfile } from "@/lib/types";

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ configured: false }, { status: 503 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ configured: false }, { status: 503 });
  }

  const body = (await request.json()) as { profile?: FriendProfile; progress?: AppProgress };
  if (!body.profile?.shareCode || !body.profile.name) {
    return NextResponse.json({ error: "缺少个人资料数据。" }, { status: 400 });
  }

  const { error } = await supabase.from("profiles").upsert(
    {
      share_code: body.profile.shareCode,
      name: body.profile.name,
      ...(body.progress
        ? {
            coins: body.progress.coins,
            total_check_ins: body.progress.totalCheckIns,
            season_points: body.progress.seasonPoints
          }
        : {}),
      updated_at: new Date().toISOString()
    },
    { onConflict: "share_code" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
