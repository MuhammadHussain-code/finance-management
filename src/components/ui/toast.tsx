import { useSyncExternalStore } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type ToastVariant = "default" | "success" | "error";

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastInput {
  title: string;
  description?: string;
  variant?: ToastVariant;
}

const TOAST_LIMIT = 4;
const TOAST_DURATION = 4000;

let toasts: ToastItem[] = [];
const listeners = new Set<() => void>();
const timers = new Map<string, ReturnType<typeof setTimeout>>();

function notify() {
  listeners.forEach((listener) => listener());
}

function removeToast(id: string) {
  toasts = toasts.filter((toast) => toast.id !== id);
  const timer = timers.get(id);
  if (timer) {
    clearTimeout(timer);
    timers.delete(id);
  }
  notify();
}

function addToast(input: ToastInput) {
  const id = crypto.randomUUID();
  const toast: ToastItem = {
    id,
    title: input.title,
    description: input.description,
    variant: input.variant ?? "default",
  };

  toasts = [toast, ...toasts].slice(0, TOAST_LIMIT);
  notify();

  const timer = setTimeout(() => {
    removeToast(id);
  }, TOAST_DURATION);
  timers.set(id, timer);

  return id;
}

export const toast = Object.assign(
  (input: ToastInput) => addToast(input),
  {
    success: (title: string, description?: string) =>
      addToast({ title, description, variant: "success" }),
    error: (title: string, description?: string) =>
      addToast({ title, description, variant: "error" }),
    dismiss: (id: string) => removeToast(id),
  },
);

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return toasts;
}

export function Toaster() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3">
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(
            "pointer-events-auto rounded-lg border bg-card px-4 py-3 shadow-lg transition",
            item.variant === "success" && "border-emerald-200 bg-emerald-50 text-emerald-950",
            item.variant === "error" && "border-rose-200 bg-rose-50 text-rose-950",
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">{item.title}</p>
              {item.description ? (
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => removeToast(item.id)}
              className="rounded-md p-1 text-muted-foreground hover:text-foreground"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
