import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuoteResponse } from "@/types/quote";
import { toast } from "sonner";

export const useQuoteData = () => {
  return useQuery({
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
};