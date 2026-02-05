import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAsset, deleteAsset, fetchAssets, updateAsset } from "@/features/assets/api/assets-api";
import type { Asset } from "@/features/assets/types";

export function useAssets(userId?: string) {
  const queryClient = useQueryClient();

  const assetsQuery = useQuery({
    queryKey: ["assets", userId],
    queryFn: () => fetchAssets(userId ?? ""),
    enabled: Boolean(userId),
  });

  const createMutation = useMutation({
    mutationFn: (payload: Partial<Asset> & { user_id: string }) => createAsset(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Asset> }) =>
      updateAsset(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAsset(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });

  return {
    ...assetsQuery,
    createAsset: createMutation,
    updateAsset: updateMutation,
    deleteAsset: deleteMutation,
  };
}
