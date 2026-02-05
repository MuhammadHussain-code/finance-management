import type { Asset } from "@/features/assets/types";

export interface PriceData {
  price: number;
  date: Date;
  source: string;
}

export interface PriceProvider {
  name: string;
  fetchPrice: (symbol: string) => Promise<PriceData | null>;
  getSupportedCategories: () => Array<Asset["category_id"]>;
}
