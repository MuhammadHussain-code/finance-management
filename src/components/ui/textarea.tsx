import * as React from "react";
import { cn } from "@/lib/utils/cn";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm",
      "ring-offset-background placeholder:text-muted-foreground",
      "transition-all duration-200 resize-none",
      "hover:border-primary/50 hover:bg-muted/30",
      "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-background",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
