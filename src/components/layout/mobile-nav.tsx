import { NavLink } from "react-router-dom";
import { Calculator, Home, LineChart, Settings, Wallet } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/assets", label: "Assets", icon: LineChart },
  { to: "/investments", label: "Invest", icon: Wallet },
  { to: "/sip-calculator", label: "Calc", icon: Calculator },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/50 bg-card/80 backdrop-blur-lg px-4 py-2 md:hidden">
      <div className="flex items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-muted-foreground transition-all duration-200",
                  "hover:text-foreground hover:bg-muted/50 cursor-pointer",
                  isActive && "text-primary bg-primary/10 shadow-sm",
                )
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
