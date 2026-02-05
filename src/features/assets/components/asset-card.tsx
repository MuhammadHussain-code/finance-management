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
    <Link to={`/assets/${asset.id}`} className="block cursor-pointer">
      <Card className="transition-all duration-200 hover:border-primary/50 hover:shadow-md group">
        <CardHeader className="space-y-2 pb-2">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-base group-hover:text-primary transition-colors">{asset.name}</CardTitle>
            <Badge variant="secondary" className="capitalize">{asset.category_id.replace("_", " ")}</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-between text-sm">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Invested</div>
            <div className="font-semibold text-foreground">{formatCurrency(totalInvested)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Current</div>
            <div className="font-semibold text-foreground">{formatCurrency(currentValue)}</div>
            {returnPercentage != null ? (
              <div className={`text-sm font-bold ${isPositive ? "text-positive" : "text-negative"}`}>
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
