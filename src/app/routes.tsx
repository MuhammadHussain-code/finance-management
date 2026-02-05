import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "@/components/layout/app-shell";
import { AuthGuard } from "@/features/auth/components/auth-guard";
import { DashboardPage } from "@/pages/dashboard";
import { AssetsPage } from "@/pages/assets";
import { AssetDetailPage } from "@/pages/assets/asset-detail";
import { InvestmentsPage } from "@/pages/investments";
import { NewInvestmentPage } from "@/pages/investments/new";
import { SipCalculatorPage } from "@/pages/sip-calculator";
import { SettingsPage } from "@/pages/settings";
import { LoginPage } from "@/pages/login";
import { NotFoundPage } from "@/pages/not-found";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthGuard>
        <AppShell />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "assets", element: <AssetsPage /> },
      { path: "assets/:id", element: <AssetDetailPage /> },
      { path: "investments", element: <InvestmentsPage /> },
      { path: "investments/new", element: <NewInvestmentPage /> },
      { path: "sip-calculator", element: <SipCalculatorPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "*", element: <NotFoundPage /> },
]);
