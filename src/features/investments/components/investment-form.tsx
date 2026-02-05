import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { investmentTypes } from "@/lib/constants";
import { toIsoDate } from "@/lib/utils/date";
import type { Asset } from "@/features/assets/types";

const investmentSchema = z.object({
  asset_id: z.string().min(1),
  amount: z.number().positive(),
  investment_date: z.string().min(1),
  investment_type: z.enum(["sip", "lump_sum"]),
  units: z.number().optional(),
  price_per_unit: z.number().optional(),
});

export interface InvestmentFormValues extends z.infer<typeof investmentSchema> {}

interface InvestmentFormProps {
  assets: Asset[];
  defaultValues?: Partial<InvestmentFormValues>;
  onSubmit: (values: InvestmentFormValues) => void;
  isSubmitting?: boolean;
}

export function InvestmentForm({
  assets,
  defaultValues,
  onSubmit,
  isSubmitting,
}: InvestmentFormProps) {
  const [assetId, setAssetId] = useState(defaultValues?.asset_id ?? "");
  const [investmentType, setInvestmentType] = useState(
    defaultValues?.investment_type ?? "sip",
  );

  useEffect(() => {
    if (!assetId && assets.length) {
      setAssetId(assets[0].id);
    }
  }, [assetId, assets]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      asset_id: assetId,
      amount: Number(form.get("amount")),
      investment_date: String(form.get("investment_date") ?? ""),
      investment_type: investmentType as "sip" | "lump_sum",
      units: form.get("units") ? Number(form.get("units")) : undefined,
      price_per_unit: form.get("price_per_unit")
        ? Number(form.get("price_per_unit"))
        : undefined,
    };

    const parsed = investmentSchema.safeParse(payload);
    if (!parsed.success) {
      alert(parsed.error.errors[0]?.message ?? "Invalid investment data");
      return;
    }
    onSubmit(parsed.data);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="asset_id">Asset</Label>
        <Select value={assetId} onValueChange={setAssetId}>
          <SelectTrigger id="asset_id">
            <SelectValue placeholder="Select asset" />
          </SelectTrigger>
          <SelectContent>
            {assets.map((asset) => (
              <SelectItem key={asset.id} value={asset.id}>
                {asset.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input type="hidden" name="asset_id" value={assetId} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="amount">Amount invested</Label>
        <Input id="amount" name="amount" type="number" step="0.01" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="investment_date">Investment date</Label>
        <Input
          id="investment_date"
          name="investment_date"
          type="date"
          defaultValue={defaultValues?.investment_date ?? toIsoDate(new Date())}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="investment_type">Type</Label>
        <Select value={investmentType} onValueChange={setInvestmentType}>
          <SelectTrigger id="investment_type">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {investmentTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input type="hidden" name="investment_type" value={investmentType} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="units">Units (optional)</Label>
        <Input id="units" name="units" type="number" step="0.0001" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="price_per_unit">Price per unit (optional)</Label>
        <Input id="price_per_unit" name="price_per_unit" type="number" step="0.0001" />
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        Save investment
      </Button>
    </form>
  );
}
