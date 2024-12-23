import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuoteResponse } from "@/types/quote";
import { toast } from "sonner";

export const useQuoteData = () => {
  const queryClient = useQueryClient();

  const { data: quotes, isLoading, error } = useQuery({
    queryKey: ["quotes"],
    queryFn: async () => {
      try {
        const { data: quotesData, error: quotesError } = await supabase
          .from("quotes")
          .select(`
            id,
            project_id,
            contractor_id,
            trade_id,
            amount,
            status,
            notes,
            created_at,
            updated_at,
            preferred,
            contractor:contractor_id (
              id,
              full_name,
              company_name
            ),
            project:project_id (
              id,
              name,
              description,
              due_date,
              status
            ),
            files (*)
          `)
          .order("created_at", { ascending: false });

        if (quotesError) {
          console.error("Error fetching quotes:", quotesError);
          throw quotesError;
        }

        return quotesData as QuoteResponse[];
      } catch (error) {
        console.error("Error fetching quotes:", error);
        toast.error("Failed to load quotes");
        throw error;
      }
    },
  });

  const updateQuote = useMutation({
    mutationFn: async (quote: Partial<QuoteResponse> & { id: string }) => {
      const { error } = await supabase
        .from("quotes")
        .update(quote)
        .eq("id", quote.id);

      if (error) throw error;
      return quote;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      toast.success("Quote updated successfully");
    },
    onError: (error) => {
      console.error("Error updating quote:", error);
      toast.error("Failed to update quote");
    },
  });

  const createQuote = useMutation({
    mutationFn: async (quote: Omit<QuoteResponse, "id">) => {
      const { data, error } = await supabase
        .from("quotes")
        .insert(quote)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      toast.success("Quote created successfully");
    },
    onError: (error) => {
      console.error("Error creating quote:", error);
      toast.error("Failed to create quote");
    },
  });

  return {
    quotes,
    isLoading,
    error,
    updateQuote,
    createQuote,
  };
};