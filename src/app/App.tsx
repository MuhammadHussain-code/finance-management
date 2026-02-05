import { RouterProvider } from "react-router-dom";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { AuthProvider } from "@/app/providers/auth-provider";
import { QueryProvider } from "@/app/providers/query-provider";
import { ThemeProvider } from "@/app/providers/theme-provider";
import { router } from "@/app/routes";

export function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <ThemeProvider>
          <ErrorBoundary>
            <RouterProvider router={router} />
          </ErrorBoundary>
        </ThemeProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
