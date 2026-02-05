import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatNumber } from "@/lib/utils/format";
import type { Asset } from "@/features/assets/types";

interface AssetCardProps {
  asset: Asset;
  totalInvested?: number;
  totalUnits?: number;
}

export function AssetCard({
  asset,
  totalInvested = 0,
  totalUnits = 0,
}: AssetCardProps) {
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
            <div className="font-semibold text-foreground">
              {formatCurrency(totalInvested, asset.currency)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Units</div>
            <div className="font-semibold text-foreground">{formatNumber(totalUnits, 4)}</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
