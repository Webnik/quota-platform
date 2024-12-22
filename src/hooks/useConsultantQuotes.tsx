import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/project";
import { QuoteResponse } from "@/types/quote";

export const useConsultantQuotes = (projects: Project[]) => {
  const projectIds = projects.map(p => p.id);

  return useQuery<QuoteResponse[]>({
    queryKey: ["consultant-quotes", projectIds],
    queryFn: async () => {
      if (projectIds.length === 0) return [];
      
      const { data, error } = await supabase
        .from("quotes")
        .select(`
          *,
          contractor:contractor_id (
            id,
            full_name,
            company_name
          ),
          trade:trade_id (*),
          project:project_id (*),
          files (*)
        `)
        .in("project_id", projectIds);

      if (error) {
        console.error("Error fetching quotes:", error);
        throw error;
      }

      return data.map(quote => ({
        ...quote,
        project: quote.project,
      }));
    },
    enabled: projectIds.length > 0,
  });
};