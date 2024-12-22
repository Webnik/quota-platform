import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectHeader } from "@/components/projects/ProjectHeader";
import { ProjectFiles } from "@/components/projects/ProjectFiles";
import { ProjectTimelineView } from "@/components/projects/ProjectTimelineView";
import { QuoteComparison } from "@/components/quotes/QuoteComparison";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(
          `
          *,
          consultant:profiles(*)
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading || !project) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-8 p-8">
      <ProjectHeader
        id={project.id}
        isLoading={isLoading}
        name={project.name}
        status={project.status}
        dueDate={new Date(project.due_date)}
        totalQuotes={0}
        totalAmount={0}
      />

      <Tabs defaultValue="quotes" className="w-full">
        <TabsList>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
        <TabsContent value="quotes" className="mt-6">
          <QuoteComparison projectId={id!} />
        </TabsContent>
        <TabsContent value="files" className="mt-6">
          <ProjectFiles files={[]} isLoading={false} />
        </TabsContent>
        <TabsContent value="timeline" className="mt-6">
          <ProjectTimelineView projectId={id!} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetails;