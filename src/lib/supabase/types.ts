export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          currency: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          currency?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      assets: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category_id: string;
          symbol: string | null;
          notes: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          category_id: string;
          symbol?: string | null;
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["assets"]["Insert"]>;
      };
      investments: {
        Row: {
          id: string;
          user_id: string;
          asset_id: string;
          amount: number;
          units: number | null;
          price_per_unit: number | null;
          investment_date: string;
          investment_type: "sip" | "lump_sum";
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          asset_id: string;
          amount: number;
          units?: number | null;
          price_per_unit?: number | null;
          investment_date: string;
          investment_type: "sip" | "lump_sum";
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["investments"]["Insert"]>;
      };
      price_history: {
        Row: {
          id: string;
          asset_id: string;
          user_id: string;
          price: number;
          price_date: string;
          source: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          asset_id: string;
          user_id: string;
          price: number;
          price_date: string;
          source?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["price_history"]["Insert"]>;
      };
      asset_categories: {
        Row: {
          id: string;
          label: string;
          sort_order: number;
        };
        Insert: {
          id: string;
          label: string;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["asset_categories"]["Insert"]>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
