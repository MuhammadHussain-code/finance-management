import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/format";
import type { Asset } from "@/features/assets/types";

interface AssetCardProps {
  asset: Asset;
  currentValue?: number;
  totalInvested?: number;
  returnPercentage?: number | null;
}

export function AssetCard({
  asset,
  currentValue = 0,
  totalInvested = 0,
  returnPercentage,
}: AssetCardProps) {
  const isPositive = (returnPercentage ?? 0) >= 0;
  return (
    <Link to={`/assets/${asset.id}`}>
      <Card className="transition hover:border-primary/60">
        <CardHeader className="space-y-2 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{asset.name}</CardTitle>
            <Badge variant="secondary">{asset.category_id.replace("_", " ")}</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-between text-sm">
          <div>
            <div className="text-muted-foreground">Invested</div>
            <div className="font-medium">{formatCurrency(totalInvested)}</div>
          </div>
          <div className="text-right">
            <div className="text-muted-foreground">Current</div>
            <div className="font-medium">{formatCurrency(currentValue)}</div>
            {returnPercentage != null ? (
              <div className={isPositive ? "text-emerald-600" : "text-rose-600"}>
                {isPositive ? "+" : ""}
                {returnPercentage.toFixed(2)}%
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
