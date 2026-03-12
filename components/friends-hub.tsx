"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Copy, Link2, Share2, Smartphone, UserPlus, Users } from "lucide-react";
import {
  acceptCloudFriend,
  pullCloudFriends,
  syncCloudFriends,
  syncCloudProfile
} from "@/lib/cloud";
import {
  loadFriendProfile,
  loadProgress,
  loadFriends,
  saveFriendProfile,
  upsertFriend
} from "@/lib/storage";
import { FriendLink, FriendProfile, ShareChannel } from "@/lib/types";
import { Button, buttonStyles } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  inviteCode?: string;
  inviteName?: string;
};

function parseInviteUrl(url: string) {
  try {
    const parsed = new URL(url);
    const inviteCode = parsed.searchParams.get("invite");
    const inviteName = parsed.searchParams.get("name");
    if (!inviteCode) return null;
    return {
      inviteCode,
      inviteName: inviteName ?? "你的朋友",
      inviteUrl: parsed.toString()
    };
  } catch {
    return null;
  }
}

export function FriendsHub({ inviteCode, inviteName }: Props) {
  const [profile, setProfile] = useState<FriendProfile | null>(null);
  const [friends, setFriends] = useState<FriendLink[]>([]);
  const [manualLink, setManualLink] = useState("");
  const [hint, setHint] = useState("把链接发给朋友，对方在微信、QQ 或浏览器里点开就能直接进入网页。");

  useEffect(() => {
    const localProfile = loadFriendProfile();
    const localFriends = loadFriends();
    setProfile(localProfile);
    setFriends(localFriends);
    void syncCloudProfile(localProfile, loadProgress());
    void syncCloudFriends(localProfile.shareCode, localFriends);
    void pullCloudFriends(localProfile.shareCode).then((items) => {
      if (items.length === 0) return;
      items.forEach((item) => upsertFriend(item));
      setFriends(loadFriends());
    });
  }, []);

  const inviteUrl = useMemo(() => {
    if (!profile || typeof window === "undefined") return "";
    const url = new URL("/friends", window.location.origin);
    url.searchParams.set("invite", profile.shareCode);
    url.searchParams.set("name", profile.name);
    return url.toString();
  }, [profile]);

  function updateName(name: string) {
    if (!profile) return;
    const next = { ...profile, name, updatedAt: new Date().toISOString() };
    setProfile(next);
    saveFriendProfile(next);
    void syncCloudProfile(next, loadProgress());
  }

  async function copyInviteLink() {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setHint("邀请链接已复制，现在可以直接发到微信、QQ 或任何聊天工具。");
  }

  async function shareInviteLink() {
    if (!inviteUrl) return;
    if (navigator.share) {
      await navigator.share({
        title: `${profile?.name} 邀请你加入打字训练`,
        text: "点开浏览器就能直接开始使用，不需要安装。",
        url: inviteUrl
      });
      return;
    }
    await copyInviteLink();
  }

  function addFriendFromInvite(
    code: string,
    name: string,
    source: ShareChannel,
    url: string
  ) {
    if (!profile || code === profile.shareCode) {
      setHint("这是你自己的邀请链接，不需要重复添加。");
      return;
    }

    const friend: FriendLink = {
      id: code,
      name,
      shareCode: code,
      source,
      joinedAt: new Date().toISOString(),
      inviteUrl: url
    };
    upsertFriend(friend);
    const nextFriends = loadFriends();
    setFriends(nextFriends);
    void syncCloudFriends(profile.shareCode, nextFriends);
    void acceptCloudFriend(profile, friend, inviteUrl || url);
    setHint(`已把 ${name} 加到好友列表。`);
  }

  function addFriendByManualLink() {
    const parsed = parseInviteUrl(manualLink.trim());
    if (!parsed) {
      setHint("这个链接格式不对，先复制完整的邀请链接再贴进来。");
      return;
    }
    addFriendFromInvite(parsed.inviteCode, parsed.inviteName, "manual", parsed.inviteUrl);
    setManualLink("");
  }

  const inviteBanner =
    inviteCode && inviteName
      ? {
          code: inviteCode,
          name: inviteName,
          url: typeof window !== "undefined" ? window.location.href : ""
        }
      : null;

  return (
    <div className="space-y-6">
      {inviteBanner ? (
        <Card className="border-emerald-200 bg-emerald-50/90">
          <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                邀请到达
              </div>
              <div className="mt-2 text-2xl font-semibold text-emerald-950">
                {inviteBanner.name} 想和你一起练打字
              </div>
              <p className="mt-2 text-sm leading-7 text-emerald-800/80">
                你点接受后，会自动建立双向好友关系。之后双方都能直接看到彼此的云端成绩。
              </p>
            </div>
            <Button
              onClick={() =>
                addFriendFromInvite(
                  inviteBanner.code,
                  inviteBanner.name,
                  "browser",
                  inviteBanner.url
                )
              }
              className="gap-2"
            >
              <UserPlus className="h-4 w-4" />
              添加这位朋友
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader>
            <CardTitle>邀请好友</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-[1fr_220px]">
              <input
                value={profile?.name ?? ""}
                onChange={(event) => updateName(event.target.value)}
                placeholder="给你的训练主页起个名字"
                className="w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm text-sky-950"
              />
              <a href={inviteUrl} className={buttonStyles({ variant: "outline", className: "gap-2" })}>
                <Link2 className="h-4 w-4" />
                打开邀请页
              </a>
            </div>
            <div className="rounded-[24px] bg-sky-50/90 p-4">
              <div className="text-sm font-semibold text-sky-700">你的邀请链接</div>
              <div className="mt-2 break-all text-sm leading-7 text-sky-950">{inviteUrl || "生成中..."}</div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => void copyInviteLink()} className="gap-2">
                <Copy className="h-4 w-4" />
                复制邀请链接
              </Button>
              <Link
                href={profile ? `/share/profile/${encodeURIComponent(profile.shareCode)}` : "/friends"}
                className={buttonStyles({ variant: "outline", className: "gap-2" })}
              >
                <Link2 className="h-4 w-4" />
                我的战绩卡
              </Link>
              <Button variant="outline" onClick={() => void shareInviteLink()} className="gap-2">
                <Share2 className="h-4 w-4" />
                系统分享
              </Button>
            </div>
            <p className="text-sm leading-7 text-sky-800/80">{hint}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>多方式适配</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            {[
              { label: "微信", text: "把复制好的链接发到微信，对方点开会直接进入浏览器页面。" },
              { label: "QQ", text: "QQ 里同样走普通网页链接，不依赖 App 内账号系统。" },
              { label: "浏览器", text: "直接在 Safari、Chrome、Edge 打开也能立即开始训练。" }
            ].map((item) => (
              <div key={item.label} className="rounded-[22px] bg-sky-50/90 p-4">
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700">
                  <Smartphone className="h-4 w-4" />
                  {item.label}
                </div>
                <p className="mt-2 text-sm leading-7 text-sky-800/80">{item.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>手动添加好友</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              value={manualLink}
              onChange={(event) => setManualLink(event.target.value)}
              placeholder="把朋友发来的邀请链接贴到这里"
              className="w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm text-sky-950"
            />
            <Button onClick={addFriendByManualLink} className="gap-2">
              <UserPlus className="h-4 w-4" />
              加到好友列表
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>我的好友</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {friends.length === 0 ? (
              <div className="rounded-[22px] bg-sky-50/90 p-4 text-sm text-sky-800/80">
                还没有好友。先把链接发出去，或者先把朋友发来的邀请链接贴进来。
              </div>
            ) : (
              friends.map((friend) => (
                <div key={friend.id} className="flex items-center justify-between gap-3 rounded-[22px] bg-sky-50/90 p-4">
                  <div>
                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700">
                      <Users className="h-4 w-4" />
                      {friend.name}
                    </div>
                    <div className="mt-1 text-sm text-sky-800/75">
                      来源：{friend.source} · 加入于 {new Date(friend.joinedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <Link href={`/friends/${encodeURIComponent(friend.shareCode)}`} className={buttonStyles({ variant: "outline", className: "gap-2 px-4 py-2 text-xs" })}>
                    <Link2 className="h-4 w-4" />
                    查看主页
                  </Link>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
