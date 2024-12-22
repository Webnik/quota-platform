import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { addTimelineEvent } from "@/utils/timeline";
import { notifyStakeholders } from "@/utils/notifications";

const quoteFormSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  notes: z.string().optional(),
});

type QuoteFormValues = z.infer<typeof quoteFormSchema>;

export const QuoteSubmissionForm = ({ projectId, tradeId }: { projectId: string; tradeId: string }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      amount: "",
      notes: "",
    },
  });

  const onSubmit = async (values: QuoteFormValues) => {
    try {
      setIsSubmitting(true);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      // Create quote
      const { data: quote, error: quoteError } = await supabase
        .from("quotes")
        .insert({
          project_id: projectId,
          trade_id: tradeId,
          contractor_id: user.id,
          amount: parseFloat(values.amount),
          notes: values.notes,
          status: "submitted",
        })
        .select()
        .single();

      if (quoteError) throw quoteError;

      // Add timeline event
      await addTimelineEvent({
        projectId,
        eventType: "quote",
        description: `New quote submitted for $${values.amount}`,
        createdBy: user.id,
      });

      // Notify project stakeholders
      await notifyStakeholders(projectId, {
        title: "New Quote Submitted",
        message: `A new quote has been submitted for $${values.amount}`,
      });

      toast.success("Quote submitted successfully");
      navigate(`/projects/${projectId}`);
    } catch (error: any) {
      toast.error("Failed to submit quote", {
        description: error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount ($)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} />
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
                <Textarea placeholder="Add any additional notes or comments..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Quote"}
        </Button>
      </form>
    </Form>
  );
};