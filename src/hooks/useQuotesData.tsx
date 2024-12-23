import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { QuoteResponse } from "@/types/quote";
import { Profile } from "@/types/profile";
import { toast } from "sonner";

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
            contractor:profiles!quotes_contractor_id_fkey (
              id,
              full_name,
              company_name
            ),
            project:projects!quotes_project_id_fkey (*),
            files (*)
          `)
          .eq('contractor_id', profile.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Quotes error:', error);
          toast.error("Error fetching quotes");
          return;
        }

        setQuotes(data || []);
      } catch (error) {
        console.error('Error fetching quotes:', error);
        toast.error("Failed to load quotes");
      } finally {
        setQuotesLoading(false);
      }
    };

    fetchQuotes();
  }, [profile]);

  return { quotes, quotesLoading };
};