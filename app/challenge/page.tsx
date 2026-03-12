"use client";

import { useEffect, useMemo, useState } from "react";
import { Flame, Shield, Sword, Trophy, Users } from "lucide-react";
import { BossChallengeCard } from "@/components/boss-challenge-card";
import { ChallengeCard } from "@/components/challenge-card";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { PageHero } from "@/components/page-hero";
import { AppShell } from "@/components/app-shell";
import { SeasonRankPanel } from "@/components/season-rank-panel";
import { SeasonLeaderboardTable } from "@/components/season-leaderboard-table";
import {
  BOSS_CHALLENGES,
  SEASON_FRIENDS_LEADERBOARD,
  SEASON_GLOBAL_LEADERBOARD
} from "@/data/boss-challenges";
import { CHALLENGES, FRIENDS_LEADERBOARD, GLOBAL_LEADERBOARD } from "@/data/challenges";
import { fetchCloudLeaderboard, fetchCloudSeasonLeaderboard } from "@/lib/cloud";
import { loadFriendProfile, loadFriends, loadProgress, loadRecords } from "@/lib/storage";
import { LeaderboardEntry, SeasonLeaderboardEntry, TrainingRecord } from "@/lib/types";

function buildPersonalEntry(records: TrainingRecord[]): LeaderboardEntry | null {
  const challengeRecords = records.filter((item) => item.mode === "challenge");
  if (challengeRecords.length === 0) return null;

  const best = challengeRecords.reduce((current, next) => (next.wpm > current.wpm ? next : current));

  return {
    id: "me",
    name: "你",
    country: "CN",
    wpm: best.wpm,
    accuracy: best.accuracy,
    streak: Math.max(1, challengeRecords.length),
    badge: "本地最佳"
  };
}

export default function ChallengePage() {
  const [records, setRecords] = useState<TrainingRecord[]>([]);
  const [seasonPoints, setSeasonPoints] = useState(0);
  const [cloudGlobalBoard, setCloudGlobalBoard] = useState<LeaderboardEntry[]>([]);
  const [cloudFriendsBoard, setCloudFriendsBoard] = useState<LeaderboardEntry[]>([]);
  const [cloudSeasonGlobalBoard, setCloudSeasonGlobalBoard] = useState<SeasonLeaderboardEntry[]>([]);
  const [cloudSeasonFriendsBoard, setCloudSeasonFriendsBoard] = useState<SeasonLeaderboardEntry[]>([]);

  useEffect(() => {
    const localRecords = loadRecords();
    const progress = loadProgress();
    const profile = loadFriendProfile();
    const friends = loadFriends();
    setRecords(localRecords);
    setSeasonPoints(progress.seasonPoints);

    void fetchCloudLeaderboard(20).then((entries) => {
      if (entries.length > 0) {
        setCloudGlobalBoard(entries);
      }
    });

    void fetchCloudLeaderboard(
      20,
      [profile.shareCode, ...friends.map((item) => item.shareCode)]
    ).then((entries) => {
      if (entries.length > 0) {
        setCloudFriendsBoard(entries);
      }
    });

    void fetchCloudSeasonLeaderboard(20).then((entries) => {
      if (entries.length > 0) {
        setCloudSeasonGlobalBoard(entries);
      }
    });

    void fetchCloudSeasonLeaderboard(
      20,
      [profile.shareCode, ...friends.map((item) => item.shareCode)]
    ).then((entries) => {
      if (entries.length > 0) {
        setCloudSeasonFriendsBoard(entries);
      }
    });
  }, []);

  const challengeRecords = useMemo(
    () => records.filter((item) => item.mode === "challenge"),
    [records]
  );
  const bossRecords = useMemo(() => records.filter((item) => item.mode === "boss"), [records]);
  const personalEntry = useMemo(() => buildPersonalEntry(records), [records]);
  const friendsBoard = useMemo(() => {
    if (cloudFriendsBoard.length > 0) return cloudFriendsBoard;
    if (!personalEntry) return FRIENDS_LEADERBOARD;
    return [...FRIENDS_LEADERBOARD, personalEntry].sort((a, b) => b.wpm - a.wpm);
  }, [cloudFriendsBoard, personalEntry]);
  const globalBoard = cloudGlobalBoard.length > 0 ? cloudGlobalBoard : GLOBAL_LEADERBOARD;
  const seasonFriendsBoard = cloudSeasonFriendsBoard.length > 0 ? cloudSeasonFriendsBoard : SEASON_FRIENDS_LEADERBOARD;
  const seasonGlobalBoard = cloudSeasonGlobalBoard.length > 0 ? cloudSeasonGlobalBoard : SEASON_GLOBAL_LEADERBOARD;
  const bestChallengeWpm = challengeRecords.length
    ? Math.max(...challengeRecords.map((item) => item.wpm))
    : 0;
  const bossClearCount = BOSS_CHALLENGES.filter((item) =>
    bossRecords.some(
      (record) =>
        record.challengeId === item.id &&
        record.wpm >= item.goalWpm &&
        record.accuracy >= item.goalAccuracy
    )
  ).length;
  const duelWins = records.filter((item) => item.mode === "duel" && item.accuracy >= 95).length;

  function getChallengeBest(challengeId: string) {
    const items = challengeRecords.filter((item) => item.challengeId === challengeId);
    if (items.length === 0) return undefined;
    return items.reduce((current, next) => (next.wpm > current.wpm ? next : current));
  }

  function isChallengeCleared(challengeId: string) {
    const challenge = CHALLENGES.find((item) => item.id === challengeId);
    if (!challenge) return false;

    return challengeRecords.some(
      (item) =>
        item.challengeId === challengeId &&
        item.wpm >= challenge.goalWpm &&
        item.accuracy >= challenge.goalAccuracy
    );
  }

  function getBossBest(challengeId: string) {
    const items = bossRecords.filter((item) => item.challengeId === challengeId);
    if (items.length === 0) return undefined;
    return items.reduce((current, next) => (next.wpm > current.wpm ? next : current));
  }

  function isBossCleared(challengeId: string) {
    const challenge = BOSS_CHALLENGES.find((item) => item.id === challengeId);
    if (!challenge) return false;

    return bossRecords.some(
      (item) =>
        item.challengeId === challengeId &&
        item.wpm >= challenge.goalWpm &&
        item.accuracy >= challenge.goalAccuracy
    );
  }

  const completedChallenges = CHALLENGES.filter((item) => isChallengeCleared(item.id)).length;

  return (
    <AppShell>
      <PageHero
        eyebrow="Compete mode"
        title="排行榜与挑战"
        description="这里不只是展示排名。每个挑战现在都能直接进入真实训练，你的最好成绩会回写到本地榜单，形成自己的追赶目标。"
        aside={
          <>
            <div className="rounded-[24px] bg-white/70 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm text-sky-600/70">
                <Users className="h-4 w-4" />
                好友榜
              </div>
              <div className="font-display text-3xl text-sky-950">{friendsBoard.length} 人上榜</div>
            </div>
            <div className="rounded-[24px] bg-white/70 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm text-sky-600/70">
                <Trophy className="h-4 w-4" />
                你的最佳挑战速度
              </div>
              <div className="font-display text-3xl text-sky-950">{bestChallengeWpm} WPM</div>
            </div>
            <div className="rounded-[24px] bg-white/70 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm text-sky-600/70">
                <Sword className="h-4 w-4" />
                已通关挑战
              </div>
              <div className="font-display text-3xl text-sky-950">{completedChallenges} / 3</div>
            </div>
            <div className="rounded-[24px] bg-white/70 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm text-sky-600/70">
                <Flame className="h-4 w-4" />
                已击败 Boss
              </div>
              <div className="font-display text-3xl text-sky-950">{bossClearCount} / 3</div>
            </div>
          </>
        }
      />

      <div className="grid items-start gap-6 lg:grid-cols-3">
        {CHALLENGES.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            personalBest={getChallengeBest(challenge.id)}
            cleared={isChallengeCleared(challenge.id)}
          />
        ))}
      </div>

      <SeasonRankPanel
        seasonPoints={seasonPoints}
        challengeWins={completedChallenges}
        duelWins={duelWins}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <SeasonLeaderboardTable
          title="好友赛季榜"
          description={
            cloudSeasonFriendsBoard.length > 0
              ? "这里显示你和好友的赛季积分进度。"
              : "还没接到云端数据时，这里会先用示例赛季榜撑起产品体验。"
          }
          entries={seasonFriendsBoard}
        />
        <SeasonLeaderboardTable
          title="全球赛季榜"
          description={
            cloudSeasonGlobalBoard.length > 0
              ? "全球赛季榜按赛季积分排序，适合看谁在当前赛季更活跃。"
              : "全球赛季榜会在接到云端数据后自动替换。"
          }
          entries={seasonGlobalBoard}
        />
      </div>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
          <Shield className="h-3.5 w-3.5" />
          Boss raid
        </div>
        <div className="max-w-3xl text-sm leading-7 text-sky-800/80">
          Boss 挑战不只是更长的文本，而是更高的目标速度、正确率和赛季分回报。适合把“练习”升级成真正的冲榜节点。
        </div>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-3">
        {BOSS_CHALLENGES.map((challenge) => (
          <BossChallengeCard
            key={challenge.id}
            challenge={challenge}
            personalBest={getBossBest(challenge.id)}
            cleared={isBossCleared(challenge.id)}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <LeaderboardTable
          title="好友榜"
          description={cloudFriendsBoard.length > 0 ? "这里已经走云端好友榜。" : "你的本地最佳成绩会自动加入榜单。现在这里已经不只是静态展示。"}
          entries={friendsBoard}
        />
        <LeaderboardTable
          title="全球榜"
          description={cloudGlobalBoard.length > 0 ? "全球榜现在优先显示云端成绩。" : "全球榜仍然是示例上限，用来给当前训练速度提供参照。"}
          entries={globalBoard}
        />
      </div>
    </AppShell>
  );
}
