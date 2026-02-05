import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAsset, deleteAsset, fetchAssets, updateAsset } from "@/features/assets/api/assets-api";
import type { Database } from "@/lib/supabase/types";

type AssetInsert = Database["public"]["Tables"]["assets"]["Insert"];
type AssetUpdate = Database["public"]["Tables"]["assets"]["Update"];

export function useAssets(userId?: string) {
  const queryClient = useQueryClient();

  const assetsQuery = useQuery({
    queryKey: ["assets", userId],
    queryFn: () => fetchAssets(userId ?? ""),
    enabled: Boolean(userId),
  });

  const createMutation = useMutation({
    mutationFn: (payload: AssetInsert) => createAsset(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AssetUpdate }) =>
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
