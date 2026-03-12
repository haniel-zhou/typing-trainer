import "./globals.css";
import type { Metadata } from "next";
import { LocaleProvider } from "@/components/locale-provider";

const metadataBase = new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase,
  title: "Typing Trainer",
  description: "面向初学者的网页打字训练应用"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
