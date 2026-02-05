import { RouterProvider } from "react-router-dom";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { AuthProvider } from "@/app/providers/auth-provider";
import { QueryProvider } from "@/app/providers/query-provider";
import { ThemeProvider } from "@/app/providers/theme-provider";
import { Toaster } from "@/components/ui/toast";
import { router } from "@/app/routes";

export function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <AuthProvider>
          <ThemeProvider>
            <RouterProvider router={router} />
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}
