import * as z from "zod";

export const quoteFormSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  notes: z.string().optional(),
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;