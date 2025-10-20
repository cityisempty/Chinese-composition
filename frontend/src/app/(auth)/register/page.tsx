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

interface RegisterForm {
  fullName: string;
  email: string;
  gradeLevel: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const registerAction = useAuthStore((state) => state.register);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    defaultValues: {
      fullName: "",
      email: "",
      gradeLevel: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");

  const onSubmit = async (values: RegisterForm) => {
    try {
      setIsLoading(true);
      await registerAction(values.email, values.password, values.fullName, values.gradeLevel);
      toast.success("註冊成功，歡迎加入！");
      router.replace("/dashboard");
    } catch (error) {
      toast.error((error as Error).message || "註冊失敗，請稍後再試");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-brand-100 via-white to-brand-50">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-16 px-6 py-16 md:flex-row">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl font-bold text-brand-800">註冊 AI 中文作文導師</h1>
          <p className="text-lg text-gray-600">
            建立帳號後即可使用 AI 模擬作文、多輪修訂與 AI 批改，全面提升閱讀與寫作能力。
          </p>
          <div className="rounded-3xl bg-white/70 p-6 shadow-soft">
            <p className="text-sm text-gray-500">已經是會員了嗎？</p>
            <Link href="/login" className="mt-2 inline-block text-sm font-semibold text-brand-600 hover:text-brand-500">
              立即登入 →
            </Link>
          </div>
        </div>

        <div className="flex-1">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 rounded-3xl bg-white/90 p-8 shadow-[0_30px_60px_-35px_rgba(103,65,217,0.45)] backdrop-blur"
          >
            <div>
              <Label htmlFor="fullName">姓名</Label>
              <Input id="fullName" placeholder="王小明" {...register("fullName", { required: "請輸入姓名" })} />
              {errors.fullName && (
                <p className="mt-2 text-sm text-rose-500">{errors.fullName.message}</p>
              )}
            </div>

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
              <Label htmlFor="gradeLevel">年級</Label>
              <Input
                id="gradeLevel"
                placeholder="例：國中二年級"
                {...register("gradeLevel", { required: "請輸入年級或學習階段" })}
              />
              {errors.gradeLevel && (
                <p className="mt-2 text-sm text-rose-500">{errors.gradeLevel.message}</p>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="password">密碼</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="至少 8 碼"
                  {...register("password", {
                    required: "請輸入密碼",
                    minLength: {
                      value: 8,
                      message: "密碼至少 8 碼",
                    },
                  })}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-rose-500">{errors.password.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="confirmPassword">確認密碼</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="再次輸入密碼"
                  {...register("confirmPassword", {
                    required: "請再次輸入密碼",
                    validate: (value) => value === passwordValue || "兩次密碼不一致",
                  })}
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-rose-500">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? "註冊中..." : "建立帳號"}
            </Button>

            <p className="text-center text-xs text-gray-500">
              註冊即表示你同意我們的
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
