import { cn } from "@/lib/utils/cn";
import type { Palette, PaletteColors } from "../lib/palettes";

interface PalettePreviewProps {
  palette: Palette;
  isDark: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

/**
 * Visual preview card for a color palette
 */
export function PalettePreview({
  palette,
  isDark,
  isSelected,
  onSelect,
}: PalettePreviewProps) {
  const colors = isDark ? palette.dark : palette.light;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative flex flex-col gap-3 rounded-xl border-2 p-4 text-left transition-all duration-200",
        "hover:shadow-md",
        isSelected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border hover:border-primary/50"
      )}
    >
      {/* Color preview strip */}
      <div className="flex gap-1.5 rounded-md overflow-hidden">
        <ColorSwatch hsl={colors.primary} className="flex-1 h-8" />
        <ColorSwatch hsl={colors.accent} className="flex-1 h-8" />
        <ColorSwatch hex={colors.chartPositive} className="flex-1 h-8" />
        <ColorSwatch hex={colors.chartValue} className="flex-1 h-8" />
      </div>

      {/* Palette info */}
      <div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{palette.name}</span>
          {isSelected && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {palette.description}
        </p>
      </div>

      {/* Mini UI preview */}
      <MiniUIPreview colors={colors} />
    </button>
  );
}

/**
 * Single color swatch
 */
function ColorSwatch({
  hsl,
  hex,
  className,
}: {
  hsl?: string;
  hex?: string;
  className?: string;
}) {
  const style = hsl
    ? { backgroundColor: `hsl(${hsl})` }
    : { backgroundColor: hex };

  return <div className={cn("rounded-sm", className)} style={style} />;
}

/**
 * Mini UI preview showing how the palette looks in context
 */
function MiniUIPreview({ colors }: { colors: PaletteColors }) {
  return (
    <div
      className="rounded-lg p-2 text-xs space-y-1.5"
      style={{ backgroundColor: `hsl(${colors.card})` }}
    >
      {/* Mini card header */}
      <div className="flex items-center justify-between">
        <span
          className="font-medium"
          style={{ color: `hsl(${colors.cardForeground})` }}
        >
          Portfolio
        </span>
        <span
          className="text-[10px] px-1.5 py-0.5 rounded"
          style={{
            backgroundColor: `hsl(${colors.primary})`,
            color: `hsl(${colors.primaryForeground})`,
          }}
        >
          Active
        </span>
      </div>

      {/* Mini metrics */}
      <div className="flex gap-3">
        <div>
          <div
            className="text-[10px]"
            style={{ color: `hsl(${colors.mutedForeground})` }}
          >
            Value
          </div>
          <div
            className="font-semibold text-xs"
            style={{ color: colors.chartValue }}
          >
            ₹1.2L
          </div>
        </div>
        <div>
          <div
            className="text-[10px]"
            style={{ color: `hsl(${colors.mutedForeground})` }}
          >
            Returns
          </div>
          <div
            className="font-semibold text-xs"
            style={{ color: colors.chartPositive }}
          >
            +12.5%
          </div>
        </div>
      </div>
    </div>
  );
}

interface ColorSwatchButtonProps {
  name: string;
  value: string;
  isSelected: boolean;
  onSelect: () => void;
}

/**
 * Selectable color swatch button for advanced customization
 */
export function ColorSwatchButton({
  name,
  value,
  isSelected,
  onSelect,
}: ColorSwatchButtonProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      title={name}
      className={cn(
        "w-8 h-8 rounded-lg transition-all duration-200",
        "ring-offset-background",
        isSelected
          ? "ring-2 ring-primary ring-offset-2 scale-110"
          : "hover:scale-105 hover:ring-1 hover:ring-muted-foreground/30"
      )}
      style={{ backgroundColor: `hsl(${value})` }}
    />
  );
}
