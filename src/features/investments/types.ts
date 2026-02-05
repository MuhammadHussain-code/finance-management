export interface Investment {
  id: string;
  user_id: string;
  asset_id: string;
  amount: number;
  units: number | null;
  price_per_unit: number | null;
  investment_date: string;
  investment_type: "sip" | "lump_sum";
  notes?: string | null;
  created_at: string;
  updated_at: string;
}
