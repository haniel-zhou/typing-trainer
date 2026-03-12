import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";
import { FriendLink, FriendProfile } from "@/lib/types";

function normalizeSource(source: string | undefined) {
  if (source === "wechat" || source === "qq" || source === "browser" || source === "manual") {
    return source;
  }
  return "browser";
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
    ownerProfile?: FriendProfile;
    friend?: FriendLink;
    ownerInviteUrl?: string;
  };

  if (!body.ownerProfile?.shareCode || !body.ownerProfile.name || !body.friend?.shareCode || !body.friend.name) {
    return NextResponse.json({ error: "缺少接受邀请所需的数据。" }, { status: 400 });
  }

  const joinedAt = new Date().toISOString();

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      share_code: body.ownerProfile.shareCode,
      name: body.ownerProfile.name,
      updated_at: new Date().toISOString()
    },
    { onConflict: "share_code" }
  );

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  const rows = [
    {
      owner_share_code: body.ownerProfile.shareCode,
      friend_share_code: body.friend.shareCode,
      friend_name: body.friend.name,
      source: normalizeSource(body.friend.source),
      joined_at: joinedAt,
      invite_url: body.friend.inviteUrl
    },
    {
      owner_share_code: body.friend.shareCode,
      friend_share_code: body.ownerProfile.shareCode,
      friend_name: body.ownerProfile.name,
      source: "browser",
      joined_at: joinedAt,
      invite_url: body.ownerInviteUrl ?? body.friend.inviteUrl
    }
  ];

  const { error } = await supabase.from("friends").upsert(rows, {
    onConflict: "owner_share_code,friend_share_code"
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
