import { z } from "zod";

export const quoteFormSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  notes: z.string().optional(),
  files: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
      size: z.number(),
      type: z.string(),
    })
  ).optional(),
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;