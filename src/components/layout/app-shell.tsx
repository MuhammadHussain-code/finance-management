import { Outlet } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";

export function AppShell() {
  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <main className="mx-auto w-full max-w-5xl px-4 pb-20 pt-6">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
}
