import { AppShell } from "@/components/app-shell";
import { FriendProfileView } from "@/components/friend-profile-view";
import { PageHero } from "@/components/page-hero";

export default async function FriendProfilePage({
  params
}: {
  params: Promise<{ shareCode: string }>;
}) {
  const { shareCode } = await params;

  return (
    <AppShell>
      <PageHero
        eyebrow="Friend detail"
        title="好友主页"
        description="这里是好友的云端打字主页。你可以直接看他的最好成绩、最近训练和和你之间的差距。"
      />
      <FriendProfileView shareCode={shareCode} />
    </AppShell>
  );
}
