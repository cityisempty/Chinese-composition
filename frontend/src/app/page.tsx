import Link from "next/link";
import { ArrowRight, Sparkles, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "AI 模擬初稿",
    description: "依照年級、題型、題目生成含有常見錯誤的作文草稿，真實還原學生程度。",
  },
  {
    title: "自評與導改",
    description: "學生自行評分並指出問題，AI 根據指示進行多輪修訂，累積寫作心法。",
  },
  {
    title: "AI 對比評分",
    description: "最終由 AI 評改給出分數與建議，對照學生批改結果，立即看到差距。",
  },
];

const steps = [
  "選擇年級、題型與題目，生成含錯草稿",
  "學生批改、評分並輸入修訂建議",
  "AI 多輪優化，直到滿意為止",
  "AI 導師給予最終評分與建議",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-[#f6f9ff]">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-10">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-soft">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-semibold text-brand-700">AI 中文作文導師</p>
            <p className="text-sm text-gray-500">專為學生打造的寫作成長全流程</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-brand-700 hover:text-brand-500">
            登入
          </Link>
          <Button asChild>
            <Link href="/register" className="flex items-center gap-2">
              立即開始
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto mt-10 flex w-full max-w-6xl flex-col gap-20 px-6 pb-24">
        <section className="grid items-center gap-10 md:grid-cols-[1.2fr_1fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-brand-600 shadow-soft">
              <Star className="h-4 w-4" />
              針對臺灣作文課綱打造
            </div>
            <h1 className="text-4xl font-bold leading-[1.2] text-gray-900 md:text-5xl">
              AI 陪你寫出好作文，
              <span className="text-brand-600">從錯誤中掌握關鍵技巧</span>
            </h1>
            <p className="max-w-xl text-lg text-gray-600">
              自訂年級、題型與寫作要求，AI 生成帶有真實錯誤的練習文章。學生親自批改、要求修正，最後再由 AI 導師評分，完整建立閱讀與寫作的雙向能力。
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button asChild size="lg">
                <Link href="/register" className="flex items-center gap-2">
                  免費註冊
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link href="/workspace">體驗操作流程</Link>
              </Button>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-brand-100 bg-white/80 shadow-[0_40px_80px_-40px_rgba(122,67,255,0.35)] backdrop-blur">
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-brand-200 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-brand-300 blur-3xl" />
            <div className="relative space-y-6 p-8 text-gray-700">
              <p className="text-sm font-semibold text-brand-600">模擬學生作文片段</p>
              <p className="rounded-3xl bg-white/80 p-6 text-sm leading-relaxed shadow-inner">
                我是國中二年級的學生，這次老師要我們寫「難忘的活動」。我覺得這次活動真的很好玩我也學到了很多東西，可是過程中我有點害怕。
              </p>
              <p className="rounded-3xl bg-brand-50/80 p-6 text-sm leading-relaxed text-brand-800">
                <span className="font-semibold">AI 提示：</span> 試著找出語句不通順、重複或段落缺乏過渡的地方，提出具體修改建議。
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="hover:-translate-y-1 hover:shadow-[0_25px_45px_-25px_rgba(103,65,217,0.4)] transition-transform duration-300">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-base text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>

        <section className="rounded-[2.5rem] border border-brand-100 bg-white/80 p-12 shadow-soft">
          <h2 className="text-3xl font-semibold text-gray-900">四步驟打造寫作進步循環</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step} className="relative space-y-4 rounded-3xl bg-gradient-to-b from-brand-50 to-white p-6 shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-lg font-bold text-white shadow-lg">
                  {index + 1}
                </div>
                <p className="text-sm font-medium text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col items-center gap-6 rounded-[2.5rem] bg-gradient-to-r from-brand-500 to-brand-700 p-12 text-center text-white shadow-[0_35px_65px_-35px_rgba(69,33,169,0.45)]">
          <h2 className="text-3xl font-semibold">現在就開始你的作文進化旅程</h2>
          <p className="max-w-2xl text-base text-brand-50/90">
            免費體驗包含三篇 AI 模擬作文與完整批改流程，升級方案可解鎖成績追蹤、教師管理與更多題庫。
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" variant="outline" className="bg-white text-brand-700">
              <Link href="/register">免費註冊</Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="text-white">
              <Link href="/login">已有帳號？登入</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/60 bg-white/60 py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col justify-between gap-4 px-6 text-sm text-gray-500 md:flex-row">
          <p>© {new Date().getFullYear()} AI 中文作文導師. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="hover:text-brand-500">
              隱私權政策
            </Link>
            <Link href="/terms" className="hover:text-brand-500">
              服務條款
            </Link>
            <a href="mailto:hello@essaytutor.ai" className="hover:text-brand-500">
              聯絡我們
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
