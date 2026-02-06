import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowLeft, Calculator, Home, LineChart, Settings, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/assets", label: "Assets", icon: LineChart },
  { to: "/investments", label: "Invest", icon: Wallet },
  { to: "/sip-calculator", label: "Calculator", icon: Calculator },
];

export function Header() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const showDesktopBack = Boolean(user) && location.pathname !== "/dashboard";

  return (
    <header className="flex items-center justify-between border-b border-border/50 bg-card/50 backdrop-blur-md px-4 py-3 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        {showDesktopBack ? (
          <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </Button>
        ) : null}
        <Link
          to="/dashboard"
          className="text-lg font-bold tracking-tight transition-colors hover:text-primary"
        >
          <span className="text-primary">SIP</span> Tracker
        </Link>
      </div>
      {user ? (
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors",
                    "hover:text-foreground hover:bg-muted/50",
                    isActive && "text-primary bg-primary/10",
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      ) : null}
      {user ? (
        <div className="flex items-center gap-2">
          <Link to="/settings">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={signOut}>
            Sign out
          </Button>
        </div>
      ) : null}
    </header>
  );
}
