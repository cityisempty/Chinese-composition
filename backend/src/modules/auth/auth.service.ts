import { prisma } from "@/lib/prisma";
import { AppError } from "@/utils/appError";
import { comparePassword, hashPassword } from "@/utils/password";

export const registerUser = async (
  email: string,
  password: string,
  fullName: string,
  gradeLevel?: string
) => {
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    throw new AppError("此電子郵件已完成註冊", 409);
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      fullName,
      gradeLevel,
    },
  });

  return user;
};

export const authenticateUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError("帳號或密碼錯誤", 401);
  }

  const isValid = await comparePassword(password, user.passwordHash);

  if (!isValid) {
    throw new AppError("帳號或密碼錯誤", 401);
  }

  return user;
};

export const getUserProfile = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      gradeLevel: true,
      createdAt: true,
      subscription: true,
    },
  });
};
