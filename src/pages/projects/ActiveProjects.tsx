import { useProjectData } from "@/hooks/useProjectData";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ProjectList } from "@/components/dashboard/consultant/ProjectList";
import { Project } from "@/types/project";

const ActiveProjects = () => {
  const { projects, isLoading, updateProject } = useProjectData();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const activeProjects = projects?.filter(project => project.status === 'open') || [];

  const handleProjectUpdate = async (project: Project) => {
    await updateProject.mutateAsync(project);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Active Projects</h1>
      </div>

      {activeProjects.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">No active projects found</p>
          </CardContent>
        </Card>
      ) : (
        <ProjectList projects={activeProjects} onProjectUpdate={handleProjectUpdate} />
      )}
    </div>
  );
};

export default ActiveProjects;