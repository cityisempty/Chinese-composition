import { SubscriptionPlan, SubscriptionStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

type Plan = keyof typeof SubscriptionPlan;

export const upsertSubscription = async (userId: string, plan: Plan) => {
  const now = new Date();
  const nextMonth = new Date(now);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const subscription = await prisma.subscription.upsert({
    where: { userId },
    update: {
      plan: SubscriptionPlan[plan],
      status: SubscriptionStatus.ACTIVE,
      startedAt: now,
      currentPeriodEndsAt: nextMonth,
    },
    create: {
      userId,
      plan: SubscriptionPlan[plan],
      status: SubscriptionStatus.ACTIVE,
      startedAt: now,
      currentPeriodEndsAt: nextMonth,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          fullName: true,
        },
      },
    },
  });

  return subscription;
};

export const getSubscription = async (userId: string) => {
  return prisma.subscription.findUnique({ where: { userId } });
};
