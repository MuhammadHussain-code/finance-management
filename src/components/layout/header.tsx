import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/use-auth";

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="flex items-center justify-between border-b bg-background px-4 py-3">
      <Link to="/dashboard" className="text-base font-semibold">
        SIP Tracker
      </Link>
      {user ? (
        <Button variant="ghost" size="sm" onClick={signOut}>
          Sign out
        </Button>
      ) : null}
    </header>
  );
}
