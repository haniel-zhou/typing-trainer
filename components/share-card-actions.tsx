"use client";

import { useEffect, useState } from "react";
import { Copy, Download, QrCode, Share2 } from "lucide-react";
import { toPng } from "html-to-image";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { appendShareHistory } from "@/lib/storage";

export function ShareCardActions({
  shareUrl,
  title,
  text,
  captureId,
  posterId,
  kind
}: {
  shareUrl: string;
  title: string;
  text: string;
  captureId?: string;
  posterId?: string;
  kind: "profile" | "season" | "duel";
}) {
  const [hint, setHint] = useState("把这张卡片页发给朋友，对方点开就是完整战绩。");
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    void QRCode.toDataURL(shareUrl, {
      margin: 1,
      width: 160,
      color: {
        dark: "#0f3b56",
        light: "#ffffff"
      }
    }).then(setQrDataUrl);
  }, [shareUrl]);

  function logShare(action: "share" | "copy" | "download" | "download-poster") {
    appendShareHistory({
      id: `${kind}-${action}-${Date.now()}`,
      kind,
      title,
      shareUrl,
      action,
      createdAt: new Date().toISOString()
    });
  }

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl);
    logShare("copy");
    setHint("分享链接已复制，现在可以直接发到微信、QQ 或浏览器。");
  }

  async function shareLink() {
    if (navigator.share) {
      await navigator.share({ title, text, url: shareUrl });
      logShare("share");
      setHint("系统分享已打开。");
      return;
    }
    await copyLink();
  }

  async function exportNode(nodeId: string | undefined, action: "download" | "download-poster", fallbackHint: string) {
    if (!nodeId) {
      setHint("当前这张卡还没有绑定下载区域。");
      return;
    }

    const node = document.getElementById(nodeId);
    if (!node) {
      setHint(fallbackHint);
      return;
    }

    try {
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#f7fcff"
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${title.replace(/\s+/g, "-")}-${action}.png`;
      link.click();
      logShare(action);
      setHint("图片已导出，可以直接发给朋友。");
    } catch {
      setHint("导出失败了，可以先用复制链接继续分享。");
    }
  }

  async function downloadCard() {
    await exportNode(captureId, "download", "没有找到可导出的卡片区域。");
  }

  async function downloadPoster() {
    await exportNode(posterId ?? captureId, "download-poster", "没有找到可导出的长图区域。");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        {qrDataUrl ? (
          <div className="rounded-[20px] bg-white/90 p-3 shadow-sm">
            <img src={qrDataUrl} alt="分享二维码" className="h-28 w-28 rounded-xl" />
          </div>
        ) : null}
        <div className="space-y-2 text-sm leading-7 text-sky-800/80">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
            <QrCode className="h-3.5 w-3.5" />
            扫码直达
          </div>
          <div>可以直接发链接，也可以让朋友扫码打开这张分享卡。</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => void shareLink()} className="gap-2">
          <Share2 className="h-4 w-4" />
          系统分享
        </Button>
        <Button variant="outline" onClick={() => void copyLink()} className="gap-2">
          <Copy className="h-4 w-4" />
          复制链接
        </Button>
        <Button variant="outline" onClick={() => void downloadCard()} className="gap-2">
          <Download className="h-4 w-4" />
          下载图片
        </Button>
        <Button variant="outline" onClick={() => void downloadPoster()} className="gap-2">
          <Download className="h-4 w-4" />
          下载长图
        </Button>
      </div>
      <div className="text-sm leading-7 text-sky-800/80">{hint}</div>
    </div>
  );
}
