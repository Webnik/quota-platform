import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuoteResponse } from "@/types/quote";

export const useQuoteData = () => {
  return useQuery({
    queryKey: ["quotes"],
    queryFn: async () => {
      try {
        const { data: quotesData, error: quotesError } = await supabase
          .from("quotes")
          .select(`
            *,
            contractor:contractor_id (
              id,
              full_name,
              company_name
            ),
            project:project_id (*),
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
        throw error;
      }
    },
  });
};