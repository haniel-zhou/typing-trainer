"use client";

import clsx from "clsx";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  DoorOpen,
  Flame,
  Music4,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Target,
  Timer,
  Zap
} from "lucide-react";
import { RhythmStation } from "@/components/rhythm-station";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { submitCloudDuelAttempt, syncCloudAchievements, syncCloudRecords } from "@/lib/cloud";
import {
  loadCustomExercises,
  loadFriendProfile,
  loadProgress,
  loadRecords,
  loadTrainerViewSettings,
  saveProgress,
  saveRecords,
  saveTrainerViewSettings
} from "@/lib/storage";
import {
  analyzeTypingErrors,
  calculateAccuracy,
  calculateCoins,
  calculateSeasonPoints,
  calculateStars,
  calculateWPM,
  calculateXp,
  buildAchievementBadges,
  countCorrectChars,
  countWrongChars,
  getAutocompleteSuggestion,
  getTodayDateString,
  updateStreak
} from "@/lib/typing";
import {
  BossChallengeData,
  ChallengeCardData,
  DuelSession,
  Lesson,
  TrainingRecord,
  TypingSuggestion
} from "@/lib/types";
import { LESSONS } from "@/data/lessons";

type Props = {
  lesson?: Lesson;
  customId?: string;
  challenge?: ChallengeCardData;
  boss?: BossChallengeData;
  duel?: DuelSession | null;
};

type SessionConfig = {
  title: string;
  description: string;
  target: string;
  goalAccuracy: number;
  goalWpm: number;
  mode: "lesson" | "custom" | "challenge" | "duel" | "boss";
  challengeId?: string;
  duelId?: string;
  timeLimitSeconds?: number;
  reward?: string;
};

const COMBO_MILESTONE = 12;
const DEFAULT_PROGRESS = {
  level: 1,
  xp: 0,
  streak: 0,
  lastPracticeDate: null,
  totalCheckIns: 0,
  coins: 0,
  lastCheckInDate: null,
  seasonPoints: 0
};

function getNowTimestamp() {
  return Date.now();
}

function getInitialTrainerViewSettings() {
  return typeof window === "undefined"
    ? { theme: "default" as const, smartAssistEnabled: true }
    : loadTrainerViewSettings();
}

function buildSessionConfig({
  lesson,
  customId,
  challenge,
  boss,
  duel
}: Props): SessionConfig {
  const customItem =
    customId && typeof window !== "undefined"
      ? loadCustomExercises().find((item) => item.id === customId)
      : null;

  return {
    title: duel?.title ?? boss?.title ?? challenge?.title ?? customItem?.title ?? lesson?.title ?? "自由训练",
    description:
      duel?.description ??
      (boss ? `${boss.description} · Boss：${boss.bossName}` : undefined) ??
      challenge?.description ??
      lesson?.description ??
      "使用自定义文本进行训练。",
    target: duel?.content ?? boss?.content ?? challenge?.content ?? customItem?.content ?? lesson?.content ?? "asdf jkl",
    goalAccuracy: duel?.goalAccuracy ?? boss?.goalAccuracy ?? challenge?.goalAccuracy ?? lesson?.goalAccuracy ?? 95,
    goalWpm: duel?.goalWpm ?? boss?.goalWpm ?? challenge?.goalWpm ?? lesson?.goalWpm ?? 15,
    mode: duel ? "duel" : boss ? "boss" : challenge ? "challenge" : customId ? "custom" : lesson ? "lesson" : "custom",
    challengeId: boss?.id ?? challenge?.id,
    duelId: duel?.id,
    timeLimitSeconds: duel?.timeLimitSeconds ?? boss?.timeLimitSeconds ?? challenge?.timeLimitSeconds,
    reward: boss?.reward ?? challenge?.reward
  };
}

export function TrainerPanel({ lesson, customId, challenge, boss, duel }: Props) {
  const router = useRouter();
  const sessionConfig = useMemo(
    () => buildSessionConfig({ lesson, customId, challenge, boss, duel }),
    [boss, challenge, customId, duel, lesson]
  );

  const [input, setInput] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [finished, setFinished] = useState(false);
  const [combo, setCombo] = useState(0);
  const [stars, setStars] = useState(0);
  const [xpGained, setXpGained] = useState(0);
  const [coinsGained, setCoinsGained] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lastTypedIndex, setLastTypedIndex] = useState<number | null>(null);
  const [lastTypedState, setLastTypedState] = useState<"correct" | "wrong" | null>(null);
  const [burstToken, setBurstToken] = useState(0);
  const [progressState, setProgressState] = useState(() =>
    typeof window === "undefined" ? DEFAULT_PROGRESS : loadProgress()
  );
  const [recordHistory, setRecordHistory] = useState<TrainingRecord[]>(() =>
    typeof window === "undefined" ? [] : loadRecords()
  );
  const [beatPulseToken, setBeatPulseToken] = useState(0);
  const [viewTheme, setViewTheme] = useState<"default" | "eye-care" | "night">(
    () => getInitialTrainerViewSettings().theme
  );
  const [smartAssistEnabled, setSmartAssistEnabled] = useState(
    () => getInitialTrainerViewSettings().smartAssistEnabled
  );
  const [savedKeystrokes, setSavedKeystrokes] = useState(0);
  const [musicPanelOpen, setMusicPanelOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const { title, description, target, goalAccuracy, goalWpm, mode, challengeId, duelId, timeLimitSeconds, reward } = sessionConfig;
  const allowSmartAssist = mode === "custom";
  const isReady = !customId || typeof window !== "undefined";
  const level = progressState.level;
  const streak = progressState.streak;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    saveTrainerViewSettings({ theme: viewTheme, smartAssistEnabled });
  }, [smartAssistEnabled, viewTheme]);
  const lessonRecords = useMemo(() => {
    const currentLessonId = lesson?.id;
    return currentLessonId
      ? recordHistory.filter((item) => item.lessonId === currentLessonId)
      : recordHistory.filter((item) => item.title === title);
  }, [lesson?.id, recordHistory, title]);
  const bestLessonWpm = lessonRecords.length ? Math.max(...lessonRecords.map((item) => item.wpm)) : 0;
  const bestLessonAccuracy = lessonRecords.length
    ? Math.max(...lessonRecords.map((item) => item.accuracy))
    : 0;

  useEffect(() => {
    if (!startedAt || finished || paused) return;

    const timer = window.setInterval(() => {
      setElapsedSeconds(Math.max(1, Math.floor((Date.now() - startedAt) / 1000)));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [finished, paused, startedAt]);

  useEffect(() => {
    if (lastTypedIndex === null || !lastTypedState) return;

    const timer = window.setTimeout(() => {
      setLastTypedIndex(null);
      setLastTypedState(null);
    }, 260);

    return () => window.clearTimeout(timer);
  }, [lastTypedIndex, lastTypedState]);

  const seconds = startedAt ? Math.max(1, elapsedSeconds) : 1;
  const timerDisplay = timeLimitSeconds
    ? startedAt
      ? Math.max(0, timeLimitSeconds - Math.min(seconds, timeLimitSeconds))
      : timeLimitSeconds
    : seconds;
  const correctChars = useMemo(() => countCorrectChars(input, target), [input, target]);
  const wrongChars = useMemo(() => countWrongChars(input, target), [input, target]);
  const accuracy = calculateAccuracy(input, target);
  const wpm = calculateWPM(correctChars, seconds);
  const progressValue = Math.round((input.length / target.length) * 100);
  const currentExpected = target[input.length] || "";
  const activeKey = currentExpected === " " ? "SPACE" : currentExpected.toUpperCase() || null;
  const remainingChars = Math.max(0, target.length - input.length);
  const nextLesson = lesson ? LESSONS.find((item) => item.id === lesson.id + 1) : null;
  const upcomingText = target.slice(input.length, input.length + 28).replace(/ /g, "·");
  const comboProgress = Math.min(100, Math.round((combo / COMBO_MILESTONE) * 100));
  const accuracyProgress = Math.min(100, Math.round((accuracy / goalAccuracy) * 100));
  const speedProgress = Math.min(100, Math.round((wpm / goalWpm) * 100));
  const errorAnalysis = useMemo(
    () => analyzeTypingErrors(input, target.slice(0, input.length)),
    [input, target]
  );
  const typingSuggestion = useMemo<TypingSuggestion | null>(
    () => (allowSmartAssist && smartAssistEnabled ? getAutocompleteSuggestion(input, target) : null),
    [allowSmartAssist, input, smartAssistEnabled, target]
  );
  const comboStateLabel =
    combo >= COMBO_MILESTONE
      ? "满连击，继续保持这个节奏"
      : combo >= 8
        ? "火热手感，马上到满连击"
        : combo >= 4
          ? "节奏已建立，别急着提速"
          : "先把手感稳住，连击会自己出现";
  const focusTip =
    wrongChars === 0
      ? "手感很稳。继续盯着高亮字符打，不要抢下一个键。"
      : accuracy < goalAccuracy
        ? "这轮先以正确率为主，慢一点比乱冲更划算。"
        : "准确率已达标，可以轻微提速冲更高连击。";
  const stageLabel =
    mode === "duel"
      ? "Friend duel"
      : mode === "boss"
      ? `Boss raid ${reward ?? ""}`.trim()
      : mode === "challenge"
      ? `挑战奖励 ${reward ?? ""}`.trim()
      : mode === "lesson"
        ? "Focus mode"
        : "Custom practice";

  function triggerTypingEffect(index: number, isCorrect: boolean, nextCombo: number) {
    setLastTypedIndex(index);
    setLastTypedState(isCorrect ? "correct" : "wrong");

    if (isCorrect && nextCombo >= 3) {
      setBurstToken((prev) => prev + 1);
    }
  }

  function applySuggestion(suggestion: TypingSuggestion | null) {
    if (!suggestion || finished || paused) return;

    if (!startedAt) {
      const now = getNowTimestamp();
      setStartedAt(now);
      setElapsedSeconds(1);
    }

    const next = `${input}${suggestion.completion}`.slice(0, target.length);
    const nextCombo = next === target.slice(0, next.length) ? combo + suggestion.completion.length : combo;

    setInput(next);
    setCombo(nextCombo);
    setSavedKeystrokes((prev) => prev + suggestion.savedKeystrokes);
    setLastTypedIndex(Math.max(0, next.length - 1));
    setLastTypedState("correct");
    setBurstToken((prev) => prev + 1);

    if (next.length === target.length) {
      finish(next, nextCombo);
    }
  }

  function onChange(value: string) {
    if (finished || paused) return;

    if (!startedAt) {
      const now = getNowTimestamp();
      setStartedAt(now);
      setElapsedSeconds(1);
    }

    const next = value.slice(0, target.length);
    const isAdding = next.length > input.length;
    const latestIndex = next.length - 1;
    let nextCombo = combo;
    const latestChar = latestIndex >= 0 ? next[latestIndex] : "";
    const isCorrectHit = latestIndex >= 0 && latestChar === target[latestIndex];

    if (latestIndex >= 0 && isCorrectHit) {
      nextCombo = combo + 1;
      setCombo(nextCombo);
    } else if (latestIndex >= 0) {
      nextCombo = 0;
      setCombo(0);
    }

    setInput(next);

    if (isAdding && latestIndex >= 0) {
      triggerTypingEffect(latestIndex, isCorrectHit, nextCombo);
    }

    if (next.length === target.length) {
      finish(next, nextCombo);
    }
  }

  function finish(finalInput: string, finalCombo: number) {
    const finalCorrect = countCorrectChars(finalInput, target);
    const finalWrong = countWrongChars(finalInput, target);
    const finalSeconds = startedAt
      ? Math.max(1, Math.floor((Date.now() - startedAt) / 1000))
      : 1;
    const finalAccuracy = calculateAccuracy(finalInput, target);
    const finalWpm = calculateWPM(finalCorrect, finalSeconds);
    const finalStars = calculateStars(finalAccuracy, finalWpm, goalAccuracy, goalWpm);
    const earnedXp = calculateXp(finalWpm, finalCombo, finalStars);
    const earnedCoins = calculateCoins(finalWpm, finalAccuracy, finalStars);
    const earnedSeasonPoints = calculateSeasonPoints(mode, finalStars, finalAccuracy, finalWpm);
    const finalErrorAnalysis = analyzeTypingErrors(finalInput, target);

    setStars(finalStars);
    setXpGained(earnedXp);
    setCoinsGained(earnedCoins);
    setFinished(true);
    setElapsedSeconds(finalSeconds);

    const currentProgress = loadProgress();
    const nextXp = currentProgress.xp + earnedXp;
    const nextLevel = Math.floor(nextXp / 100) + 1;
    const nextStreak = updateStreak(currentProgress.lastPracticeDate, currentProgress.streak);

    const nextProgress = {
      level: nextLevel,
      xp: nextXp,
      streak: nextStreak,
      lastPracticeDate: getTodayDateString(),
      totalCheckIns: currentProgress.totalCheckIns,
      coins: currentProgress.coins + earnedCoins,
      lastCheckInDate: currentProgress.lastCheckInDate,
      seasonPoints: currentProgress.seasonPoints + earnedSeasonPoints
    };

    saveProgress(nextProgress);
    setProgressState(nextProgress);

    const prevRecords = loadRecords();
    const record: TrainingRecord = {
      id: String(Date.now()),
      lessonId: lesson?.id,
      title,
      challengeId,
      duelId,
      mode,
      accuracy: finalAccuracy,
      wpm: finalWpm,
      duration: finalSeconds,
      correctChars: finalCorrect,
      wrongChars: finalWrong,
      xpGained: earnedXp,
      stars: finalStars,
      errorAnalysis: finalErrorAnalysis,
      createdAt: new Date().toLocaleString()
    };

    saveRecords([record, ...prevRecords].slice(0, 50));
    const nextRecords = [record, ...prevRecords].slice(0, 50);
    setRecordHistory(nextRecords);
    const profile = loadFriendProfile();
    const nextBadges = buildAchievementBadges(nextRecords, nextProgress);
    void syncCloudRecords(profile.shareCode, profile.name, nextRecords, nextProgress);
    void syncCloudAchievements(profile.shareCode, nextBadges);
    if (mode === "duel" && duelId) {
      void submitCloudDuelAttempt(duelId, {
        id: `${duelId}-${profile.shareCode}`,
        duelId,
        shareCode: profile.shareCode,
        name: profile.name,
        accuracy: finalAccuracy,
        wpm: finalWpm,
        duration: finalSeconds,
        correctChars: finalCorrect,
        wrongChars: finalWrong,
        createdAt: new Date().toISOString()
      });
    }
  }

  useEffect(() => {
    if (!startedAt || finished || !timeLimitSeconds) return;
    if (elapsedSeconds >= timeLimitSeconds) {
      finish(input, combo);
    }
  }, [combo, elapsedSeconds, finish, finished, input, startedAt, timeLimitSeconds]);

  function reset() {
    setInput("");
    setStartedAt(null);
    setElapsedSeconds(0);
    setFinished(false);
    setPaused(false);
    setCombo(0);
    setStars(0);
    setXpGained(0);
    setCoinsGained(0);
    setSavedKeystrokes(0);
    setLastTypedIndex(null);
    setLastTypedState(null);
    inputRef.current?.focus();
  }

  function togglePause() {
    setPaused((prev) => !prev);
  }

  function exitTraining() {
    if (mode === "duel" && duelId) {
      router.push(`/duel/${duelId}`);
      return;
    }
    if (mode === "challenge" || mode === "boss") {
      router.push("/challenge");
      return;
    }
    router.push("/lessons");
  }

  function goToNextLesson() {
    if (!nextLesson) return;
    router.push(`/trainer?lesson=${nextLesson.id}`);
  }

  useEffect(() => {
    function onTrainerCommand(event: Event) {
      const detail = (event as CustomEvent<{ action: string }>).detail;
      switch (detail?.action) {
        case "pause":
          if (!paused) setPaused(true);
          break;
        case "resume":
          if (paused) setPaused(false);
          break;
        case "reset":
          reset();
          break;
        case "exit":
          exitTraining();
          break;
        case "theme-default":
          setViewTheme("default");
          break;
        case "theme-eye-care":
          setViewTheme("eye-care");
          break;
        case "theme-night":
          setViewTheme("night");
          break;
        case "accept-suggestion":
          applySuggestion(typingSuggestion);
          break;
        default:
          break;
      }
    }

    window.addEventListener("trainer-command", onTrainerCommand);
    return () => window.removeEventListener("trainer-command", onTrainerCommand);
  }, [paused, typingSuggestion]);

  if (!isReady) {
    return (
      <div className="h-full">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>读取练习中</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 animate-pulse rounded-[28px] bg-sky-100/70" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "trainer-stage h-full min-w-0",
        viewTheme === "eye-care" && "trainer-stage-eye",
        viewTheme === "night" && "trainer-stage-night"
      )}
    >
      <Card className="trainer-shell flex h-full min-h-0 min-w-0 flex-col overflow-hidden border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(240,249,255,0.94))] shadow-[0_30px_80px_rgba(14,91,135,0.14)]">
        <CardHeader className="shrink-0 space-y-2 border-b border-sky-100/80 px-4 pb-2 pt-3 md:px-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1.5">
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-100/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
                <Sparkles className="h-3.5 w-3.5" />
                {stageLabel}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-[1.7rem] md:text-[1.85rem]">{title}</CardTitle>
                <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] text-sky-700">
                  本关最佳 {bestLessonWpm} WPM
                </span>
                <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[11px] text-orange-700">
                  {streak} 天连续训练
                </span>
              </div>
              <p className="max-w-3xl truncate text-sm leading-5 text-sky-800/70">{description}</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "default", label: "默认" },
                  { id: "eye-care", label: "护眼" },
                  { id: "night", label: "夜间" }
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setViewTheme(option.id as "default" | "eye-care" | "night")}
                    className={clsx(
                      "rounded-full px-2.5 py-1 text-[11px] font-semibold transition",
                      viewTheme === option.id
                        ? "bg-sky-600 text-white"
                        : "bg-white/90 text-sky-700 hover:bg-sky-50"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
                {allowSmartAssist ? (
                  <button
                    type="button"
                    onClick={() => setSmartAssistEnabled((prev) => !prev)}
                    className={clsx(
                      "rounded-full px-2.5 py-1 text-[11px] font-semibold transition",
                      smartAssistEnabled
                        ? "bg-emerald-500 text-white"
                        : "bg-white/90 text-sky-700 hover:bg-sky-50"
                    )}
                  >
                    输入辅助 {smartAssistEnabled ? "开" : "关"}
                  </button>
                ) : null}
              </div>
            </div>

            <div className="hidden shrink-0 grid-cols-4 gap-2 xl:grid">
              {[
                { icon: Timer, label: timeLimitSeconds ? "剩余" : "计时", value: `${timerDisplay}s` },
                { icon: Zap, label: "速度", value: `${wpm}` },
                { icon: Target, label: "正确率", value: `${accuracy}%` },
                { icon: Flame, label: "连击", value: `${combo}` }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-[18px] bg-white/85 px-3 py-2 shadow-sm">
                    <div className="flex items-center gap-2 text-[11px] text-sky-600/75">
                      <Icon className="h-3.5 w-3.5" />
                      {item.label}
                    </div>
                    <div className="mt-1 font-display text-xl text-sky-950">{item.value}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-3 xl:grid-cols-[1fr_270px]">
            <div className="rounded-[20px] border border-sky-100 bg-sky-950 px-4 py-3 text-white">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">连击能量</div>
                  <div className="mt-1 text-sm text-sky-100/80">{comboStateLabel}</div>
                </div>
                <div className="text-right">
                  <div className="font-display text-2xl">{combo}</div>
                  <div className="text-xs text-sky-100/70">目标 {COMBO_MILESTONE}</div>
                </div>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/12">
                <div
                  className="combo-meter h-full rounded-full bg-[linear-gradient(90deg,#38bdf8_0%,#22d3ee_45%,#facc15_100%)] transition-all"
                  style={{ width: `${comboProgress}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[20px] bg-white/85 p-3 shadow-sm">
                <div className="mb-2 flex items-center justify-between text-sm text-sky-700/75">
                  <span>速度目标</span>
                  <span>
                    {wpm} / {goalWpm}
                  </span>
                </div>
                <Progress value={speedProgress} />
              </div>
              <div className="rounded-[20px] bg-white/85 p-3 shadow-sm">
                <div className="mb-2 flex items-center justify-between text-sm text-sky-700/75">
                  <span>准确率目标</span>
                  <span>
                    {accuracy}% / {goalAccuracy}%
                  </span>
                </div>
                <Progress value={accuracyProgress} />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex min-h-0 min-w-0 flex-1 overflow-hidden p-3 md:p-4">
          <div className="grid min-h-0 min-w-0 flex-1 gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
            <div className="trainer-block relative flex min-h-0 min-w-0 flex-col overflow-hidden rounded-[26px] border border-sky-100 bg-white px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
              <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
                {beatPulseToken > 0 ? <div key={beatPulseToken} className="rhythm-beat-wave" /> : null}

                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-500">
                    跟着高亮输入
                  </div>
                  <div className="text-sm text-sky-700/80">{focusTip}</div>
                </div>

                <div
                  className={clsx(
                    "relative flex h-full min-h-0 justify-center overflow-hidden",
                    finished ? "items-start overflow-y-auto pt-3" : "items-center"
                  )}
                >
                  {burstToken > 0 ? (
                    <div key={burstToken} className="typing-burst pointer-events-none">
                      {Array.from({ length: 10 }).map((_, index) => (
                        <span
                          key={index}
                          className="typing-burst-particle"
                          style={
                            {
                              "--tx": `${Math.cos((index / 10) * Math.PI * 2) * (36 + (index % 3) * 18)}px`,
                              "--ty": `${Math.sin((index / 10) * Math.PI * 2) * (28 + (index % 4) * 12)}px`,
                              "--delay": `${index * 20}ms`
                            } as CSSProperties
                          }
                        />
                      ))}
                    </div>
                  ) : null}

                  {finished ? (
                    <div className="flex w-full max-w-4xl flex-col gap-3 rounded-[22px] bg-slate-50/90 px-5 py-4 text-center">
                      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                        本轮完成
                      </div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-[18px] bg-white px-4 py-3 text-sky-950">速度 {wpm} WPM</div>
                        <div className="rounded-[18px] bg-white px-4 py-3 text-sky-950">正确率 {accuracy}%</div>
                        <div className="rounded-[18px] bg-white px-4 py-3 text-sky-950">经验 +{xpGained}</div>
                      </div>
                      <div className="rounded-[18px] bg-amber-50 px-4 py-3 text-sm text-amber-700">
                        本轮获得 +{coinsGained} 金币
                        {allowSmartAssist ? ` · 节省击键 ${savedKeystrokes}` : ""}
                      </div>
                      <div className="flex flex-wrap justify-center gap-2">
                        <Button type="button" onClick={reset} className="gap-2">
                          <RotateCcw className="h-4 w-4" />
                          再来一次
                        </Button>
                        {mode === "lesson" && nextLesson ? (
                          <Button type="button" onClick={goToNextLesson} className="gap-2">
                            <Play className="h-4 w-4" />
                            下一关：{nextLesson.title}
                          </Button>
                        ) : null}
                        <Button type="button" variant="outline" onClick={exitTraining} className="gap-2">
                          <DoorOpen className="h-4 w-4" />
                          {mode === "challenge" || mode === "boss" ? "返回挑战" : "返回课程"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full max-w-full px-4 text-left md:text-center">
                      {target.split("").map((char, index) => {
                        let cls = "text-sky-300";
                        if (index < input.length) {
                          cls = input[index] === char ? "text-sky-950" : "text-rose-500";
                        } else if (index === input.length) {
                          cls = "rounded-md bg-amber-200 px-1 text-sky-950";
                        }
                        if (index === lastTypedIndex && lastTypedState === "correct") {
                          cls = `${cls} typing-hit-correct inline-block`;
                        }
                        if (index === lastTypedIndex && lastTypedState === "wrong") {
                          cls = `${cls} typing-hit-wrong inline-block`;
                        }

                        return (
                          <span
                            key={index}
                            className={`${cls} text-[1.55rem] leading-[2.55rem] tracking-[0.04em] md:text-[1.85rem] md:leading-[2.85rem]`}
                          >
                            {char === " " ? "·" : char}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full w-full origin-left ${
                      lastTypedState === "correct"
                        ? "typing-line-correct bg-emerald-400"
                        : lastTypedState === "wrong"
                          ? "typing-line-wrong bg-rose-400"
                          : "scale-x-0"
                    }`}
                  />
                </div>
              </div>

              <div className="mt-3 border-t border-sky-100/90 pt-3">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-500">
                      连续操作区
                    </div>
                    <div className="mt-1 text-sm text-sky-700/80">
                      {paused ? "当前已暂停，点继续训练后恢复输入。" : "看当前要打，必要时接受补全，然后直接连续输入。"}
                    </div>
                  </div>
                  <div className="rounded-full bg-sky-50 px-3 py-1 text-sm text-sky-700">
                    {finished ? "本轮完成" : paused ? "已暂停" : "练习中"}
                  </div>
                </div>

                <div className="rounded-[22px] bg-[linear-gradient(180deg,rgba(248,250,252,0.94),rgba(236,253,245,0.9))] px-4 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-amber-200 px-3 py-1 text-sm font-semibold text-sky-950">
                      {remainingChars === 0 ? "已完成" : `下一键 ${activeKey}`}
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs text-sky-700">
                      剩余 {remainingChars}
                    </span>
                    {allowSmartAssist ? (
                      <span className="rounded-full bg-white px-3 py-1 text-xs text-emerald-700">
                        已节省 {savedKeystrokes} 键
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-3 text-lg leading-8 text-sky-950">
                    {upcomingText || "本段已经完成"}
                  </div>
                  {allowSmartAssist ? (
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[18px] bg-emerald-50/80 px-4 py-3">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                          输入辅助
                        </div>
                        <div className="mt-1 text-sm text-emerald-800/85">
                          {typingSuggestion
                            ? `预测${typingSuggestion.kind === "phrase" ? "短语" : "单词"}：${typingSuggestion.preview}`
                            : smartAssistEnabled
                              ? "只有自由练习会出现输入辅助，课程和挑战不会给你外挂。"
                              : "已关闭输入辅助。"}
                        </div>
                      </div>
                      {typingSuggestion ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => applySuggestion(typingSuggestion)}
                          className="gap-2 border-emerald-200 bg-white/90 text-emerald-700 hover:bg-emerald-50"
                        >
                          Tab 补全
                        </Button>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <Textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => onChange(e.target.value)}
                  onKeyDown={(event) => {
                    if (allowSmartAssist && event.key === "Tab" && typingSuggestion) {
                      event.preventDefault();
                      applySuggestion(typingSuggestion);
                    }
                  }}
                  placeholder="在这里开始输入..."
                  className="trainer-input mt-3 min-h-[88px] rounded-[22px] border-sky-100 bg-sky-50/65 px-5 py-3 text-xl leading-8"
                  disabled={finished || paused}
                />
              </div>
            </div>

            <div className="grid min-h-0 min-w-0 gap-3 xl:grid-rows-[auto_minmax(0,1fr)]">
              <div className="grid grid-cols-2 gap-3 xl:hidden">
                {[
                  { icon: Timer, label: timeLimitSeconds ? "剩余" : "计时", value: `${timerDisplay}s` },
                  { icon: Zap, label: "速度", value: `${wpm}` },
                  { icon: Target, label: "正确率", value: `${accuracy}%` },
                  { icon: Flame, label: "连击", value: `${combo}` }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="trainer-soft-block rounded-[18px] bg-white/85 px-3 py-2 shadow-sm">
                      <div className="flex items-center gap-2 text-[11px] text-sky-600/75">
                        <Icon className="h-3.5 w-3.5" />
                        {item.label}
                      </div>
                      <div className="mt-1 text-xl text-sky-950">{item.value}</div>
                    </div>
                  );
                })}
              </div>

              <div className="trainer-soft-block rounded-[24px] bg-slate-50/95 p-4">
                <div className="mb-3 grid grid-cols-2 gap-2 text-sm md:grid-cols-4 xl:grid-cols-2">
                  {[
                    { label: "下一键", value: activeKey ?? "已完成" },
                    { label: "剩余字符", value: String(remainingChars) },
                    { label: "错误数", value: String(wrongChars) },
                    { label: "最佳准确率", value: `${bestLessonAccuracy}%` }
                  ].map((item) => (
                    <div key={item.label} className="rounded-[16px] bg-white/90 px-3 py-3">
                      <div className="text-[11px] uppercase tracking-[0.16em] text-sky-600/75">{item.label}</div>
                      <div className="mt-1 font-display text-2xl text-sky-950">{item.value}</div>
                    </div>
                  ))}
                </div>

                <div className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-sky-500">
                  状态与纠错
                </div>
                <div className="mb-2 flex flex-wrap gap-2 text-sm text-sky-800/80">
                  <span className="rounded-full bg-white px-3 py-1">已对 {correctChars}</span>
                  <span className="rounded-full bg-white px-3 py-1">已错 {wrongChars}</span>
                  <span className="rounded-full bg-white px-3 py-1">总进度 {progressValue}%</span>
                  <span className="rounded-full bg-white px-3 py-1">经验 Lv.{level}</span>
                  {allowSmartAssist ? (
                    <span className="rounded-full bg-white px-3 py-1">节省 {savedKeystrokes} 键</span>
                  ) : null}
                  {mode === "boss" ? <span className="rounded-full bg-white px-3 py-1">Boss 挑战</span> : null}
                  {mode === "challenge" ? <span className="rounded-full bg-white px-3 py-1">挑战模式</span> : null}
                </div>
                <div className="mb-2 rounded-[18px] bg-white/90 px-3 py-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-500">
                    实时纠错建议
                  </div>
                  <div className="mt-2 space-y-1.5 text-sm leading-6 text-sky-800/85">
                    {errorAnalysis.tips.slice(0, 2).map((tip) => (
                      <p key={tip}>{tip}</p>
                    ))}
                  </div>
                  {errorAnalysis.hotspots.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {errorAnalysis.hotspots.map((item) => (
                        <span key={item.key} className="rounded-full bg-sky-50 px-3 py-1 text-xs text-sky-700">
                          {item.key} × {item.count}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
                {finished ? (
                  <div className="mb-2 rounded-[18px] bg-emerald-50 px-3 py-3 text-sm text-emerald-800">
                    {accuracy >= goalAccuracy && wpm >= goalWpm
                      ? mode === "duel"
                        ? "对战成绩已提交。"
                        : mode === "boss"
                          ? "Boss 成绩已写入赛季进度。"
                          : mode === "challenge"
                            ? "挑战达标，已记分。"
                            : "目标已达成。"
                      : mode === "duel"
                        ? "这轮对战已记录。"
                        : mode === "boss"
                          ? "Boss 结果已记录。"
                        : mode === "challenge"
                          ? "挑战结果已记录。"
                            : "记录已保存。"}
                  </div>
                ) : null}
                <div className="grid gap-2 sm:grid-cols-3">
                  <Button variant="outline" onClick={togglePause} className="min-w-0 gap-2 sm:min-w-[96px]">
                    {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                    {paused ? "继续训练" : "暂停训练"}
                  </Button>
                  <Button variant="outline" onClick={reset} className="min-w-0 gap-2 sm:min-w-[96px]">
                    <RotateCcw className="h-4 w-4" />
                    重新开始
                  </Button>
                  <Button variant="outline" onClick={exitTraining} className="min-w-0 gap-2 sm:min-w-[96px]">
                    <DoorOpen className="h-4 w-4" />
                    退出训练
                  </Button>
                </div>

                <div className="mt-3 border-t border-sky-100/90 pt-3">
                  <button
                    type="button"
                    onClick={() => setMusicPanelOpen((prev) => !prev)}
                    className="flex w-full items-center justify-between gap-3 rounded-[18px] bg-white/90 px-4 py-3 text-left transition hover:bg-white"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-500">
                        <Music4 className="h-4 w-4" />
                        节奏与音乐
                      </div>
                      <div className="mt-1 text-sm text-sky-800/80">
                        {musicPanelOpen
                          ? "已展开音乐控制台，可以上传、播放或停止。"
                          : "默认收起，跟拍或上传时再展开。"}
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                      {musicPanelOpen ? "收起" : "展开"}
                      {musicPanelOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </span>
                  </button>
                  {musicPanelOpen ? (
                    <div className="mt-3 min-h-0 overflow-hidden rounded-[20px]">
                      <RhythmStation
                        combo={combo}
                        lastTypedState={lastTypedState}
                        onBeatPulse={() => setBeatPulseToken((prev) => prev + 1)}
                      />
                    </div>
                  ) : (
                    <div className="mt-3 rounded-[18px] bg-white/80 px-4 py-3 text-sm leading-7 text-sky-800/80">
                      训练主舞台优先。这里先折叠，不抢打字区视线。
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
