"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  AudioLines,
  ExternalLink,
  Link2,
  Music4,
  Pause,
  Play,
  Square,
  Trash2,
  Upload,
  Volume2
} from "lucide-react";
import { estimateBpm } from "@/lib/audio";
import {
  deleteExternalTrack,
  deleteUploadedTrack,
  loadExternalTracks,
  loadRhythmSettings,
  loadUploadedTrackBlob,
  loadUploadedTracks,
  saveExternalTrack,
  saveRhythmSettings,
  saveUploadedTrack
} from "@/lib/storage";
import { ExternalTrack, RhythmSettings, UploadedTrack } from "@/lib/types";

type Props = {
  combo: number;
  lastTypedState: "correct" | "wrong" | null;
  onBeatPulse?: () => void;
};

const DEFAULT_SETTINGS: RhythmSettings = {
  uploadedTrackId: undefined,
  volume: 0.55,
  musicEnabled: false,
  sfxEnabled: true
};

const SFX_ROOT_HZ = 196;

type WebkitWindow = Window & {
  webkitAudioContext?: typeof AudioContext;
};

function playTypingSfx(
  ctx: AudioContext,
  type: "correct" | "wrong",
  volume: number,
  combo: number
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type === "correct" ? "triangle" : "sawtooth";
  osc.frequency.setValueAtTime(
    type === "correct" ? SFX_ROOT_HZ * 4 : SFX_ROOT_HZ * 1.8,
    ctx.currentTime
  );

  if (type === "correct") {
    osc.frequency.exponentialRampToValueAtTime(
      SFX_ROOT_HZ * (combo >= 8 ? 6 : 4.8),
      ctx.currentTime + 0.06
    );
  } else {
    osc.frequency.exponentialRampToValueAtTime(SFX_ROOT_HZ * 1.1, ctx.currentTime + 0.08);
  }

  gain.gain.setValueAtTime(type === "correct" ? volume * 0.08 : volume * 0.06, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    ctx.currentTime + (type === "correct" ? 0.08 : 0.12)
  );

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + (type === "correct" ? 0.09 : 0.13));
}

export function RhythmStation({ combo, lastTypedState, onBeatPulse }: Props) {
  const [settings, setSettings] = useState<RhythmSettings>(DEFAULT_SETTINGS);
  const [hasLoadedSettings, setHasLoadedSettings] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [beatIndex, setBeatIndex] = useState(0);
  const [uploadedTracks, setUploadedTracks] = useState<UploadedTrack[]>([]);
  const [externalTracks, setExternalTracks] = useState<ExternalTrack[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [linkArtist, setLinkArtist] = useState("");

  const audioContextRef = useRef<AudioContext | null>(null);
  const beatIntervalRef = useRef<number | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedTrack = useMemo(
    () => uploadedTracks.find((item) => item.id === settings.uploadedTrackId) ?? null,
    [settings.uploadedTrackId, uploadedTracks]
  );
  const beatWindowMs = selectedTrack ? Math.round(60000 / selectedTrack.bpm) : 0;

  useEffect(() => {
    setSettings(loadRhythmSettings());
    setUploadedTracks(loadUploadedTracks());
    setExternalTracks(loadExternalTracks());
    setHasLoadedSettings(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedSettings) return;
    saveRhythmSettings(settings);
  }, [hasLoadedSettings, settings]);

  useEffect(() => {
    return () => {
      stopAudio();
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!lastTypedState || !settings.sfxEnabled) return;

    void ensureAudioContext()
      .then((ctx) => {
        playTypingSfx(ctx, lastTypedState, settings.volume, combo);
      })
      .catch(() => undefined);
  }, [combo, lastTypedState, settings.sfxEnabled, settings.volume]);

  useEffect(() => {
    if (!audioElementRef.current) return;
    audioElementRef.current.volume = settings.musicEnabled ? settings.volume : 0;
  }, [settings.musicEnabled, settings.volume]);

  async function ensureAudioContext() {
    if (audioContextRef.current) {
      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
      }
      return audioContextRef.current;
    }

    const AudioCtor = window.AudioContext || (window as WebkitWindow).webkitAudioContext;
    if (!AudioCtor) {
      throw new Error("AudioContext is not supported in this browser.");
    }
    const ctx = new AudioCtor();
    audioContextRef.current = ctx;
    return ctx;
  }

  function clearBeatMeter() {
    if (beatIntervalRef.current) {
      window.clearInterval(beatIntervalRef.current);
      beatIntervalRef.current = null;
    }
    setBeatIndex(0);
  }

  function startBeatMeter(bpm: number) {
    clearBeatMeter();
    onBeatPulse?.();
    beatIntervalRef.current = window.setInterval(() => {
      setBeatIndex((prev) => (prev + 1) % 4);
      onBeatPulse?.();
    }, (60 / bpm) * 1000);
  }

  function stopAudio() {
    clearBeatMeter();
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  }

  function updateSettings(next: Partial<RhythmSettings>) {
    setSettings((prev) => ({ ...prev, ...next }));
  }

  async function playSelectedTrack() {
    if (!selectedTrack) {
      setError("先上传一首自己的音乐，再开启播放。");
      return;
    }

    try {
      await ensureAudioContext();
      setError(null);

      const blob = await loadUploadedTrackBlob(selectedTrack.id);
      if (!blob) {
        setError("这首音乐的本地文件不见了，请重新上传。");
        return;
      }

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }

      const url = URL.createObjectURL(blob);
      objectUrlRef.current = url;
      const audio = audioElementRef.current ?? new Audio();
      audioElementRef.current = audio;
      audio.src = url;
      audio.loop = true;
      audio.volume = settings.musicEnabled ? settings.volume : 0;
      audio.currentTime = 0;

      if (settings.musicEnabled) {
        await audio.play();
      }

      setIsPlaying(true);
      startBeatMeter(selectedTrack.bpm);
    } catch {
      setError("这首音乐暂时无法播放，请换一个文件试试。");
      setIsPlaying(false);
    }
  }

  async function togglePlay() {
    if (!selectedTrack) {
      setError("先上传一首自己的音乐，再开启播放。");
      return;
    }

    try {
      await ensureAudioContext();
      setError(null);

      if (!audioElementRef.current || audioElementRef.current.src === "" || !isPlaying) {
        updateSettings({ musicEnabled: true });
        await playSelectedTrack();
        return;
      }

      if (audioElementRef.current.paused) {
        updateSettings({ musicEnabled: true });
        await audioElementRef.current.play();
        setIsPlaying(true);
        startBeatMeter(selectedTrack.bpm);
        return;
      }

      audioElementRef.current.pause();
      clearBeatMeter();
      setIsPlaying(false);
    } catch {
      setError("浏览器拦截了播放，请再点一次播放。");
    }
  }

  async function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      setError("请上传 mp3、wav、m4a 等音频文件。");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError("单个音频文件请控制在 20MB 以内。");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const ctx = await ensureAudioContext();
      const arrayBuffer = await file.arrayBuffer();
      const decoded = await ctx.decodeAudioData(arrayBuffer.slice(0));
      const bpm = estimateBpm(decoded);
      const track: UploadedTrack = {
        id: String(Date.now()),
        name: file.name.replace(/\.[^/.]+$/, ""),
        bpm,
        duration: Math.round(decoded.duration),
        createdAt: new Date().toISOString(),
        type: file.type,
        size: file.size
      };

      await saveUploadedTrack(track, file);
      const nextTracks = loadUploadedTracks();
      setUploadedTracks(nextTracks);
      updateSettings({ uploadedTrackId: track.id, musicEnabled: true });
      await playSelectedTrack();
    } catch {
      setError("音频分析失败，这首歌可能编码不兼容。");
    } finally {
      setIsAnalyzing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function removeTrack(id: string) {
    const wasSelected = settings.uploadedTrackId === id;
    await deleteUploadedTrack(id);
    const nextTracks = loadUploadedTracks();
    setUploadedTracks(nextTracks);

    if (wasSelected) {
      stopAudio();
      updateSettings({ uploadedTrackId: nextTracks[0]?.id, musicEnabled: false });
    }
  }

  function deriveTitleFromUrl(url: string) {
    try {
      const parsed = new URL(url);
      const segments = parsed.pathname.split("/").filter(Boolean);
      const songSegment = segments[segments.length - 2];
      if (!songSegment) return "";
      return songSegment
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
    } catch {
      return "";
    }
  }

  function isAppleMusicUrl(url: string) {
    try {
      const parsed = new URL(url);
      return parsed.hostname.includes("music.apple.com");
    } catch {
      return false;
    }
  }

  function addExternalTrack() {
    const nextUrl = linkUrl.trim();
    if (!nextUrl) {
      setError("先贴一个 Apple Music 链接。");
      return;
    }

    if (!isAppleMusicUrl(nextUrl)) {
      setError("目前只支持 Apple Music 链接。");
      return;
    }

    const title = linkTitle.trim() || deriveTitleFromUrl(nextUrl) || "未命名曲目";
    const artist = linkArtist.trim() || "Apple Music";
    const track: ExternalTrack = {
      id: String(Date.now()),
      provider: "apple-music",
      url: nextUrl,
      title,
      artist,
      createdAt: new Date().toISOString()
    };

    saveExternalTrack(track);
    setExternalTracks(loadExternalTracks());
    setLinkUrl("");
    setLinkTitle("");
    setLinkArtist("");
    setError(null);
  }

  function openExternalTrack(url: string) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function removeExternalTrack(id: string) {
    deleteExternalTrack(id);
    setExternalTracks(loadExternalTracks());
  }

  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-950 px-4 py-4 text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
            我的音乐
          </div>
          <div className="mt-2 truncate text-base font-semibold">
            {selectedTrack?.name ?? "还没有选择音频"}
          </div>
          <div className="mt-1 text-xs text-slate-300">
            {selectedTrack ? `${selectedTrack.bpm} BPM · ${selectedTrack.duration}s` : "上传自己的音频，节拍会跟着它走。"}
          </div>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/16">
          <Upload className="h-4 w-4" />
          {isAnalyzing ? "分析中" : "上传"}
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isAnalyzing}
          />
        </label>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={togglePlay}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isPlaying ? "暂停" : "播放"}
        </button>
        <button
          type="button"
          onClick={stopAudio}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/16"
        >
          <Square className="h-4 w-4" />
          停止
        </button>
        <button
          type="button"
          onClick={() => updateSettings({ sfxEnabled: !settings.sfxEnabled })}
          className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
            settings.sfxEnabled ? "bg-rose-500 text-white" : "bg-white/10 text-slate-200"
          }`}
        >
          <AudioLines className="h-4 w-4" />
          按键音
        </button>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition ${
              beatIndex === index && isPlaying ? "bg-emerald-400" : "bg-white/10"
            }`}
          />
        ))}
      </div>

      <div className="mt-4 rounded-[20px] bg-white/8 p-3">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-200">
          <span className="inline-flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            音量
          </span>
          <span>{Math.round(settings.volume * 100)}%</span>
        </div>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.05"
          value={settings.volume}
          onChange={(event) => updateSettings({ volume: Number(event.target.value), musicEnabled: true })}
          className="w-full accent-emerald-400"
        />
        <p className="mt-2 text-xs leading-6 text-slate-300">
          {selectedTrack ? `当前每拍约 ${beatWindowMs}ms。` : "先上传自己的音乐，再跟着节拍打字。"}
        </p>
      </div>

      <details className="mt-4 rounded-[20px] bg-white/6 p-3">
        <summary className="cursor-pointer list-none text-sm font-semibold text-white">
          管理自定义音乐
        </summary>
        <div className="mt-3 space-y-2">
          {uploadedTracks.length === 0 ? (
            <div className="rounded-2xl bg-white/8 px-3 py-3 text-sm text-slate-300">
              还没有上传音频。
            </div>
          ) : (
            uploadedTracks.map((track) => (
              <div
                key={track.id}
                className={`flex items-center justify-between gap-3 rounded-2xl px-3 py-3 ${
                  settings.uploadedTrackId === track.id ? "bg-white text-slate-950" : "bg-white/8 text-slate-100"
                }`}
              >
                <button
                  type="button"
                  onClick={() => updateSettings({ uploadedTrackId: track.id })}
                  className="min-w-0 flex-1 cursor-pointer text-left"
                >
                  <div className="truncate text-sm font-semibold">{track.name}</div>
                  <div className="mt-1 text-xs opacity-75">{track.bpm} BPM · {track.duration}s</div>
                </button>
                <button
                  type="button"
                  onClick={() => void removeTrack(track.id)}
                  className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl bg-black/10 text-current transition hover:bg-black/15"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </details>

      <details className="mt-3 rounded-[20px] bg-white/6 p-3">
        <summary className="cursor-pointer list-none text-sm font-semibold text-white">
          外部音乐链接
        </summary>
        <div className="mt-3 space-y-3">
          <div className="rounded-2xl border border-white/12 bg-white/6 p-3">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-white">
              <Link2 className="h-4 w-4" />
              Apple Music 链接
            </div>
            <p className="mt-1 text-xs leading-6 text-slate-300">
              这里只保留跳转卡片，不占训练主视图。
            </p>
            <div className="mt-3 grid gap-2">
              <input
                type="url"
                value={linkUrl}
                onChange={(event) => setLinkUrl(event.target.value)}
                placeholder="粘贴 Apple Music 链接"
                className="w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white placeholder:text-slate-400"
              />
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  type="text"
                  value={linkTitle}
                  onChange={(event) => setLinkTitle(event.target.value)}
                  placeholder="曲名（可不填）"
                  className="w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white placeholder:text-slate-400"
                />
                <input
                  type="text"
                  value={linkArtist}
                  onChange={(event) => setLinkArtist(event.target.value)}
                  placeholder="歌手（可不填）"
                  className="w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white placeholder:text-slate-400"
                />
              </div>
              <button
                type="button"
                onClick={addExternalTrack}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400"
              >
                添加到链接歌单
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {externalTracks.map((track) => (
              <div
                key={track.id}
                className="flex items-center justify-between gap-3 rounded-2xl bg-white/8 px-3 py-3 text-slate-100"
              >
                <button
                  type="button"
                  onClick={() => openExternalTrack(track.url)}
                  className="min-w-0 flex-1 cursor-pointer text-left"
                >
                  <div className="truncate text-sm font-semibold">{track.title}</div>
                  <div className="mt-1 truncate text-xs text-slate-300">
                    {track.artist}
                    {track.album ? ` · ${track.album}` : ""}
                  </div>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openExternalTrack(track.url)}
                    className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl bg-white/10 text-current transition hover:bg-white/16"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeExternalTrack(track.id)}
                    className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl bg-black/10 text-current transition hover:bg-black/15"
                    disabled={track.id === "apple-megalovania"}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </details>

      {error ? (
        <div className="mt-3 rounded-2xl bg-rose-500/14 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      ) : null}
    </div>
  );
}
