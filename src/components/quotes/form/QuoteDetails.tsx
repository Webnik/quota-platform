import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { QuoteFormValues } from "../schemas/quote-form-schema";

interface QuoteDetailsProps {
  form: UseFormReturn<QuoteFormValues>;
}

export const QuoteDetails = ({ form }: QuoteDetailsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quote Amount ($)</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter quote amount"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notes</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Add any additional notes or comments"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};