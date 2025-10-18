"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, BookOpenCheck, FilePlus, Trophy } from "lucide-react";

import { Protected } from "@/components/protected";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEssayList } from "@/hooks/use-essays";
import { useAuthStore } from "@/store/auth";
import { EssayStatus } from "@/types/essay";

const statusLabel: Record<EssayStatus, string> = {
  DRAFT: "待批改",
  REVIEWING: "批改中",
  COMPLETED: "已完成",
};

const statusBadge: Record<EssayStatus, "default" | "warning" | "success"> = {
  DRAFT: "default",
  REVIEWING: "warning",
  COMPLETED: "success",
};

export const DashboardScreen = () => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const { data: essays, isFetching } = useEssayList(Boolean(token));

  const stats = useMemo(() => {
    const initial = {
      total: essays?.length ?? 0,
      completed: essays?.filter((essay) => essay.status === "COMPLETED").length ?? 0,
    };
    return initial;
  }, [essays]);

  return (
    <Protected>
      <div className="min-h-screen bg-gradient-to-b from-white to-brand-50">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8">
          <div>
            <p className="text-sm text-gray-500">歡迎回來，</p>
            <h1 className="text-2xl font-semibold text-brand-800">{user?.fullName ?? "學生"}</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={logout}>
              登出
            </Button>
            <Button asChild>
              <Link href="/workspace" className="flex items-center gap-2">
                開始練習
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-20">
          <section className="grid gap-6 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-brand-500 to-brand-600 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <FilePlus className="h-6 w-6" />
                  累積練習篇數
                </CardTitle>
                <CardDescription className="text-brand-50/90">
                  {isFetching ? "載入中..." : `${stats.total} 篇`}（含進行中）
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-brand-700">
                  <BookOpenCheck className="h-6 w-6" />
                  已完成批改
                </CardTitle>
                <CardDescription>
                  {isFetching ? "載入中..." : `${stats.completed} 篇完成 AI 導師評語`}
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-brand-700">
                  <Trophy className="h-6 w-6" />
                  當前方案
                </CardTitle>
                <CardDescription>
                  {user?.subscription?.plan === "PRO" ? "PRO 方案" : user?.subscription?.plan === "TEAM" ? "教師 / 團隊方案" : "免費方案"}
                </CardDescription>
              </CardHeader>
            </Card>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-brand-800">近期作文練習</h2>
              <Button asChild variant="ghost">
                <Link href="/workspace" className="flex items-center gap-2">
                  建立新作文
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-lg backdrop-blur">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="text-left text-sm text-gray-500">
                    <th className="px-6 py-4">題型 / 年級</th>
                    <th className="px-6 py-4">狀態</th>
                    <th className="px-6 py-4">學生評分</th>
                    <th className="px-6 py-4">AI 評分</th>
                    <th className="px-6 py-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {isFetching && (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                        讀取練習中...
                      </td>
                    </tr>
                  )}
                  {!isFetching && (!essays || essays.length === 0) && (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                        尚未有作文練習，快到工作坊開始第一篇吧！
                      </td>
                    </tr>
                  )}
                  {!isFetching &&
                    essays?.map((essay) => (
                      <tr key={essay.id} className="border-t border-gray-100 text-sm">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-800">{essay.essayType}</div>
                          <div className="text-xs text-gray-500">{essay.gradeLevel}</div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={statusBadge[essay.status]}>{statusLabel[essay.status]}</Badge>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {essay.studentRating ? `${essay.studentRating} 分` : "—"}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {essay.aiRating ? `${essay.aiRating} 分` : "—"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/workspace?essayId=${essay.id}`}
                            className="text-sm font-semibold text-brand-600 hover:text-brand-500"
                          >
                            查看詳情
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </Protected>
  );
};
