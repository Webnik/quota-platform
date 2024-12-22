import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { QuoteResponse } from "@/types/quote";
import { Profile } from "@/types/profile";

export const useQuotesData = (profile: Profile | null) => {
  const [quotes, setQuotes] = useState<QuoteResponse[]>([]);
  const [quotesLoading, setQuotesLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      if (!profile || profile.role !== 'contractor') {
        setQuotesLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('quotes')
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
          .eq('contractor_id', profile.id);

        if (error) {
          console.error('Quotes error:', error);
          return;
        }

        setQuotes(data || []);
      } catch (error) {
        console.error('Error fetching quotes:', error);
      } finally {
        setQuotesLoading(false);
      }
    };

    fetchQuotes();
  }, [profile]);

  return { quotes, quotesLoading };
};