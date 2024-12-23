import { useProjectData } from "@/hooks/useProjectData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectTimelineView } from "@/components/projects/ProjectTimelineView";
import { QuoteAnalytics } from "@/components/analytics/QuoteAnalytics";
import { useQuoteData } from "@/hooks/useQuoteData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

const Projects = () => {
  const { projects, isLoading: projectsLoading } = useProjectData();
  const { quotes, isLoading: quotesLoading } = useQuoteData();

  if (projectsLoading || quotesLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Projects</h1>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{project.description}</p>
                  <div className="mt-4">
                    <span className="text-sm font-medium">Due Date: </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(project.due_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm font-medium">Status: </span>
                    <span className="text-sm text-muted-foreground capitalize">
                      {project.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <ProjectTimelineView projectId={projects[0]?.id} />
        </TabsContent>

        <TabsContent value="analytics">
          <QuoteAnalytics quotes={quotes} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Projects;