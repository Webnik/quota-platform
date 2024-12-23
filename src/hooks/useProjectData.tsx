import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/project";
import { toast } from "sonner";

export const useProjectData = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      try {
        const { data: projectsData, error: projectsError } = await supabase
          .from("projects")
          .select(`
            id,
            name,
            description,
            consultant_id,
            due_date,
            status,
            created_at,
            updated_at
          `)
          .order("created_at", { ascending: false });

        if (projectsError) {
          console.error("Error fetching projects:", projectsError);
          throw projectsError;
        }

        return projectsData as Project[];
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("Failed to load projects");
        throw error;
      }
    },
  });
};