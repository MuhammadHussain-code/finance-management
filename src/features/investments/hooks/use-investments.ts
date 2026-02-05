import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createInvestment,
  deleteInvestment,
  fetchInvestments,
} from "@/features/investments/api/investments-api";
import type { Investment } from "@/features/investments/types";

export function useInvestments(userId?: string) {
  const queryClient = useQueryClient();

  const investmentsQuery = useQuery({
    queryKey: ["investments", userId],
    queryFn: () => fetchInvestments(userId ?? ""),
    enabled: Boolean(userId),
  });

  const createMutation = useMutation({
    mutationFn: (payload: Partial<Investment> & { user_id: string }) =>
      createInvestment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["investments"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteInvestment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["investments"] });
    },
  });

  return {
    ...investmentsQuery,
    createInvestment: createMutation,
    deleteInvestment: deleteMutation,
  };
}
