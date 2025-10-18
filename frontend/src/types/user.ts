export interface SubscriptionInfo {
  id: string;
  plan: "FREE" | "PRO" | "TEAM";
  status: "ACTIVE" | "INACTIVE" | "CANCELED";
  startedAt: string;
  currentPeriodEndsAt?: string | null;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  gradeLevel?: string | null;
  createdAt?: string;
  subscription?: SubscriptionInfo | null;
}
