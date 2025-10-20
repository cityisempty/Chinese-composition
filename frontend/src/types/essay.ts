export type EssayStatus = "DRAFT" | "REVIEWING" | "COMPLETED";

export interface EssaySummary {
  id: string;
  gradeLevel: string;
  essayType: string;
  status: EssayStatus;
  createdAt: string;
  updatedAt: string;
  studentRating?: number | null;
  aiRating?: number | null;
}

export interface EssayRevision {
  id: string;
  iteration: number;
  reviewer: "STUDENT" | "AI";
  feedback: string;
  rating?: number | null;
  revisedText?: string | null;
  createdAt: string;
}

export interface EssayDetail extends EssaySummary {
  requirements: string;
  prompt: string;
  aiDraft: string;
  currentText: string;
  studentRating?: number | null;
  aiRating?: number | null;
  aiCommentary?: string | null;
  revisions: EssayRevision[];
}
