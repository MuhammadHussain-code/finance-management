// Components
export { ThemeSettings } from "./components/theme-settings";
export { PalettePreview, ColorSwatchButton } from "./components/palette-preview";

// Hooks
export { useTheme, ThemeContext } from "./hooks/use-theme";
export type { ThemeContextValue } from "./hooks/use-theme";

// API
export {
  fetchThemePreferences,
  saveThemePreferences,
  resetThemePreferences,
} from "./api/theme-api";

// Palette definitions
export {
  PALETTES,
  PALETTE_LIST,
  getPalette,
  PRIMARY_SWATCHES,
  ACCENT_SWATCHES,
  applyPaletteToDocument,
  clearPaletteOverrides,
  hslToCSS,
} from "./lib/palettes";
export type { Palette, PaletteColors, HSLValue } from "./lib/palettes";
