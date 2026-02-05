import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  ThemeMode,
  ThemePreferences,
  PaletteName,
  CustomColors,
} from "@/lib/supabase/types";
import { DEFAULT_THEME_PREFERENCES } from "@/lib/supabase/types";
import {
  ThemeContext,
  resolveThemeMode,
  loadThemeFromStorage,
  saveThemeToStorage,
} from "@/features/settings/hooks/use-theme";
import {
  fetchThemePreferences,
  saveThemePreferences,
} from "@/features/settings/api/theme-api";
import {
  getPalette,
  applyPaletteToDocument,
  type PaletteColors,
} from "@/features/settings/lib/palettes";
import { useAuth } from "@/features/auth/hooks/use-auth";

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Apply custom color overrides to a palette
 */
function applyCustomColors(
  palette: PaletteColors,
  customColors: CustomColors | null | undefined
): PaletteColors {
  if (!customColors) return palette;

  return {
    ...palette,
    ...(customColors.primary && { primary: customColors.primary }),
    ...(customColors.accent && { accent: customColors.accent }),
    ...(customColors.chartPositive && {
      chartPositive: customColors.chartPositive,
    }),
    ...(customColors.chartNegative && {
      chartNegative: customColors.chartNegative,
    }),
  };
}

/**
 * ThemeProvider manages theme state, persistence, and CSS variable application.
 *
 * Loading strategy:
 * 1. On mount, immediately load from localStorage (no flash)
 * 2. When user authenticates, sync with Supabase
 * 3. On change, update localStorage immediately, debounce Supabase save
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<ThemePreferences>(() => {
    // Initialize from localStorage or use defaults
    return loadThemeFromStorage() ?? DEFAULT_THEME_PREFERENCES;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Track if we've synced with server for this user
  const syncedUserRef = useRef<string | null>(null);
  // Debounce timer for server save
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Calculate resolved mode (accounting for system preference)
  const resolvedMode = useMemo(
    () => resolveThemeMode(preferences.mode),
    [preferences.mode]
  );

  // Apply theme to document whenever preferences or resolved mode changes
  useEffect(() => {
    const palette = getPalette(preferences.palette);
    const colors = resolvedMode === "dark" ? palette.dark : palette.light;
    const finalColors = applyCustomColors(colors, preferences.customColors);

    applyPaletteToDocument(finalColors, resolvedMode === "dark");
  }, [preferences, resolvedMode]);

  // Listen for system preference changes
  useEffect(() => {
    if (preferences.mode !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      // Re-apply theme when system preference changes
      const palette = getPalette(preferences.palette);
      const isDark = mediaQuery.matches;
      const colors = isDark ? palette.dark : palette.light;
      const finalColors = applyCustomColors(colors, preferences.customColors);
      applyPaletteToDocument(finalColors, isDark);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [preferences]);

  // Sync with Supabase when user changes
  useEffect(() => {
    if (!user) {
      // User logged out - keep local preferences, mark as not loading
      syncedUserRef.current = null;
      setIsLoading(false);
      return;
    }

    // Skip if already synced for this user
    if (syncedUserRef.current === user.id) {
      return;
    }

    let isMounted = true;

    async function syncWithServer() {
      setIsLoading(true);
      setHasError(false);

      try {
        const serverPrefs = await fetchThemePreferences(user!.id);

        if (!isMounted) return;

        if (serverPrefs) {
          // Server has preferences - use them
          setPreferences(serverPrefs);
          saveThemeToStorage(serverPrefs);
        } else {
          // No server preferences - save current local preferences to server
          const currentPrefs = loadThemeFromStorage() ?? DEFAULT_THEME_PREFERENCES;
          await saveThemePreferences(user!.id, currentPrefs);
        }

        syncedUserRef.current = user!.id;
      } catch (error) {
        console.error("Theme sync error:", error);
        if (isMounted) {
          setHasError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    syncWithServer();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Save preferences (local + debounced server)
  const persistPreferences = useCallback(
    (newPrefs: ThemePreferences) => {
      // Save to localStorage immediately
      saveThemeToStorage(newPrefs);

      // Clear existing debounce timer
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      // Debounce server save (500ms)
      if (user) {
        saveTimerRef.current = setTimeout(() => {
          saveThemePreferences(user.id, newPrefs).catch((error) => {
            console.error("Failed to save theme to server:", error);
          });
        }, 500);
      }
    },
    [user]
  );

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  // Theme setters
  const setMode = useCallback(
    (mode: ThemeMode) => {
      const newPrefs = { ...preferences, mode };
      setPreferences(newPrefs);
      persistPreferences(newPrefs);
    },
    [preferences, persistPreferences]
  );

  const setPalette = useCallback(
    (palette: PaletteName) => {
      const newPrefs = { ...preferences, palette, customColors: null };
      setPreferences(newPrefs);
      persistPreferences(newPrefs);
    },
    [preferences, persistPreferences]
  );

  const setCustomColors = useCallback(
    (customColors: CustomColors | null) => {
      const newPrefs = {
        ...preferences,
        palette: customColors ? "custom" : preferences.palette,
        customColors,
      } as ThemePreferences;
      setPreferences(newPrefs);
      persistPreferences(newPrefs);
    },
    [preferences, persistPreferences]
  );

  const resetToDefault = useCallback(() => {
    setPreferences(DEFAULT_THEME_PREFERENCES);
    persistPreferences(DEFAULT_THEME_PREFERENCES);
  }, [persistPreferences]);

  const syncWithServer = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const serverPrefs = await fetchThemePreferences(user.id);
      if (serverPrefs) {
        setPreferences(serverPrefs);
        saveThemeToStorage(serverPrefs);
      }
    } catch (error) {
      console.error("Theme sync error:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const value = useMemo(
    () => ({
      preferences,
      resolvedMode,
      isLoading,
      hasError,
      setMode,
      setPalette,
      setCustomColors,
      resetToDefault,
      syncWithServer,
    }),
    [
      preferences,
      resolvedMode,
      isLoading,
      hasError,
      setMode,
      setPalette,
      setCustomColors,
      resetToDefault,
      syncWithServer,
    ]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
