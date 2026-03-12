"use client";

import {
  AchievementBadge,
  AchievementUnlock,
  AppProgress,
  DailyMissionState,
  DuelAttempt,
  DuelSession,
  FriendLink,
  FriendProfile,
  FriendSnapshot,
  LeaderboardEntry,
  PersonalWordBank,
  SeasonLeaderboardEntry,
  TrainingRecord
} from "@/lib/types";

async function parseJson<T>(response: Response, fallback: T): Promise<T> {
  try {
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export async function syncCloudProfile(profile: FriendProfile, progress?: AppProgress) {
  try {
    await fetch("/api/cloud/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, progress })
    });
  } catch {
    // Keep local-first behavior when cloud is unavailable.
  }
}

export async function syncCloudFriends(ownerShareCode: string, friends: FriendLink[]) {
  try {
    await fetch("/api/cloud/friends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ownerShareCode, friends })
    });
  } catch {
    // Keep local-first behavior when cloud is unavailable.
  }
}

export async function acceptCloudFriend(ownerProfile: FriendProfile, friend: FriendLink, ownerInviteUrl: string) {
  try {
    await fetch("/api/cloud/friends/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ownerProfile, friend, ownerInviteUrl })
    });
  } catch {
    // Keep local-first behavior when cloud is unavailable.
  }
}

export async function pullCloudFriends(ownerShareCode: string): Promise<FriendLink[]> {
  try {
    const response = await fetch(`/api/cloud/friends?shareCode=${encodeURIComponent(ownerShareCode)}`, {
      cache: "no-store"
    });
    if (!response.ok) return [];
    const data = await parseJson<{ friends: FriendLink[] }>(response, { friends: [] });
    return data.friends;
  } catch {
    return [];
  }
}

export async function syncCloudRecords(
  shareCode: string,
  profileName: string,
  records: TrainingRecord[],
  progress?: AppProgress
) {
  try {
    await fetch("/api/cloud/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shareCode, profileName, records, progress })
    });
  } catch {
    // Keep local-first behavior when cloud is unavailable.
  }
}

export async function fetchCloudLeaderboard(limit = 20, shareCodes?: string[]): Promise<LeaderboardEntry[]> {
  try {
    const params = new URLSearchParams({ limit: String(limit) });
    if (shareCodes?.length) {
      params.set("codes", shareCodes.join(","));
    }
    const response = await fetch(`/api/cloud/leaderboard?${params.toString()}`, {
      cache: "no-store"
    });
    if (!response.ok) return [];
    const data = await parseJson<{ entries: LeaderboardEntry[] }>(response, { entries: [] });
    return data.entries;
  } catch {
    return [];
  }
}

export async function fetchCloudSeasonLeaderboard(
  limit = 20,
  shareCodes?: string[]
): Promise<SeasonLeaderboardEntry[]> {
  try {
    const params = new URLSearchParams({ limit: String(limit) });
    if (shareCodes?.length) {
      params.set("codes", shareCodes.join(","));
    }
    const response = await fetch(`/api/cloud/season?${params.toString()}`, {
      cache: "no-store"
    });
    if (!response.ok) return [];
    const data = await parseJson<{ entries: SeasonLeaderboardEntry[] }>(response, { entries: [] });
    return data.entries;
  } catch {
    return [];
  }
}

export async function fetchCloudDailyMissionState(
  shareCode: string,
  date: string
): Promise<DailyMissionState | null> {
  try {
    const params = new URLSearchParams({ shareCode, date });
    const response = await fetch(`/api/cloud/missions?${params.toString()}`, { cache: "no-store" });
    if (!response.ok) return null;
    const data = await parseJson<{ state: DailyMissionState | null }>(response, { state: null });
    return data.state;
  } catch {
    return null;
  }
}

export async function syncCloudDailyMissionState(shareCode: string, state: DailyMissionState) {
  try {
    await fetch("/api/cloud/missions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shareCode, state })
    });
  } catch {
    // Keep local-first behavior when cloud is unavailable.
  }
}

export async function pullCloudWordBanks(shareCode: string): Promise<PersonalWordBank[]> {
  try {
    const response = await fetch(`/api/cloud/word-banks?shareCode=${encodeURIComponent(shareCode)}`, {
      cache: "no-store"
    });
    if (!response.ok) return [];
    const data = await parseJson<{ items: PersonalWordBank[] }>(response, { items: [] });
    return data.items;
  } catch {
    return [];
  }
}

export async function syncCloudWordBanks(shareCode: string, items: PersonalWordBank[]) {
  try {
    await fetch("/api/cloud/word-banks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shareCode, items })
    });
  } catch {
    // Keep local-first behavior when cloud is unavailable.
  }
}

export async function pullCloudAchievements(shareCode: string): Promise<AchievementUnlock[]> {
  try {
    const response = await fetch(`/api/cloud/achievements?shareCode=${encodeURIComponent(shareCode)}`, {
      cache: "no-store"
    });
    if (!response.ok) return [];
    const data = await parseJson<{ items: AchievementUnlock[] }>(response, { items: [] });
    return data.items;
  } catch {
    return [];
  }
}

export async function syncCloudAchievements(shareCode: string, badges: AchievementBadge[]) {
  try {
    await fetch("/api/cloud/achievements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shareCode, badges })
    });
  } catch {
    // Keep local-first behavior when cloud is unavailable.
  }
}

export async function fetchFriendSnapshot(shareCode: string): Promise<FriendSnapshot | null> {
  try {
    const response = await fetch(`/api/cloud/profile/${encodeURIComponent(shareCode)}`, {
      cache: "no-store"
    });
    if (!response.ok) return null;
    const data = await parseJson<{ snapshot: FriendSnapshot | null }>(response, { snapshot: null });
    return data.snapshot;
  } catch {
    return null;
  }
}

export async function createCloudDuel(
  challenger: FriendProfile,
  opponent: { shareCode: string; name: string }
): Promise<DuelSession | null> {
  try {
    const response = await fetch("/api/cloud/duels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challenger, opponent })
    });
    if (!response.ok) return null;
    const data = await parseJson<{ session: DuelSession | null }>(response, { session: null });
    return data.session;
  } catch {
    return null;
  }
}

export async function submitCloudDuelAttempt(duelId: string, attempt: DuelAttempt) {
  try {
    await fetch(`/api/cloud/duels/${encodeURIComponent(duelId)}/attempt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attempt })
    });
  } catch {
    // Keep local-first behavior when cloud is unavailable.
  }
}
