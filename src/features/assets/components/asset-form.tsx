import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { assetCategories } from "@/lib/constants";

const assetSchema = z.object({
  name: z.string().min(2, "Asset name is required"),
  category_id: z.string().min(1, "Category is required"),
  symbol: z.string().optional(),
  notes: z.string().optional(),
});

export interface AssetFormValues extends z.infer<typeof assetSchema> {}

interface AssetFormProps {
  defaultValues?: Partial<AssetFormValues>;
  onSubmit: (values: AssetFormValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function AssetForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel = "Save asset",
}: AssetFormProps) {
  const [categoryId, setCategoryId] = useState(defaultValues?.category_id ?? "");

  useEffect(() => {
    if (!categoryId && assetCategories.length) {
      setCategoryId(assetCategories[0].id);
    }
  }, [categoryId]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? "").trim(),
      category_id: categoryId,
      symbol: String(form.get("symbol") ?? "").trim() || undefined,
      notes: String(form.get("notes") ?? "").trim() || undefined,
    };

    const parsed = assetSchema.safeParse(payload);
    if (!parsed.success) {
      alert(parsed.error.issues[0]?.message ?? "Invalid asset data");
      return;
    }
    onSubmit(parsed.data);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="name">Asset name</Label>
        <Input id="name" name="name" defaultValue={defaultValues?.name} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category_id">Category</Label>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger id="category_id">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {assetCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input type="hidden" name="category_id" value={categoryId} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="symbol">Symbol (optional)</Label>
        <Input id="symbol" name="symbol" defaultValue={defaultValues?.symbol} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea id="notes" name="notes" defaultValue={defaultValues?.notes} />
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}
