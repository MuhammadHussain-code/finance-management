import type { PaletteName } from "@/lib/supabase/types";

/**
 * HSL color value in the format "H S% L%" (without hsl() wrapper)
 * This format is compatible with Tailwind CSS variables
 */
export type HSLValue = string;

/**
 * Complete color token set for a palette
 */
export interface PaletteColors {
  // Core semantic colors
  primary: HSLValue;
  primaryForeground: HSLValue;
  accent: HSLValue;
  accentForeground: HSLValue;

  // Surface colors
  background: HSLValue;
  foreground: HSLValue;
  card: HSLValue;
  cardForeground: HSLValue;
  popover: HSLValue;
  popoverForeground: HSLValue;
  muted: HSLValue;
  mutedForeground: HSLValue;
  secondary: HSLValue;
  secondaryForeground: HSLValue;

  // Interactive states
  border: HSLValue;
  input: HSLValue;
  ring: HSLValue;

  // Semantic colors
  destructive: HSLValue;
  destructiveForeground: HSLValue;

  // Chart colors (as hex for direct use in charts)
  chartInvested: string;
  chartValue: string;
  chartPositive: string;
  chartNegative: string;
  chartMuted: string;
  chartAccent1: string;
  chartAccent2: string;
  chartAccent3: string;
  chartAccent4: string;
  chartAccent5: string;
}

/**
 * Palette definition including metadata
 */
export interface Palette {
  id: PaletteName;
  name: string;
  description: string;
  light: PaletteColors;
  dark: PaletteColors;
}

/**
 * Finance Calm - Default palette
 * Trustworthy blues with soft teal accents
 * Designed for calm, focused financial tracking
 */
export const financeCalm: Palette = {
  id: "finance-calm",
  name: "Finance Calm",
  description: "Trustworthy blues and soft teals for focused financial tracking",
  light: {
    // Core
    primary: "210 65% 45%",
    primaryForeground: "0 0% 100%",
    accent: "165 45% 40%",
    accentForeground: "0 0% 100%",
    // Surfaces
    background: "220 15% 97%",
    foreground: "220 25% 10%",
    card: "0 0% 100%",
    cardForeground: "220 25% 10%",
    popover: "0 0% 100%",
    popoverForeground: "220 25% 10%",
    muted: "220 15% 94%",
    mutedForeground: "220 10% 45%",
    secondary: "220 15% 92%",
    secondaryForeground: "220 25% 15%",
    // Interactive
    border: "220 15% 88%",
    input: "220 15% 88%",
    ring: "210 65% 45%",
    // Semantic
    destructive: "0 55% 50%",
    destructiveForeground: "0 0% 100%",
    // Charts
    chartInvested: "#6B7A8C",
    chartValue: "#2E7AB8",
    chartPositive: "#3D9970",
    chartNegative: "#CC5A5A",
    chartMuted: "#9CA3AF",
    chartAccent1: "#2E7AB8",
    chartAccent2: "#3D9970",
    chartAccent3: "#D4A76A",
    chartAccent4: "#8B6CB0",
    chartAccent5: "#5B8A8A",
  },
  dark: {
    // Core
    primary: "210 55% 55%",
    primaryForeground: "0 0% 100%",
    accent: "165 40% 50%",
    accentForeground: "0 0% 100%",
    // Surfaces
    background: "220 20% 10%",
    foreground: "220 10% 95%",
    card: "220 18% 13%",
    cardForeground: "220 10% 95%",
    popover: "220 18% 15%",
    popoverForeground: "220 10% 95%",
    muted: "220 15% 18%",
    mutedForeground: "220 10% 60%",
    secondary: "220 15% 16%",
    secondaryForeground: "220 10% 90%",
    // Interactive
    border: "220 15% 22%",
    input: "220 15% 18%",
    ring: "210 55% 55%",
    // Semantic
    destructive: "0 50% 55%",
    destructiveForeground: "0 0% 100%",
    // Charts
    chartInvested: "#7B8A9C",
    chartValue: "#4A9AD8",
    chartPositive: "#4DB380",
    chartNegative: "#E06B6B",
    chartMuted: "#4B5563",
    chartAccent1: "#4A9AD8",
    chartAccent2: "#4DB380",
    chartAccent3: "#E4B77A",
    chartAccent4: "#9B7CC0",
    chartAccent5: "#6B9A9A",
  },
};

/**
 * Neutral - Clean grayscale with minimal color
 * Professional and distraction-free
 */
export const neutral: Palette = {
  id: "neutral",
  name: "Neutral",
  description: "Clean grayscale for a professional, distraction-free experience",
  light: {
    // Core
    primary: "220 10% 35%",
    primaryForeground: "0 0% 100%",
    accent: "220 15% 50%",
    accentForeground: "0 0% 100%",
    // Surfaces
    background: "0 0% 98%",
    foreground: "0 0% 10%",
    card: "0 0% 100%",
    cardForeground: "0 0% 10%",
    popover: "0 0% 100%",
    popoverForeground: "0 0% 10%",
    muted: "0 0% 94%",
    mutedForeground: "0 0% 45%",
    secondary: "0 0% 92%",
    secondaryForeground: "0 0% 15%",
    // Interactive
    border: "0 0% 88%",
    input: "0 0% 88%",
    ring: "220 10% 35%",
    // Semantic
    destructive: "0 55% 50%",
    destructiveForeground: "0 0% 100%",
    // Charts
    chartInvested: "#6B7280",
    chartValue: "#4B5563",
    chartPositive: "#059669",
    chartNegative: "#DC2626",
    chartMuted: "#9CA3AF",
    chartAccent1: "#374151",
    chartAccent2: "#6B7280",
    chartAccent3: "#9CA3AF",
    chartAccent4: "#D1D5DB",
    chartAccent5: "#4B5563",
  },
  dark: {
    // Core
    primary: "220 10% 70%",
    primaryForeground: "0 0% 5%",
    accent: "220 15% 60%",
    accentForeground: "0 0% 5%",
    // Surfaces
    background: "0 0% 8%",
    foreground: "0 0% 95%",
    card: "0 0% 11%",
    cardForeground: "0 0% 95%",
    popover: "0 0% 13%",
    popoverForeground: "0 0% 95%",
    muted: "0 0% 16%",
    mutedForeground: "0 0% 60%",
    secondary: "0 0% 14%",
    secondaryForeground: "0 0% 90%",
    // Interactive
    border: "0 0% 20%",
    input: "0 0% 16%",
    ring: "220 10% 70%",
    // Semantic
    destructive: "0 50% 55%",
    destructiveForeground: "0 0% 100%",
    // Charts
    chartInvested: "#9CA3AF",
    chartValue: "#D1D5DB",
    chartPositive: "#10B981",
    chartNegative: "#EF4444",
    chartMuted: "#4B5563",
    chartAccent1: "#E5E7EB",
    chartAccent2: "#9CA3AF",
    chartAccent3: "#6B7280",
    chartAccent4: "#4B5563",
    chartAccent5: "#D1D5DB",
  },
};

/**
 * Soft Green - Nature-inspired growth theme
 * Emphasizes growth and prosperity with calming greens
 */
export const softGreen: Palette = {
  id: "soft-green",
  name: "Soft Green",
  description: "Nature-inspired theme emphasizing growth and prosperity",
  light: {
    // Core
    primary: "152 45% 38%",
    primaryForeground: "0 0% 100%",
    accent: "175 40% 40%",
    accentForeground: "0 0% 100%",
    // Surfaces
    background: "140 15% 97%",
    foreground: "150 25% 10%",
    card: "0 0% 100%",
    cardForeground: "150 25% 10%",
    popover: "0 0% 100%",
    popoverForeground: "150 25% 10%",
    muted: "140 15% 94%",
    mutedForeground: "150 10% 45%",
    secondary: "140 12% 92%",
    secondaryForeground: "150 25% 15%",
    // Interactive
    border: "140 12% 88%",
    input: "140 12% 88%",
    ring: "152 45% 38%",
    // Semantic
    destructive: "0 55% 50%",
    destructiveForeground: "0 0% 100%",
    // Charts
    chartInvested: "#6B8A7A",
    chartValue: "#3D9970",
    chartPositive: "#2D8659",
    chartNegative: "#CC5A5A",
    chartMuted: "#9CB0A5",
    chartAccent1: "#3D9970",
    chartAccent2: "#4AA89A",
    chartAccent3: "#7FB069",
    chartAccent4: "#8CB8A0",
    chartAccent5: "#5B9A8A",
  },
  dark: {
    // Core
    primary: "152 40% 48%",
    primaryForeground: "0 0% 100%",
    accent: "175 35% 50%",
    accentForeground: "0 0% 100%",
    // Surfaces
    background: "150 15% 9%",
    foreground: "140 10% 95%",
    card: "150 12% 12%",
    cardForeground: "140 10% 95%",
    popover: "150 12% 14%",
    popoverForeground: "140 10% 95%",
    muted: "150 10% 17%",
    mutedForeground: "140 10% 60%",
    secondary: "150 10% 15%",
    secondaryForeground: "140 10% 90%",
    // Interactive
    border: "150 10% 21%",
    input: "150 10% 17%",
    ring: "152 40% 48%",
    // Semantic
    destructive: "0 50% 55%",
    destructiveForeground: "0 0% 100%",
    // Charts
    chartInvested: "#7B9A8A",
    chartValue: "#4DB380",
    chartPositive: "#3D9970",
    chartNegative: "#E06B6B",
    chartMuted: "#4B5F55",
    chartAccent1: "#4DB380",
    chartAccent2: "#5AB8AA",
    chartAccent3: "#8FC079",
    chartAccent4: "#9CC8B0",
    chartAccent5: "#6BAA9A",
  },
};

/**
 * Warm - Earthy tones for a cozy feeling
 * Amber and terracotta inspired, comfortable for long sessions
 */
export const warm: Palette = {
  id: "warm",
  name: "Warm",
  description: "Earthy amber tones for a cozy, comfortable experience",
  light: {
    // Core
    primary: "25 70% 45%",
    primaryForeground: "0 0% 100%",
    accent: "35 60% 50%",
    accentForeground: "0 0% 100%",
    // Surfaces
    background: "35 25% 97%",
    foreground: "25 30% 12%",
    card: "35 20% 99%",
    cardForeground: "25 30% 12%",
    popover: "35 20% 99%",
    popoverForeground: "25 30% 12%",
    muted: "35 20% 93%",
    mutedForeground: "25 15% 45%",
    secondary: "35 18% 91%",
    secondaryForeground: "25 30% 15%",
    // Interactive
    border: "35 18% 86%",
    input: "35 18% 86%",
    ring: "25 70% 45%",
    // Semantic
    destructive: "0 55% 50%",
    destructiveForeground: "0 0% 100%",
    // Charts
    chartInvested: "#8C7A6B",
    chartValue: "#C97B35",
    chartPositive: "#6B8C5A",
    chartNegative: "#C45D5D",
    chartMuted: "#B0A090",
    chartAccent1: "#C97B35",
    chartAccent2: "#D4A76A",
    chartAccent3: "#A67C52",
    chartAccent4: "#8C7A6B",
    chartAccent5: "#BF8040",
  },
  dark: {
    // Core
    primary: "25 65% 55%",
    primaryForeground: "0 0% 100%",
    accent: "35 55% 55%",
    accentForeground: "0 0% 100%",
    // Surfaces
    background: "25 15% 9%",
    foreground: "35 15% 95%",
    card: "25 12% 12%",
    cardForeground: "35 15% 95%",
    popover: "25 12% 14%",
    popoverForeground: "35 15% 95%",
    muted: "25 10% 17%",
    mutedForeground: "35 10% 60%",
    secondary: "25 10% 15%",
    secondaryForeground: "35 10% 90%",
    // Interactive
    border: "25 10% 21%",
    input: "25 10% 17%",
    ring: "25 65% 55%",
    // Semantic
    destructive: "0 50% 55%",
    destructiveForeground: "0 0% 100%",
    // Charts
    chartInvested: "#9C8A7B",
    chartValue: "#D98B45",
    chartPositive: "#7B9C6A",
    chartNegative: "#D46D6D",
    chartMuted: "#5A4F45",
    chartAccent1: "#D98B45",
    chartAccent2: "#E4B77A",
    chartAccent3: "#B68C62",
    chartAccent4: "#9C8A7B",
    chartAccent5: "#CF9050",
  },
};

/**
 * All available palettes
 */
export const PALETTES: Record<PaletteName, Palette> = {
  "finance-calm": financeCalm,
  neutral: neutral,
  "soft-green": softGreen,
  warm: warm,
  custom: financeCalm, // Custom uses finance-calm as base
};

/**
 * Ordered list of palettes for UI display
 */
export const PALETTE_LIST: Palette[] = [financeCalm, neutral, softGreen, warm];

/**
 * Get palette by name with fallback to default
 */
export function getPalette(name: PaletteName): Palette {
  return PALETTES[name] ?? financeCalm;
}

/**
 * Primary color swatches for advanced customization
 * Each swatch is an HSL value
 */
export const PRIMARY_SWATCHES: Array<{ name: string; value: HSLValue }> = [
  { name: "Steel Blue", value: "210 65% 45%" },
  { name: "Ocean", value: "200 60% 45%" },
  { name: "Teal", value: "175 50% 40%" },
  { name: "Sage", value: "152 45% 38%" },
  { name: "Forest", value: "140 40% 35%" },
  { name: "Amber", value: "25 70% 45%" },
  { name: "Terracotta", value: "15 55% 45%" },
  { name: "Plum", value: "280 40% 45%" },
  { name: "Slate", value: "220 15% 40%" },
  { name: "Charcoal", value: "220 10% 30%" },
];

/**
 * Accent color swatches for advanced customization
 */
export const ACCENT_SWATCHES: Array<{ name: string; value: HSLValue }> = [
  { name: "Soft Teal", value: "165 45% 40%" },
  { name: "Mint", value: "160 40% 45%" },
  { name: "Sky", value: "195 55% 50%" },
  { name: "Lavender", value: "260 35% 55%" },
  { name: "Rose", value: "345 40% 55%" },
  { name: "Coral", value: "15 60% 55%" },
  { name: "Gold", value: "45 60% 50%" },
  { name: "Olive", value: "80 30% 45%" },
];

/**
 * Convert HSL string to CSS hsl() function
 */
export function hslToCSS(hsl: HSLValue): string {
  return `hsl(${hsl})`;
}

/**
 * Apply palette colors to document CSS variables
 */
export function applyPaletteToDocument(
  palette: PaletteColors,
  isDark: boolean
): void {
  const root = document.documentElement;

  // Core semantic colors
  root.style.setProperty("--primary", palette.primary);
  root.style.setProperty("--primary-foreground", palette.primaryForeground);
  root.style.setProperty("--accent", palette.accent);
  root.style.setProperty("--accent-foreground", palette.accentForeground);

  // Surface colors
  root.style.setProperty("--background", palette.background);
  root.style.setProperty("--foreground", palette.foreground);
  root.style.setProperty("--card", palette.card);
  root.style.setProperty("--card-foreground", palette.cardForeground);
  root.style.setProperty("--popover", palette.popover);
  root.style.setProperty("--popover-foreground", palette.popoverForeground);
  root.style.setProperty("--muted", palette.muted);
  root.style.setProperty("--muted-foreground", palette.mutedForeground);
  root.style.setProperty("--secondary", palette.secondary);
  root.style.setProperty("--secondary-foreground", palette.secondaryForeground);

  // Interactive states
  root.style.setProperty("--border", palette.border);
  root.style.setProperty("--input", palette.input);
  root.style.setProperty("--ring", palette.ring);

  // Semantic colors
  root.style.setProperty("--destructive", palette.destructive);
  root.style.setProperty("--destructive-foreground", palette.destructiveForeground);

  // Chart colors
  root.style.setProperty("--chart-invested", palette.chartInvested);
  root.style.setProperty("--chart-value", palette.chartValue);
  root.style.setProperty("--chart-positive", palette.chartPositive);
  root.style.setProperty("--chart-negative", palette.chartNegative);
  root.style.setProperty("--chart-muted", palette.chartMuted);
  root.style.setProperty("--chart-accent-1", palette.chartAccent1);
  root.style.setProperty("--chart-accent-2", palette.chartAccent2);
  root.style.setProperty("--chart-accent-3", palette.chartAccent3);
  root.style.setProperty("--chart-accent-4", palette.chartAccent4);
  root.style.setProperty("--chart-accent-5", palette.chartAccent5);

  // Set color scheme for browser chrome
  root.style.setProperty("color-scheme", isDark ? "dark" : "light");

  // Toggle dark class for Tailwind
  if (isDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

/**
 * Clear custom palette overrides from document
 */
export function clearPaletteOverrides(): void {
  const root = document.documentElement;
  const properties = [
    "--primary",
    "--primary-foreground",
    "--accent",
    "--accent-foreground",
    "--background",
    "--foreground",
    "--card",
    "--card-foreground",
    "--popover",
    "--popover-foreground",
    "--muted",
    "--muted-foreground",
    "--secondary",
    "--secondary-foreground",
    "--border",
    "--input",
    "--ring",
    "--destructive",
    "--destructive-foreground",
    "--chart-invested",
    "--chart-value",
    "--chart-positive",
    "--chart-negative",
    "--chart-muted",
    "--chart-accent-1",
    "--chart-accent-2",
    "--chart-accent-3",
    "--chart-accent-4",
    "--chart-accent-5",
  ];

  for (const prop of properties) {
    root.style.removeProperty(prop);
  }
}
