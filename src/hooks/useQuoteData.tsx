import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuoteResponse } from "@/types/quote";

export const useQuoteData = () => {
  return useQuery({
    queryKey: ["quotes"],
    queryFn: async () => {
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
          preferred
        `)
        .order("created_at", { ascending: false });

      if (quotesError) {
        console.error("Error fetching quotes:", quotesError);
        throw quotesError;
      }

      return quotesData as QuoteResponse[];
    },
  });
};