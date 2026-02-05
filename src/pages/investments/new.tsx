import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useAssets } from "@/features/assets/hooks/use-assets";
import { useInvestments } from "@/features/investments/hooks/use-investments";
import { InvestmentForm } from "@/features/investments/components/investment-form";

export function NewInvestmentPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const assetsQuery = useAssets(user?.id);
  const investmentsQuery = useInvestments(user?.id);

  if (assetsQuery.isLoading) {
    return <LoadingSpinner label="Loading assets" />;
  }

  const assets = assetsQuery.data ?? [];

  const handleSubmit = (values: {
    asset_id: string;
    amount: number;
    investment_date: string;
    investment_type: "sip" | "lump_sum";
    units?: number;
    price_per_unit?: number;
  }) => {
    if (!user) return;
    investmentsQuery.createInvestment.mutate(
      {
        user_id: user.id,
        asset_id: values.asset_id,
        amount: values.amount,
        investment_date: values.investment_date,
        investment_type: values.investment_type,
        units: values.units ?? null,
        price_per_unit: values.price_per_unit ?? null,
      },
      {
        onSuccess: () => navigate("/investments"),
      },
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add investment</CardTitle>
        </CardHeader>
        <CardContent>
          {assets.length ? (
            <InvestmentForm
              assets={assets}
              onSubmit={handleSubmit}
              isSubmitting={investmentsQuery.createInvestment.isPending}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              Create an asset first so you can log investments.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
