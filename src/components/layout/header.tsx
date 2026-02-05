import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/use-auth";

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-border/50 bg-card/50 backdrop-blur-md px-4 py-3 sticky top-0 z-40">
      <Link 
        to="/dashboard" 
        className="text-lg font-bold tracking-tight transition-colors hover:text-primary"
      >
        <span className="text-primary">SIP</span> Tracker
      </Link>
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
