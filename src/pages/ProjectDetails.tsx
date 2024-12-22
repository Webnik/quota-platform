import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectTimeline } from "@/components/projects/ProjectTimeline";
import { QuoteList } from "@/components/quotes/QuoteList";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          consultant:consultant_id (
            full_name
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container py-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container py-6">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">{project.name}</h1>
        <p className="text-muted-foreground">{project.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Quotes</h2>
            <QuoteList projectId={project.id} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Project Timeline</h2>
            <ProjectTimeline projectId={project.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;