import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectHeader } from "@/components/projects/ProjectHeader";
import ProjectFiles from "@/components/projects/ProjectFiles";
import { ProjectTimelineView } from "@/components/projects/ProjectTimelineView";
import { toast } from "sonner";

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { data: project, isLoading: isLoadingProject } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          files (*)
        `)
        .eq("id", id)
        .single();

      if (error) {
        toast.error("Failed to load project details");
        throw error;
      }

      return data;
    },
  });

  const { data: quotes, isLoading: isLoadingQuotes } = useQuery({
    queryKey: ["project-quotes", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .eq("project_id", id);

      if (error) {
        toast.error("Failed to load quotes");
        throw error;
      }

      return data;
    },
  });

  const isLoading = isLoadingProject || isLoadingQuotes;

  const totalAmount = quotes?.reduce((sum, quote) => sum + Number(quote.amount), 0) || 0;

  if (!id) return null;

  return (
    <div className="container py-8 space-y-8">
      <ProjectHeader
        id={id}
        isLoading={isLoading}
        name={project?.name || ""}
        status={project?.status || ""}
        dueDate={project?.due_date ? new Date(project.due_date) : new Date()}
        totalQuotes={quotes?.length || 0}
        totalAmount={totalAmount}
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        <ProjectFiles
          isLoading={isLoading}
          files={project?.files || []}
        />
        <ProjectTimelineView projectId={id} />
      </div>
    </div>
  );
};

export default ProjectDetails;