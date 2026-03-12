import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";
import { FriendLink } from "@/lib/types";

function normalizeSource(source: string | undefined) {
  if (source === "wechat" || source === "qq" || source === "browser" || source === "manual") {
    return source;
  }
  return "browser";
}

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ configured: false, friends: [] }, { status: 503 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ configured: false, friends: [] }, { status: 503 });
  }

  const shareCode = request.nextUrl.searchParams.get("shareCode");
  if (!shareCode) {
    return NextResponse.json({ error: "缺少 shareCode。" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("friends")
    .select("friend_share_code, friend_name, source, joined_at, invite_url")
    .eq("owner_share_code", shareCode)
    .order("joined_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const friends: FriendLink[] = (data ?? []).map((item) => ({
    id: item.friend_share_code,
    name: item.friend_name,
    shareCode: item.friend_share_code,
    source: normalizeSource(item.source),
    joinedAt: item.joined_at,
    inviteUrl: item.invite_url
  }));

  return NextResponse.json({ friends });
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
    ownerShareCode?: string;
    friends?: FriendLink[];
  };

  if (!body.ownerShareCode) {
    return NextResponse.json({ error: "缺少 ownerShareCode。" }, { status: 400 });
  }

  const rows =
    body.friends?.map((friend) => ({
      owner_share_code: body.ownerShareCode,
      friend_share_code: friend.shareCode,
      friend_name: friend.name,
      source: normalizeSource(friend.source),
      joined_at: friend.joinedAt,
      invite_url: friend.inviteUrl
    })) ?? [];

  await supabase.from("friends").delete().eq("owner_share_code", body.ownerShareCode);

  if (rows.length > 0) {
    const { error } = await supabase.from("friends").upsert(rows, {
      onConflict: "owner_share_code,friend_share_code"
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
