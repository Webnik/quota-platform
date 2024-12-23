import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/project";
import { toast } from "sonner";

export const useProjectData = () => {
  const queryClient = useQueryClient();

  const { data: projects, isLoading, error } = useQuery({
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

  const updateProject = useMutation({
    mutationFn: async (project: Partial<Project> & { id: string }) => {
      const { error } = await supabase
        .from("projects")
        .update(project)
        .eq("id", project.id);

      if (error) throw error;
      return project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project updated successfully");
    },
    onError: (error) => {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    },
  });

  const createProject = useMutation({
    mutationFn: async (project: Omit<Project, "id">) => {
      const { data, error } = await supabase
        .from("projects")
        .insert(project)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created successfully");
    },
    onError: (error) => {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
    },
  });

  return {
    projects,
    isLoading,
    error,
    updateProject,
    createProject,
  };
};