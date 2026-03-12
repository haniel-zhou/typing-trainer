import { NextRequest, NextResponse } from "next/server";
import { PersonalWordBank } from "@/lib/types";
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
    .from("word_banks")
    .select("id, title, category, terms, source, created_at")
    .eq("share_code", shareCode)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const items: PersonalWordBank[] = (data ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    terms: Array.isArray(item.terms) ? item.terms : [],
    source: item.source,
    createdAt: item.created_at
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

  const body = (await request.json()) as { shareCode?: string; items?: PersonalWordBank[] };
  if (!body.shareCode) {
    return NextResponse.json({ error: "缺少 shareCode。" }, { status: 400 });
  }

  const shareCode = body.shareCode;
  const items = body.items ?? [];

  const { error: deleteError } = await supabase.from("word_banks").delete().eq("share_code", shareCode);
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  if (items.length === 0) {
    return NextResponse.json({ ok: true });
  }

  const rows = items.map((item) => ({
    id: item.id,
    share_code: shareCode,
    title: item.title,
    category: item.category,
    terms: item.terms,
    source: item.source,
    created_at: Number.isNaN(new Date(item.createdAt).getTime())
      ? new Date().toISOString()
      : new Date(item.createdAt).toISOString()
  }));

  const { error } = await supabase.from("word_banks").upsert(rows, { onConflict: "id" });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
