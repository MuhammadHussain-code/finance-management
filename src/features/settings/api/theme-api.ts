import { supabase } from "@/lib/supabase/client";
import type { ThemePreferences } from "@/lib/supabase/types";
import { DEFAULT_THEME_PREFERENCES } from "@/lib/supabase/types";

/**
 * Fetch user's theme preferences from Supabase
 */
export async function fetchThemePreferences(
  userId: string
): Promise<ThemePreferences | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("theme_preferences")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching theme preferences:", error);
    return null;
  }

  // Handle case where theme_preferences is null or missing
  if (!data?.theme_preferences) {
    return DEFAULT_THEME_PREFERENCES;
  }

  // Validate and merge with defaults to handle partial data
  return {
    ...DEFAULT_THEME_PREFERENCES,
    ...(data.theme_preferences as ThemePreferences),
  };
}

/**
 * Save user's theme preferences to Supabase
 */
export async function saveThemePreferences(
  userId: string,
  preferences: ThemePreferences
): Promise<boolean> {
  const { error } = await supabase
    .from("profiles")
    .update({
      theme_preferences: preferences,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    console.error("Error saving theme preferences:", error);
    return false;
  }

  return true;
}

/**
 * Reset user's theme preferences to defaults
 */
export async function resetThemePreferences(userId: string): Promise<boolean> {
  return saveThemePreferences(userId, DEFAULT_THEME_PREFERENCES);
}
