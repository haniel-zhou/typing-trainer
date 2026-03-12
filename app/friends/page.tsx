import { AppShell } from "@/components/app-shell";
import { FriendsHub } from "@/components/friends-hub";
import { PageHero } from "@/components/page-hero";

export default async function FriendsPage({
  searchParams
}: {
  searchParams: Promise<{ invite?: string; name?: string }>;
}) {
  const params = await searchParams;
  const inviteCode = params.invite;
  const inviteName = params.name;

  return (
    <AppShell>
      <PageHero
        eyebrow="Friends mode"
        title="好友与邀请"
        description="这个页面只走普通网页链接。你把邀请链接发给朋友，对方在微信、QQ 或任何浏览器里点开，都能直接进入网页开始用。"
      />
      <FriendsHub inviteCode={inviteCode} inviteName={inviteName} />
    </AppShell>
  );
}
