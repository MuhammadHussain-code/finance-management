import { createContext, useContext } from "react";
import type {
  ThemeMode,
  ThemePreferences,
  PaletteName,
  CustomColors,
} from "@/lib/supabase/types";

/**
 * Theme context value interface
 */
export interface ThemeContextValue {
  /** Current theme preferences */
  preferences: ThemePreferences;
  /** Resolved theme mode (accounts for system preference) */
  resolvedMode: "light" | "dark";
  /** Whether theme is loading from Supabase */
  isLoading: boolean;
  /** Whether theme sync encountered an error */
  hasError: boolean;
  /** Update theme mode */
  setMode: (mode: ThemeMode) => void;
  /** Update palette */
  setPalette: (palette: PaletteName) => void;
  /** Update custom colors (for advanced mode) */
  setCustomColors: (colors: CustomColors | null) => void;
  /** Reset to default theme */
  resetToDefault: () => void;
  /** Force sync with Supabase */
  syncWithServer: () => Promise<void>;
}

/**
 * Default context value (used when provider is missing)
 */
const defaultContextValue: ThemeContextValue = {
  preferences: {
    mode: "system",
    palette: "finance-calm",
    customColors: null,
  },
  resolvedMode: "light",
  isLoading: true,
  hasError: false,
  setMode: () => {},
  setPalette: () => {},
  setCustomColors: () => {},
  resetToDefault: () => {},
  syncWithServer: async () => {},
};

/**
 * Theme context
 */
export const ThemeContext = createContext<ThemeContextValue>(defaultContextValue);

/**
 * Hook to access theme context
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

/**
 * Storage key for localStorage
 */
export const THEME_STORAGE_KEY = "sip-tracker-theme";

/**
 * Get system color scheme preference
 */
export function getSystemPreference(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Resolve theme mode to actual light/dark value
 */
export function resolveThemeMode(mode: ThemeMode): "light" | "dark" {
  if (mode === "system") {
    return getSystemPreference();
  }
  return mode;
}

/**
 * Load theme from localStorage (for instant load)
 */
export function loadThemeFromStorage(): ThemePreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as ThemePreferences;
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

/**
 * Save theme to localStorage
 */
export function saveThemeToStorage(preferences: ThemePreferences): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    // Ignore storage errors (e.g., quota exceeded)
  }
}

/**
 * Clear theme from localStorage
 */
export function clearThemeStorage(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(THEME_STORAGE_KEY);
  } catch {
    // Ignore errors
  }
}
