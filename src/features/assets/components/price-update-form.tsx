import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toIsoDate } from "@/lib/utils/date";

const priceSchema = z.object({
  price: z.number().positive(),
  price_date: z.string().min(1),
});

interface PriceUpdateFormProps {
  defaultDate?: string;
  onSubmit: (values: { price: number; price_date: string }) => void;
  isSubmitting?: boolean;
}

export function PriceUpdateForm({
  defaultDate,
  onSubmit,
  isSubmitting,
}: PriceUpdateFormProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      price: Number(form.get("price")),
      price_date: String(form.get("price_date") || ""),
    };

    const parsed = priceSchema.safeParse(payload);
    if (!parsed.success) {
      alert(parsed.error.issues[0]?.message ?? "Invalid price");
      return;
    }
    onSubmit(parsed.data);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="price">Price per unit</Label>
        <Input id="price" name="price" type="number" step="0.0001" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="price_date">Price date</Label>
        <Input
          id="price_date"
          name="price_date"
          type="date"
          defaultValue={defaultDate ?? toIsoDate(new Date())}
          required
        />
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        Save price
      </Button>
    </form>
  );
}
