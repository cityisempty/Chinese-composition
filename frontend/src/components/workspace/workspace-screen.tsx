"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, ListChecks, Loader2 } from "lucide-react";

import { Protected } from "@/components/protected";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useEssayDetail,
  useEssayList,
  useFinalizeEssay,
  useGenerateEssay,
  useReviewEssay,
  useReviseEssay,
} from "@/hooks/use-essays";
import { useAuthStore } from "@/store/auth";
import { EssayRevision, EssayStatus } from "@/types/essay";

interface GenerateForm {
  gradeLevel: string;
  essayType: string;
  requirements: string;
  prompt: string;
}

interface ReviewForm {
  rating: number;
  feedback: string;
}

interface ReviseForm {
  instructions: string;
}

const statusText: Record<EssayStatus, string> = {
  DRAFT: "等待學生批改",
  REVIEWING: "批改中",
  COMPLETED: "已完成",
};

const formDefault: GenerateForm = {
  gradeLevel: "國中二年級",
  essayType: "敘事文",
  requirements: "需包含開頭、經過、結尾並展現反思",
  prompt: "一次讓我成長的校園活動",
};

export const WorkspaceScreen = () => {
  const token = useAuthStore((state) => state.token);
  const { data: essayList } = useEssayList(Boolean(token));
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedEssayId, setSelectedEssayId] = useState<string | null>(null);

  useEffect(() => {
    const essayId = searchParams.get("essayId");
    if (essayId) {
      setSelectedEssayId(essayId);
    }
  }, [searchParams]);

  const generateForm = useForm<GenerateForm>({
    defaultValues: formDefault,
  });

  const reviewForm = useForm<ReviewForm>({
    defaultValues: { rating: 75, feedback: "" },
  });

  const reviseForm = useForm<ReviseForm>({
    defaultValues: { instructions: "請強化段落銜接並補上具體例子" },
  });

  const essayId = selectedEssayId;
  const {
    data: essay,
    isLoading: isEssayLoading,
    refetch,
  } = useEssayDetail(essayId);

  useEffect(() => {
    if (essay) {
      reviewForm.reset({ rating: essay.studentRating ?? 75, feedback: "" });
      reviseForm.reset({ instructions: "請加強段落連結與結尾反思" });
    }
  }, [essay, reviewForm, reviseForm]);

  const generateEssay = useGenerateEssay();
  const reviewEssay = useReviewEssay();
  const reviseEssay = useReviseEssay();
  const finalizeEssay = useFinalizeEssay();

  const handleGenerate = async (values: GenerateForm) => {
    try {
      const result = await generateEssay.mutateAsync(values);
      toast.success("已生成模擬作文，開始批改吧！");
      setSelectedEssayId(result.id);
      router.replace(`/workspace?essayId=${result.id}`);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleReview = async (values: ReviewForm) => {
    if (!essay) return;
    try {
      await reviewEssay.mutateAsync({
        essayId: essay.id,
        rating: values.rating,
        feedback: values.feedback,
      });
      toast.success("已提交自我批改，請查看 AI 修訂建議");
      reviewForm.reset({ rating: values.rating, feedback: "" });
      await refetch();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleRevise = async (values: ReviseForm) => {
    if (!essay) return;
    try {
      const updated = await reviseEssay.mutateAsync({
        essayId: essay.id,
        instructions: values.instructions,
      });
      toast.success("AI 已根據指示更新作文");
      reviseForm.reset({ instructions: values.instructions });
      setSelectedEssayId(updated.id);
      await refetch();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleFinalize = async () => {
    if (!essay) return;
    try {
      await finalizeEssay.mutateAsync(essay.id);
      toast.success("AI 導師已完成評分");
      await refetch();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const revisions = useMemo(() => {
    return [...(essay?.revisions ?? [])].sort((a, b) => a.iteration - b.iteration);
  }, [essay?.revisions]);

  return (
    <Protected>
      <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回
            </Button>
            <h1 className="text-3xl font-semibold text-brand-800">AI 作文工作坊</h1>
          </div>

          <div className="grid gap-8 lg:grid-cols-[370px_minmax(0,1fr)]">
            <div className="space-y-6">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>生成模擬作文</CardTitle>
                  <CardDescription>
                    自訂條件讓 AI 生成含有常見錯誤的初稿，開始批改練習。
                  </CardDescription>
                </CardHeader>
                <form className="space-y-4 px-6 pb-6" onSubmit={generateForm.handleSubmit(handleGenerate)}>
                  <div className="space-y-1">
                    <Label htmlFor="gradeLevel">年級</Label>
                    <Input id="gradeLevel" {...generateForm.register("gradeLevel", { required: true })} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="essayType">作文類型</Label>
                    <Input id="essayType" {...generateForm.register("essayType", { required: true })} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="requirements">寫作要求</Label>
                    <Textarea
                      id="requirements"
                      rows={3}
                      {...generateForm.register("requirements", { required: true })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="prompt">題目 / 主題</Label>
                    <Input id="prompt" {...generateForm.register("prompt", { required: true })} />
                  </div>
                  <Button type="submit" className="w-full" disabled={generateEssay.isPending}>
                    {generateEssay.isPending ? "生成中..." : "生成模擬作文"}
                  </Button>
                </form>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>歷史練習</CardTitle>
                  <CardDescription>選擇已有作文繼續批改與修訂。</CardDescription>
                </CardHeader>
                <div className="flex max-h-64 flex-col gap-3 overflow-y-auto px-6 pb-6">
                  {essayList && essayList.length > 0 ? (
                    essayList.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSelectedEssayId(item.id);
                          router.replace(`/workspace?essayId=${item.id}`);
                        }}
                        className={`flex flex-col items-start rounded-2xl border px-4 py-3 text-left transition ${
                          item.id === essayId
                            ? "border-brand-400 bg-brand-50 text-brand-700"
                            : "border-transparent bg-white/80 hover:border-brand-200"
                        }`}
                      >
                        <span className="text-sm font-semibold">{item.essayType}</span>
                        <span className="text-xs text-gray-500">{item.gradeLevel}</span>
                        <span className="mt-1 text-xs text-gray-400">狀態：{statusText[item.status]}</span>
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">目前尚無練習紀錄。</p>
                  )}
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              {isEssayLoading ? (
                <div className="flex h-full min-h-[500px] items-center justify-center rounded-[2.5rem] border border-brand-100 bg-white/70">
                  <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
                </div>
              ) : essay ? (
                <div className="space-y-6">
                  <Card className="shadow-soft">
                    <CardHeader>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <CardTitle className="text-2xl text-brand-800">{essay.prompt}</CardTitle>
                          <CardDescription>
                            {essay.gradeLevel}｜{essay.essayType}
                          </CardDescription>
                        </div>
                        <Badge variant={essay.status === "COMPLETED" ? "success" : essay.status === "REVIEWING" ? "warning" : "default"}>
                          {statusText[essay.status]}
                        </Badge>
                      </div>
                    </CardHeader>
                    <div className="space-y-4 px-6 pb-6">
                      <div className="rounded-3xl bg-white/90 p-6 shadow-inner">
                        <p className="text-xs font-semibold text-brand-500">最新版本</p>
                        <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-gray-700">
                          {essay.currentText}
                        </p>
                      </div>
                      {essay.aiCommentary && (
                        <div className="rounded-3xl bg-brand-50/80 p-6 text-sm text-brand-800">
                          <p className="font-semibold">AI 導師評語</p>
                          <p className="mt-2 whitespace-pre-line">{essay.aiCommentary}</p>
                        </div>
                      )}
                    </div>
                  </Card>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>學生自評</CardTitle>
                        <CardDescription>評分並說明需要改進的地方。</CardDescription>
                      </CardHeader>
                      <form className="space-y-4 px-6 pb-6" onSubmit={reviewForm.handleSubmit(handleReview)}>
                        <div>
                          <Label htmlFor="rating">自評分數</Label>
                          <Input
                            id="rating"
                            type="number"
                            min={0}
                            max={100}
                            {...reviewForm.register("rating", { valueAsNumber: true })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="feedback">關鍵問題</Label>
                          <Textarea id="feedback" rows={3} {...reviewForm.register("feedback", { required: true })} />
                        </div>
                        <Button type="submit" className="w-full" disabled={reviewEssay.isPending}>
                          {reviewEssay.isPending ? "提交中..." : "提交自評"}
                        </Button>
                      </form>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>AI 修訂</CardTitle>
                        <CardDescription>輸入修訂指示讓 AI 改寫文章。</CardDescription>
                      </CardHeader>
                      <form className="space-y-4 px-6 pb-6" onSubmit={reviseForm.handleSubmit(handleRevise)}>
                        <div>
                          <Label htmlFor="instructions">修訂指示</Label>
                          <Textarea id="instructions" rows={4} {...reviseForm.register("instructions", { required: true })} />
                        </div>
                        <Button type="submit" className="w-full" disabled={reviseEssay.isPending}>
                          {reviseEssay.isPending ? "修訂中..." : "請 AI 修訂"}
                        </Button>
                      </form>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>修訂歷程</CardTitle>
                      <CardDescription>追蹤每一次批改與 AI 回饋。</CardDescription>
                    </CardHeader>
                    <div className="space-y-4 px-6 pb-6">
                      {revisions.length === 0 ? (
                        <p className="text-sm text-gray-500">尚無修訂紀錄。</p>
                      ) : (
                        <div className="space-y-4">
                          {revisions.map((revision) => (
                            <RevisionItem key={revision.id} revision={revision} />
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-brand-500" />
                      <p className="text-sm text-gray-600">
                        完成所有修訂後可請 AI 導師給出最終成績與建議。
                      </p>
                    </div>
                    <Button
                      size="lg"
                      onClick={handleFinalize}
                      disabled={finalizeEssay.isPending || essay.status === "COMPLETED"}
                    >
                      {finalizeEssay.isPending ? "批改中..." : essay.status === "COMPLETED" ? "已完成批改" : "完成並請 AI 批改"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="rounded-[2.5rem] border border-dashed border-brand-200 bg-white/70 p-16 text-center text-gray-500">
                  <ListChecks className="mx-auto mb-6 h-12 w-12 text-brand-300" />
                  <h2 className="text-2xl font-semibold text-brand-700">從左側建立你的第一篇作文</h2>
                  <p className="mt-2 text-sm">
                    指定年級與題型後，AI 會生成帶有常見錯誤的文章，讓你練習批改與修訂。
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Protected>
  );
};

const RevisionItem = ({ revision }: { revision: EssayRevision }) => {
  const isStudent = revision.reviewer === "STUDENT";
  return (
    <div className="rounded-3xl border border-brand-100 bg-white/80 p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-brand-700">
          {isStudent ? "學生批改" : "AI 修訂"}
          <span className="text-xs text-gray-400">第 {revision.iteration} 輪</span>
        </div>
        {revision.rating !== undefined && revision.rating !== null && (
          <Badge variant={isStudent ? "warning" : "success"}>{revision.rating} 分</Badge>
        )}
      </div>
      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-600">
        {revision.feedback}
      </p>
      {revision.revisedText && (
        <div className="mt-3 rounded-2xl bg-gray-50/80 p-3 text-xs text-gray-500">
          {revision.revisedText}
        </div>
      )}
    </div>
  );
};
