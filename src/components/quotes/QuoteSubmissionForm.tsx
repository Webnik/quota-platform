import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProjectFileUpload } from "@/components/projects/ProjectFileUpload";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const quoteFormSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  notes: z.string().optional(),
});

type QuoteFormValues = z.infer<typeof quoteFormSchema>;

interface QuoteSubmissionFormProps {
  projectId: string;
  tradeId: string;
}

export function QuoteSubmissionForm({ projectId, tradeId }: QuoteSubmissionFormProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to submit a quote");
        return;
      }

      // Create quote
      const { data: quote, error: quoteError } = await supabase
        .from("quotes")
        .insert({
          project_id: projectId,
          trade_id: tradeId,
          contractor_id: user.id,
          amount: parseFloat(values.amount),
          notes: values.notes,
          status: "pending",
        })
        .select()
        .single();

      if (quoteError) throw quoteError;

      // Upload file if selected
      if (selectedFile && quote) {
        const fileExt = selectedFile.name.split('.').pop();
        const filePath = `${quote.id}-${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('project-files')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        // Create file record
        const { error: fileError } = await supabase
          .from("files")
          .insert({
            name: selectedFile.name,
            url: filePath,
            size: selectedFile.size,
            type: selectedFile.type,
            uploaded_by: user.id,
            quote_id: quote.id,
          });

        if (fileError) throw fileError;
      }

      toast.success("Quote submitted successfully");
      navigate(`/projects/${projectId}`);
    } catch (error: any) {
      console.error("Error submitting quote:", error);
      toast.error(error.message || "Failed to submit quote");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Supporting Documents</h3>
          <ProjectFileUpload onFileSelect={handleFileSelect} />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Quote"}
        </Button>
      </form>
    </Form>
  );
}