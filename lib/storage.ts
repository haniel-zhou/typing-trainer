import {
  AppProgress,
  CustomExercise,
  ExternalTrack,
  FriendLink,
  FriendProfile,
  PersonalWordBank,
  RhythmSettings,
  ShareRecord,
  TrainerViewSettings,
  TrainingRecord,
  UploadedTrack
} from "@/lib/types";
import { DEFAULT_EXTERNAL_TRACKS } from "@/data/external-tracks";

const KEYS = {
  progress: "typing-trainer-progress",
  records: "typing-trainer-records",
  custom: "typing-trainer-custom",
  rhythm: "typing-trainer-rhythm",
  rhythmTracks: "typing-trainer-rhythm-tracks",
  externalTracks: "typing-trainer-external-tracks",
  friendProfile: "typing-trainer-friend-profile",
  friends: "typing-trainer-friends",
  wordBanks: "typing-trainer-word-banks",
  trainerView: "typing-trainer-trainer-view",
  dailyMissions: "typing-trainer-daily-missions",
  shareHistory: "typing-trainer-share-history"
};

const DB_NAME = "typing-trainer-media";
const DB_VERSION = 1;
const RHYTHM_TRACK_STORE = "rhythm-tracks";

export function loadProgress(): AppProgress {
  if (typeof window === "undefined") {
    return {
      level: 1,
      xp: 0,
      streak: 0,
      lastPracticeDate: null,
      totalCheckIns: 0,
      coins: 0,
      lastCheckInDate: null,
      seasonPoints: 0
    };
  }
  const raw = window.localStorage.getItem(KEYS.progress);
  const defaults: AppProgress = {
    level: 1,
    xp: 0,
    streak: 0,
    lastPracticeDate: null,
    totalCheckIns: 0,
    coins: 0,
    lastCheckInDate: null,
    seasonPoints: 0
  };
  if (!raw) return defaults;
  return { ...defaults, ...(JSON.parse(raw) as Partial<AppProgress>) };
}

export function saveProgress(progress: AppProgress) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEYS.progress, JSON.stringify(progress));
}

export function loadRecords(): TrainingRecord[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(KEYS.records);
  if (!raw) return [];
  return JSON.parse(raw) as TrainingRecord[];
}

export function saveRecords(records: TrainingRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEYS.records, JSON.stringify(records));
}

export function loadCustomExercises(): CustomExercise[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(KEYS.custom);
  if (!raw) return [];
  return JSON.parse(raw) as CustomExercise[];
}

export function saveCustomExercises(items: CustomExercise[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEYS.custom, JSON.stringify(items));
}

export function loadWordBanks(): PersonalWordBank[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(KEYS.wordBanks);
  if (!raw) return [];
  return JSON.parse(raw) as PersonalWordBank[];
}

export function saveWordBanks(items: PersonalWordBank[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEYS.wordBanks, JSON.stringify(items));
}

export function loadTrainerViewSettings(): TrainerViewSettings {
  const defaults: TrainerViewSettings = { theme: "default", smartAssistEnabled: false };
  if (typeof window === "undefined") return defaults;
  const raw = window.localStorage.getItem(KEYS.trainerView);
  if (!raw) return defaults;
  return { ...defaults, ...(JSON.parse(raw) as Partial<TrainerViewSettings>) };
}

export function saveTrainerViewSettings(settings: TrainerViewSettings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEYS.trainerView, JSON.stringify(settings));
}

export function loadDailyMissionState() {
  if (typeof window === "undefined") {
    return { date: "", claimedMissionIds: [] };
  }
  const raw = window.localStorage.getItem(KEYS.dailyMissions);
  if (!raw) return { date: "", claimedMissionIds: [] };
  return JSON.parse(raw) as { date: string; claimedMissionIds: string[] };
}

export function saveDailyMissionState(state: { date: string; claimedMissionIds: string[] }) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEYS.dailyMissions, JSON.stringify(state));
}

export function loadRhythmSettings(): RhythmSettings {
  const defaults: RhythmSettings = {
    volume: 0.55,
    musicEnabled: false,
    sfxEnabled: true
  };

  if (typeof window === "undefined") return defaults;
  const raw = window.localStorage.getItem(KEYS.rhythm);
  if (!raw) return defaults;

  return { ...defaults, ...(JSON.parse(raw) as Partial<RhythmSettings>) };
}

export function saveRhythmSettings(settings: RhythmSettings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEYS.rhythm, JSON.stringify(settings));
}

export function loadUploadedTracks(): UploadedTrack[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(KEYS.rhythmTracks);
  if (!raw) return [];
  return JSON.parse(raw) as UploadedTrack[];
}

function saveUploadedTrackMeta(items: UploadedTrack[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEYS.rhythmTracks, JSON.stringify(items));
}

export function loadExternalTracks(): ExternalTrack[] {
  if (typeof window === "undefined") return DEFAULT_EXTERNAL_TRACKS;
  const raw = window.localStorage.getItem(KEYS.externalTracks);
  if (!raw) return DEFAULT_EXTERNAL_TRACKS;

  const parsed = JSON.parse(raw) as ExternalTrack[];
  const merged = [...parsed];

  DEFAULT_EXTERNAL_TRACKS.forEach((item) => {
    if (!merged.some((track) => track.id === item.id)) {
      merged.push(item);
    }
  });

  return merged;
}

function saveExternalTrackMeta(items: ExternalTrack[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEYS.externalTracks, JSON.stringify(items));
}

export function saveExternalTrack(track: ExternalTrack) {
  if (typeof window === "undefined") return;
  const existing = loadExternalTracks();
  const next = [track, ...existing.filter((item) => item.id !== track.id)].slice(0, 24);
  saveExternalTrackMeta(next);
}

export function deleteExternalTrack(id: string) {
  if (typeof window === "undefined") return;
  const next = loadExternalTracks().filter((item) => item.id !== id || item.id === "apple-megalovania");
  saveExternalTrackMeta(next);
}

function createShareCode() {
  return `tt-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}

export function loadFriendProfile(): FriendProfile {
  const defaults: FriendProfile = {
    id: "me",
    name: "我的打字主页",
    shareCode: createShareCode(),
    updatedAt: new Date().toISOString()
  };

  if (typeof window === "undefined") return defaults;
  const raw = window.localStorage.getItem(KEYS.friendProfile);
  if (!raw) {
    window.localStorage.setItem(KEYS.friendProfile, JSON.stringify(defaults));
    return defaults;
  }

  const parsed = { ...defaults, ...(JSON.parse(raw) as Partial<FriendProfile>) };
  if (!parsed.shareCode) {
    parsed.shareCode = createShareCode();
  }
  return parsed;
}

export function saveFriendProfile(profile: FriendProfile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEYS.friendProfile, JSON.stringify(profile));
}

export function loadFriends(): FriendLink[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(KEYS.friends);
  if (!raw) return [];
  return JSON.parse(raw) as FriendLink[];
}

export function saveFriends(items: FriendLink[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEYS.friends, JSON.stringify(items));
}

export function upsertFriend(friend: FriendLink) {
  if (typeof window === "undefined") return;
  const existing = loadFriends();
  const next = [friend, ...existing.filter((item) => item.shareCode !== friend.shareCode)].slice(0, 50);
  saveFriends(next);
}

export function loadShareHistory(): ShareRecord[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(KEYS.shareHistory);
  if (!raw) return [];
  return JSON.parse(raw) as ShareRecord[];
}

export function saveShareHistory(items: ShareRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEYS.shareHistory, JSON.stringify(items));
}

export function appendShareHistory(item: ShareRecord) {
  if (typeof window === "undefined") return;
  const next = [item, ...loadShareHistory()].slice(0, 24);
  saveShareHistory(next);
}

function openMediaDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(RHYTHM_TRACK_STORE)) {
        db.createObjectStore(RHYTHM_TRACK_STORE, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveUploadedTrack(track: UploadedTrack, blob: Blob) {
  if (typeof window === "undefined") return;

  const existing = loadUploadedTracks();
  const next = [track, ...existing.filter((item) => item.id !== track.id)].slice(0, 24);
  saveUploadedTrackMeta(next);

  const db = await openMediaDatabase();

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(RHYTHM_TRACK_STORE, "readwrite");
    tx.objectStore(RHYTHM_TRACK_STORE).put({ id: track.id, blob });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });

  db.close();
}

export async function loadUploadedTrackBlob(id: string): Promise<Blob | null> {
  if (typeof window === "undefined") return null;
  const db = await openMediaDatabase();

  const result = await new Promise<Blob | null>((resolve, reject) => {
    const tx = db.transaction(RHYTHM_TRACK_STORE, "readonly");
    const request = tx.objectStore(RHYTHM_TRACK_STORE).get(id);
    request.onsuccess = () => resolve((request.result?.blob as Blob | undefined) ?? null);
    request.onerror = () => reject(request.error);
  });

  db.close();
  return result;
}

export async function deleteUploadedTrack(id: string) {
  if (typeof window === "undefined") return;

  saveUploadedTrackMeta(loadUploadedTracks().filter((item) => item.id !== id));
  const db = await openMediaDatabase();

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(RHYTHM_TRACK_STORE, "readwrite");
    tx.objectStore(RHYTHM_TRACK_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });

  db.close();
}
