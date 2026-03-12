import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { getFriendSnapshotByShareCode } from "@/lib/supabase/profiles";

type Params = {
  params: Promise<{ shareCode: string }>;
};

export async function GET(_request: NextRequest, { params }: Params) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ configured: false, snapshot: null }, { status: 503 });
  }

  const { shareCode } = await params;
  if (!shareCode) {
    return NextResponse.json({ error: "缺少 shareCode。" }, { status: 400 });
  }

  const snapshot = await getFriendSnapshotByShareCode(shareCode);
  if (!snapshot) {
    return NextResponse.json({ snapshot: null }, { status: 404 });
  }

  return NextResponse.json({ snapshot });
}
