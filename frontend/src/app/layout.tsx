import "./globals.css";

import { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import { ReactNode } from "react";

import { AppProviders } from "@/components/providers/app-providers";

const notoSans = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI 中文作文導師",
  description:
    "生成練習作文、學生自評、多輪改寫與 AI 批改的綜合中文寫作學習平台",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body className={notoSans.className}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
