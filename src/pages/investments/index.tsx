import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useAssets } from "@/features/assets/hooks/use-assets";
import { useInvestments } from "@/features/investments/hooks/use-investments";
import { InvestmentList } from "@/features/investments/components/investment-list";

export function InvestmentsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const assetsQuery = useAssets(user?.id);
  const investmentsQuery = useInvestments(user?.id);

  if (assetsQuery.isLoading || investmentsQuery.isLoading) {
    return <LoadingSpinner label="Loading investments" />;
  }

  const assetsById =
    assetsQuery.data?.reduce((acc, asset) => {
      acc[asset.id] = asset;
      return acc;
    }, {} as Record<string, (typeof assetsQuery.data)[number]>) ?? {};

  const investments = investmentsQuery.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Investments</h1>
          <p className="text-sm text-muted-foreground">
            Review all SIP and lump-sum entries.
          </p>
        </div>
        <Button asChild>
          <Link to="/investments/new">Add investment</Link>
        </Button>
      </div>

      {investments.length ? (
        <InvestmentList
          investments={investments}
          assetsById={assetsById}
          onDelete={(id) => {
            if (!confirm("Delete this investment entry?")) return;
            investmentsQuery.deleteInvestment.mutate(id);
          }}
        />
      ) : (
        <EmptyState
          title="No investments yet"
          description="Log your first SIP or lump-sum investment to see performance."
          actionLabel="Add investment"
          onAction={() => navigate("/investments/new")}
        />
      )}
    </div>
  );
}
