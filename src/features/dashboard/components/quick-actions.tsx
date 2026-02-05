import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function QuickActions() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button asChild className="w-full sm:w-auto">
        <Link to="/investments/new">Add investment</Link>
      </Button>
      <Button asChild variant="secondary" className="w-full sm:w-auto">
        <Link to="/sip-calculator">SIP calculator</Link>
      </Button>
    </div>
  );
}
