import { NavLink } from "react-router-dom";
import { Calculator, Home, LineChart, Wallet } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/assets", label: "Assets", icon: LineChart },
  { to: "/investments", label: "Investments", icon: Wallet },
  { to: "/sip-calculator", label: "Calculator", icon: Calculator },
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t bg-background px-4 py-2 md:hidden">
      <div className="flex items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1 text-xs text-muted-foreground",
                  isActive && "text-primary",
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
