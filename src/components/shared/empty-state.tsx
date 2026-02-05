import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border/50 bg-card/30 p-10 text-center",
        "hover:border-primary/20 transition-colors duration-300",
        className,
      )}
    >
      <div className="text-xl font-bold tracking-tight">{title}</div>
      <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
      {actionLabel && onAction ? (
        <Button onClick={onAction} className="mt-2">{actionLabel}</Button>
      ) : null}
    </div>
  );
}
