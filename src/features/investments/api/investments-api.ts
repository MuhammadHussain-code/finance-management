import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";
import type { Investment } from "@/features/investments/types";

type InvestmentInsert = Database["public"]["Tables"]["investments"]["Insert"];

function normalizeInvestment(row: Investment): Investment {
  return {
    ...row,
    amount: Number(row.amount),
    units: row.units === null ? null : Number(row.units),
    price_per_unit: row.price_per_unit === null ? null : Number(row.price_per_unit),
  };
}

export async function fetchInvestments(userId: string) {
  const { data, error } = await supabase
    .from("investments")
    .select("*")
    .eq("user_id", userId)
    .order("investment_date", { ascending: false });

  if (error) throw error;
  return (data as Investment[]).map(normalizeInvestment);
}

export async function createInvestment(payload: InvestmentInsert) {
  const { data, error } = await supabase
    .from("investments")
    .insert(payload)
    .select("*")
    .single();
  if (error) throw error;
  return normalizeInvestment(data as Investment);
}

export async function deleteInvestment(id: string) {
  const { error } = await supabase.from("investments").delete().eq("id", id);
  if (error) throw error;
}
