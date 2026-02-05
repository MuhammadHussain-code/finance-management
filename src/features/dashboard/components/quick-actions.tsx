import { Link } from "react-router-dom";
import { Plus, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuickActions() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button asChild className="w-full sm:w-auto">
        <Link to="/investments/new">
          <Plus className="h-4 w-4 mr-2" />
          Add investment
        </Link>
      </Button>
      <Button asChild variant="outline" className="w-full sm:w-auto">
        <Link to="/sip-calculator">
          <Calculator className="h-4 w-4 mr-2" />
          SIP calculator
        </Link>
      </Button>
    </div>
  );
}
