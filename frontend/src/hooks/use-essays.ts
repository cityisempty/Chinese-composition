"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api-client";
import { EssayDetail, EssaySummary } from "@/types/essay";

export const useEssayList = (enabled: boolean) => {
  return useQuery({
    queryKey: ["essays"],
    queryFn: () =>
      apiFetch<{ essays: EssaySummary[] }>("/essays", {
        auth: true,
      }).then((res) => res.essays),
    enabled,
  });
};

export const useEssayDetail = (essayId: string | null) => {
  return useQuery({
    queryKey: ["essays", essayId],
    queryFn: () =>
      apiFetch<{ essay: EssayDetail }>(`/essays/${essayId}`, {
        auth: true,
      }).then((res) => res.essay),
    enabled: Boolean(essayId),
  });
};

export const useGenerateEssay = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      gradeLevel: string;
      essayType: string;
      requirements: string;
      prompt: string;
    }) =>
      apiFetch<{ essay: EssayDetail }>("/essays/generate", {
        method: "POST",
        body: JSON.stringify(payload),
        auth: true,
      }).then((res) => res.essay),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["essays"] });
    },
  });
};

export const useReviewEssay = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { essayId: string; rating: number; feedback: string }) =>
      apiFetch<{ essay: EssayDetail }>(`/essays/${payload.essayId}/review`, {
        method: "POST",
        body: JSON.stringify({ rating: payload.rating, feedback: payload.feedback }),
        auth: true,
      }).then((res) => res.essay),
    onSuccess: (essay) => {
      queryClient.invalidateQueries({ queryKey: ["essays", essay.id] });
      queryClient.invalidateQueries({ queryKey: ["essays"] });
    },
  });
};

export const useReviseEssay = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { essayId: string; instructions: string }) =>
      apiFetch<{ essay: EssayDetail }>(`/essays/${payload.essayId}/revise`, {
        method: "POST",
        body: JSON.stringify({ instructions: payload.instructions }),
        auth: true,
      }).then((res) => res.essay),
    onSuccess: (essay) => {
      queryClient.invalidateQueries({ queryKey: ["essays", essay.id] });
    },
  });
};

export const useFinalizeEssay = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (essayId: string) =>
      apiFetch<{ essay: EssayDetail }>(`/essays/${essayId}/finalize`, {
        method: "POST",
        auth: true,
      }).then((res) => res.essay),
    onSuccess: (essay) => {
      queryClient.invalidateQueries({ queryKey: ["essays", essay.id] });
      queryClient.invalidateQueries({ queryKey: ["essays"] });
    },
  });
};
