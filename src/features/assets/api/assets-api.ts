import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";
import type { Asset, AssetPrice } from "@/features/assets/types";

type AssetInsert = Database["public"]["Tables"]["assets"]["Insert"];
type AssetUpdate = Database["public"]["Tables"]["assets"]["Update"];
type AssetPriceInsert = Database["public"]["Tables"]["price_history"]["Insert"];

function normalizePrice(row: AssetPrice): AssetPrice {
  return {
    ...row,
    price: Number(row.price),
  };
}

export async function fetchAssets(userId: string) {
  const { data, error } = await supabase
    .from("assets")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Asset[];
}

export async function fetchAssetById(id: string) {
  const { data, error } = await supabase.from("assets").select("*").eq("id", id).single();
  if (error) throw error;
  return data as Asset;
}

export async function createAsset(payload: AssetInsert) {
  const { data, error } = await supabase.from("assets").insert(payload).select("*").single();
  if (error) throw error;
  return data as Asset;
}

export async function updateAsset(id: string, payload: AssetUpdate) {
  const { data, error } = await supabase
    .from("assets")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as Asset;
}

export async function deleteAsset(id: string) {
  const { error } = await supabase.from("assets").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchAssetPrices(assetId: string) {
  const { data, error } = await supabase
    .from("price_history")
    .select("*")
    .eq("asset_id", assetId)
    .order("price_date", { ascending: false });
  if (error) throw error;
  return (data as AssetPrice[]).map(normalizePrice);
}

export async function createAssetPrice(payload: AssetPriceInsert) {
  const { data, error } = await supabase
    .from("price_history")
    .upsert(payload, {
      onConflict: "asset_id,price_date",
      ignoreDuplicates: false,
    })
    .select("*")
    .single();
  if (error) throw error;
  return normalizePrice(data as AssetPrice);
}

export async function fetchLatestPrices(userId: string) {
  const { data, error } = await supabase
    .from("price_history")
    .select("*")
    .eq("user_id", userId)
    .order("price_date", { ascending: false });

  if (error) throw error;
  const latestByAsset: Record<string, AssetPrice> = {};
  (data as AssetPrice[]).map(normalizePrice).forEach((price) => {
    if (!latestByAsset[price.asset_id]) {
      latestByAsset[price.asset_id] = price;
    }
  });
  return latestByAsset;
}
