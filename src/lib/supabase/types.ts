export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/**
 * Theme mode options
 */
export type ThemeMode = "light" | "dark" | "system";

/**
 * Available preset palette names
 */
export type PaletteName = "finance-calm" | "neutral" | "soft-green" | "warm" | "custom";

/**
 * Custom color overrides for advanced users
 */
export interface CustomColors {
  primary?: string; // HSL values as "H S% L%"
  accent?: string;
  chartPositive?: string;
  chartNegative?: string;
}

/**
 * User theme preferences stored in Supabase
 */
export interface ThemePreferences {
  mode: ThemeMode;
  palette: PaletteName;
  customColors?: CustomColors | null;
}

/**
 * Default theme preferences
 */
export const DEFAULT_THEME_PREFERENCES: ThemePreferences = {
  mode: "system",
  palette: "finance-calm",
  customColors: null,
};

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          currency: string | null;
          theme_preferences: ThemePreferences | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          currency?: string | null;
          theme_preferences?: ThemePreferences | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      assets: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category_id: string;
          symbol: string | null;
          currency: string;
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
          currency?: string;
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["assets"]["Insert"]>;
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
