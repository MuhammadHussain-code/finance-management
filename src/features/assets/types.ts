export interface Asset {
  id: string;
  user_id: string;
  name: string;
  category_id: string;
  symbol?: string | null;
  notes?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AssetPrice {
  id: string;
  asset_id: string;
  user_id: string;
  price: number;
  price_date: string;
  source: string;
  created_at: string;
}
