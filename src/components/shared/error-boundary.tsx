import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      fallbackRender={({ resetErrorBoundary }) => (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
          <div className="text-lg font-semibold">Something went wrong</div>
          <p className="max-w-md text-sm text-muted-foreground">
            Please refresh the page or try again. If the issue persists, your data is safe.
          </p>
          <Button onClick={resetErrorBoundary}>Try again</Button>
        </div>
      )}
    >
      {children}
    </ReactErrorBoundary>
  );
}
