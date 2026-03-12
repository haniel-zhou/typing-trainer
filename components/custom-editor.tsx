"use client";

import Link from "next/link";
import { FileText, Mic, MicOff, Sparkles, Trash2, WandSparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button, buttonStyles } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WORD_BANK_PRESETS } from "@/data/word-banks";
import { pullCloudWordBanks, syncCloudWordBanks } from "@/lib/cloud";
import {
  loadCustomExercises,
  loadFriendProfile,
  loadWordBanks,
  saveCustomExercises,
  saveWordBanks
} from "@/lib/storage";
import { buildPracticeTextFromTerms, parseTermsInput } from "@/lib/typing";
import { CustomExercise, PersonalWordBank, WordBankPreset } from "@/lib/types";

type SpeechRecognitionInstance = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionEvent = {
  results: ArrayLike<{
    0: { transcript: string };
    isFinal: boolean;
  }>;
};

type SpeechWindow = Window & {
  SpeechRecognition?: new () => SpeechRecognitionInstance;
  webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
};

export function CustomEditor() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [items, setItems] = useState<CustomExercise[]>([]);
  const [termInput, setTermInput] = useState("");
  const [wordBanks, setWordBanks] = useState<PersonalWordBank[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [cloudHint, setCloudHint] = useState("词库会优先保存在当前浏览器，也会尝试同步到云端。");
  const contentLength = content.trim().length;
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    setItems(loadCustomExercises());
    const localBanks = loadWordBanks();
    setWordBanks(localBanks);
    const SpeechRecognition =
      (window as SpeechWindow).SpeechRecognition ??
      (window as SpeechWindow).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "zh-CN";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("")
        .trim();

      setTermInput((prev) => (prev ? `${prev}\n${transcript}` : transcript));
    };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    setSpeechSupported(true);

    return () => recognition.stop();
  }, []);

  useEffect(() => {
    const profile = loadFriendProfile();
    const localBanks = loadWordBanks();

    void pullCloudWordBanks(profile.shareCode).then((cloudBanks) => {
      if (cloudBanks.length === 0) return;
      const merged = [...cloudBanks, ...localBanks].reduce<PersonalWordBank[]>((acc, item) => {
        if (acc.some((bank) => bank.id === item.id || bank.title === item.title)) return acc;
        acc.push(item);
        return acc;
      }, []);
      saveWordBanks(merged);
      setWordBanks(merged);
      setCloudHint("词库已和云端合并，同一份术语可以在别的设备继续练。");
    });
  }, []);

  function persistWordBanks(updated: PersonalWordBank[], hint?: string) {
    setWordBanks(updated);
    saveWordBanks(updated);
    void syncCloudWordBanks(loadFriendProfile().shareCode, updated);
    if (hint) setCloudHint(hint);
  }

  function addItem() {
    if (!title.trim() || !content.trim()) return;
    const next: CustomExercise = {
      id: String(Date.now()),
      title: title.trim(),
      content: content.trim(),
      createdAt: new Date().toLocaleString()
    };
    const updated = [next, ...items];
    setItems(updated);
    saveCustomExercises(updated);
    setTitle("");
    setContent("");
  }

  function fillFromPreset(preset: WordBankPreset) {
    setTitle(preset.title);
    setTermInput(preset.terms.join("\n"));
    setContent(buildPracticeTextFromTerms(preset.terms));
  }

  function saveWordBank(category: PersonalWordBank["category"], source: PersonalWordBank["source"]) {
    const terms = parseTermsInput(termInput);
    if (!title.trim() || terms.length === 0) return;

    const nextBank: PersonalWordBank = {
      id: String(Date.now()),
      title: title.trim(),
      category,
      terms,
      createdAt: new Date().toLocaleString(),
      source
    };

    const updated = [nextBank, ...wordBanks.filter((item) => item.title !== nextBank.title)].slice(0, 18);
    persistWordBanks(updated, "词库已保存，并尝试同步到云端。");
  }

  function generateFromTerms() {
    const terms = parseTermsInput(termInput);
    if (terms.length === 0) return;
    const nextTitle = title.trim() || `${terms[0]} 词库练习`;
    setTitle(nextTitle);
    setContent(buildPracticeTextFromTerms(terms));
    if (!title.trim()) {
      const nextBank: PersonalWordBank = {
        id: String(Date.now()),
        title: nextTitle,
        category: "custom",
        terms,
        createdAt: new Date().toLocaleString(),
        source: "imported"
      };
      const updated = [nextBank, ...wordBanks.filter((item) => item.title !== nextBank.title)].slice(0, 18);
      persistWordBanks(updated, "词库已从术语生成，并尝试同步到云端。");
      return;
    }
    saveWordBank("custom", "imported");
  }

  function removeItem(id: string) {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    saveCustomExercises(updated);
  }

  function useWordBank(bank: PersonalWordBank) {
    setTitle(bank.title);
    setTermInput(bank.terms.join("\n"));
    setContent(buildPracticeTextFromTerms(bank.terms));
  }

  function removeWordBank(id: string) {
    const updated = wordBanks.filter((item) => item.id !== id);
    persistWordBanks(updated, "词库已删除，云端也会同步更新。");
  }

  function toggleVoiceInput() {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    recognitionRef.current.start();
    setIsListening(true);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>添加自定义练习内容</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-3 rounded-[24px] border border-sky-100 bg-sky-50/80 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-sky-900">
              <WandSparkles className="h-4 w-4" />
              个性化词库工坊
            </div>
            <p className="text-sm leading-7 text-sky-700">
              这里可以直接导入编程、医学、商务等专业术语，或者把你自己的高频词粘进来，自动生成更贴近真实工作的练习内容。
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {WORD_BANK_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => fillFromPreset(preset)}
                  className={`rounded-[22px] border border-white/80 bg-gradient-to-br ${preset.accent} px-4 py-4 text-left shadow-sm transition hover:-translate-y-0.5`}
                >
                  <div className="font-semibold text-sky-950">{preset.title}</div>
                  <div className="mt-2 text-sm leading-6 text-sky-700">{preset.description}</div>
                  <div className="mt-3 text-xs text-sky-600/80">{preset.terms.slice(0, 4).join(" · ")}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge>专业术语</Badge>
            <Badge>高频词组</Badge>
            <Badge>代码片段</Badge>
            <Badge>演讲稿</Badge>
          </div>
          <Input placeholder="练习名称" value={title} onChange={(e) => setTitle(e.target.value)} />
          <div className="rounded-[24px] border border-sky-100 bg-white/80 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-sky-950">术语列表</div>
                <div className="text-sm text-sky-700/75">支持逗号、换行分隔，也可以用语音直接录入。</div>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={toggleVoiceInput}
                className="gap-2"
                disabled={!speechSupported}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {speechSupported ? (isListening ? "停止语音录入" : "语音录入术语") : "当前浏览器不支持语音"}
              </Button>
            </div>
            <Textarea
              placeholder="例如：function, variable, interface 或一行一个术语"
              value={termInput}
              onChange={(e) => setTermInput(e.target.value)}
              className="min-h-[120px]"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <Button type="button" onClick={generateFromTerms}>
                从术语生成练习
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => saveWordBank("custom", "manual")}
                disabled={!title.trim() || parseTermsInput(termInput).length === 0}
              >
                保存到我的词库
              </Button>
            </div>
          </div>
          <Textarea
            placeholder="把你想练习的内容贴到这里"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[240px]"
          />
          <div className="flex items-center justify-between gap-3 rounded-[24px] bg-sky-50/80 p-4 text-sm text-sky-700">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              当前文本 {contentLength} 字符，建议控制在 80 到 300 字之间。
            </div>
            <Button onClick={addItem} disabled={!title.trim() || !content.trim()}>
              保存练习
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>我的练习与词库</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-[24px] border border-sky-100 bg-sky-50/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-sky-950">已保存词库</div>
              <div className="text-xs text-sky-600/75">云同步</div>
            </div>
            <p className="mt-2 text-sm leading-7 text-sky-700">{cloudHint}</p>
            {wordBanks.length === 0 ? (
              <p className="mt-2 text-sm text-sky-700">还没有词库。先导入一组专业词，后面就能反复拿来训练。</p>
            ) : (
              <div className="mt-3 space-y-3">
                {wordBanks.map((bank) => (
                  <div key={bank.id} className="rounded-[22px] bg-white/85 p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-sky-950">{bank.title}</div>
                        <div className="mt-1 text-xs text-sky-600/70">{bank.createdAt}</div>
                      </div>
                      <Badge>{bank.category === "custom" ? "自定义词库" : bank.category}</Badge>
                    </div>
                    <div className="mt-3 line-clamp-3 text-sm leading-7 text-sky-800/80">
                      {bank.terms.join(" · ")}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button type="button" onClick={() => useWordBank(bank)}>
                        填入编辑器
                      </Button>
                      <Button variant="outline" type="button" onClick={() => removeWordBank(bank.id)}>
                        删除词库
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length === 0 ? (
            <p className="rounded-[24px] bg-sky-50/80 p-4 text-sm text-sky-700">
              还没有内容。你可以先粘贴一段常用短文，或者准备一段自己最想练的内容。
            </p>
          ) : null}
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-[24px] border border-sky-100 bg-white/75 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-sky-950">{item.title}</div>
                  <div className="mt-1 text-xs text-sky-600/70">{item.createdAt}</div>
                </div>
                <Badge className="bg-amber-50 text-amber-700">
                  <Sparkles className="mr-1 h-3.5 w-3.5" />
                  自定义
                </Badge>
              </div>
              <div className="mt-3 line-clamp-4 text-sm leading-7 text-sky-800/80">
                {item.content}
              </div>
              <div className="mt-4 flex gap-2">
                <Link href={`/trainer?custom=${item.id}`} className={buttonStyles({ className: "flex-1" })}>
                  开始练习
                </Link>
                <Button variant="outline" onClick={() => removeItem(item.id)} className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  删除
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
