"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginForm) => {
    try {
      setIsLoading(true);
      await login(values.email, values.password);
      toast.success("登入成功，歡迎回來！");
      router.replace("/dashboard");
    } catch (error) {
      toast.error((error as Error).message || "登入失敗，請再試一次");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-16 px-6 py-16 md:flex-row">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl font-bold text-brand-800">AI 中文作文導師</h1>
          <p className="text-lg text-gray-600">
            登入以繼續你的寫作旅程，查看練習紀錄、批改成果，並與 AI 導師一起進步。
          </p>
          <div className="rounded-3xl bg-white/70 p-6 shadow-soft">
            <p className="text-sm text-gray-500">還沒有帳號嗎？</p>
            <Link href="/register" className="mt-2 inline-block text-sm font-semibold text-brand-600 hover:text-brand-500">
              立即註冊 →
            </Link>
          </div>
        </div>

        <div className="flex-1">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 rounded-3xl bg-white/90 p-8 shadow-[0_30px_60px_-35px_rgba(103,65,217,0.45)] backdrop-blur"
          >
            <div>
              <Label htmlFor="email">電子郵件</Label>
              <Input
                id="email"
                type="email"
                placeholder="student@example.com"
                {...register("email", { required: "請輸入電子郵件" })}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-rose-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">密碼</Label>
              <Input
                id="password"
                type="password"
                placeholder="請輸入密碼"
                {...register("password", { required: "請輸入密碼" })}
              />
              {errors.password && (
                <p className="mt-2 text-sm text-rose-500">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? "登入中..." : "登入"}
            </Button>

            <p className="text-center text-xs text-gray-500">
              登入即表示你同意我們的
              <Link href="/terms" className="text-brand-600 hover:text-brand-500">
                《服務條款》
              </Link>
              與
              <Link href="/privacy" className="text-brand-600 hover:text-brand-500">
                《隱私權政策》
              </Link>
              。
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
