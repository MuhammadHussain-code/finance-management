import { useState } from "react";
import { Monitor, Moon, Sun, RotateCcw, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useTheme } from "../hooks/use-theme";
import { PALETTE_LIST, PRIMARY_SWATCHES, ACCENT_SWATCHES } from "../lib/palettes";
import { PalettePreview, ColorSwatchButton } from "./palette-preview";
import type { ThemeMode, PaletteName } from "@/lib/supabase/types";

/**
 * Mode toggle button component
 */
function ModeButton({
  mode,
  currentMode,
  icon: Icon,
  label,
  onClick,
}: {
  mode: ThemeMode;
  currentMode: ThemeMode;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  const isActive = currentMode === mode;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-1 flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all duration-200",
        isActive
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 hover:bg-muted/50"
      )}
    >
      <Icon
        className={cn(
          "h-5 w-5",
          isActive ? "text-primary" : "text-muted-foreground"
        )}
      />
      <span
        className={cn(
          "text-sm font-medium",
          isActive ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {label}
      </span>
    </button>
  );
}

/**
 * Theme Settings component
 * Allows users to customize appearance including mode and palette
 */
export function ThemeSettings() {
  const {
    preferences,
    resolvedMode,
    setMode,
    setPalette,
    setCustomColors,
    resetToDefault,
  } = useTheme();

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Get current custom color values (if any)
  const currentPrimary = preferences.customColors?.primary;
  const currentAccent = preferences.customColors?.accent;

  const handlePrimaryChange = (value: string) => {
    setCustomColors({
      ...preferences.customColors,
      primary: value,
    });
  };

  const handleAccentChange = (value: string) => {
    setCustomColors({
      ...preferences.customColors,
      accent: value,
    });
  };

  const handleResetColors = () => {
    setCustomColors(null);
  };

  return (
    <div className="space-y-8">
      {/* Color Mode Section */}
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Color Mode</h3>
          <p className="text-sm text-muted-foreground">
            Choose how the app appears to you
          </p>
        </div>

        <div className="flex gap-3">
          <ModeButton
            mode="light"
            currentMode={preferences.mode}
            icon={Sun}
            label="Light"
            onClick={() => setMode("light")}
          />
          <ModeButton
            mode="dark"
            currentMode={preferences.mode}
            icon={Moon}
            label="Dark"
            onClick={() => setMode("dark")}
          />
          <ModeButton
            mode="system"
            currentMode={preferences.mode}
            icon={Monitor}
            label="System"
            onClick={() => setMode("system")}
          />
        </div>

        {preferences.mode === "system" && (
          <p className="text-xs text-muted-foreground">
            Currently using{" "}
            <span className="font-medium">{resolvedMode}</span> mode based on
            your system preference
          </p>
        )}
      </section>

      {/* Color Palette Section */}
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Color Palette</h3>
          <p className="text-sm text-muted-foreground">
            Select a preset palette that suits your style
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {PALETTE_LIST.map((palette) => (
            <PalettePreview
              key={palette.id}
              palette={palette}
              isDark={resolvedMode === "dark"}
              isSelected={preferences.palette === palette.id && !preferences.customColors}
              onSelect={() => {
                setPalette(palette.id as PaletteName);
              }}
            />
          ))}
        </div>
      </section>

      {/* Advanced Customization Section */}
      <section className="space-y-4">
        <button
          type="button"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="flex w-full items-center justify-between rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors"
        >
          <div className="text-left">
            <h3 className="font-semibold">Advanced Customization</h3>
            <p className="text-sm text-muted-foreground">
              Fine-tune individual colors
            </p>
          </div>
          <ChevronDown
            className={cn(
              "h-5 w-5 text-muted-foreground transition-transform duration-200",
              isAdvancedOpen && "rotate-180"
            )}
          />
        </button>

        {isAdvancedOpen && (
          <div className="space-y-6 rounded-lg border border-border p-4">
            {/* Primary Color */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Primary Color</label>
              <div className="flex flex-wrap gap-2">
                {PRIMARY_SWATCHES.map((swatch) => (
                  <ColorSwatchButton
                    key={swatch.value}
                    name={swatch.name}
                    value={swatch.value}
                    isSelected={currentPrimary === swatch.value}
                    onSelect={() => handlePrimaryChange(swatch.value)}
                  />
                ))}
              </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Accent Color</label>
              <div className="flex flex-wrap gap-2">
                {ACCENT_SWATCHES.map((swatch) => (
                  <ColorSwatchButton
                    key={swatch.value}
                    name={swatch.name}
                    value={swatch.value}
                    isSelected={currentAccent === swatch.value}
                    onSelect={() => handleAccentChange(swatch.value)}
                  />
                ))}
              </div>
            </div>

            {/* Reset Button */}
            {preferences.customColors && (
              <button
                type="button"
                onClick={handleResetColors}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Clear custom colors
              </button>
            )}
          </div>
        )}
      </section>

      {/* Reset All Section */}
      <section className="border-t border-border pt-6">
        <button
          type="button"
          onClick={resetToDefault}
          className="flex items-center gap-2 rounded-lg border border-destructive/50 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Reset to Default Theme
        </button>
        <p className="mt-2 text-xs text-muted-foreground">
          This will reset all theme settings to Finance Calm with system mode
        </p>
      </section>
    </div>
  );
}
