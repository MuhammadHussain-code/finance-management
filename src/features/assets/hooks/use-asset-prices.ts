import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAssetPrice,
  fetchAssetPrices,
  fetchLatestPrices,
} from "@/features/assets/api/assets-api";

export function useAssetPrices(assetId?: string) {
  const queryClient = useQueryClient();

  const pricesQuery = useQuery({
    queryKey: ["prices", assetId],
    queryFn: () => fetchAssetPrices(assetId ?? ""),
    enabled: Boolean(assetId),
  });

  const createPrice = useMutation({
    mutationFn: createAssetPrice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prices", assetId] });
    },
  });

  return {
    ...pricesQuery,
    createPrice,
  };
}

export function useLatestPrices(userId?: string) {
  return useQuery({
    queryKey: ["latest-prices", userId],
    queryFn: () => fetchLatestPrices(userId ?? ""),
    enabled: Boolean(userId),
  });
}
