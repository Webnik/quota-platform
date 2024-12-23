import { useProjectData } from "@/hooks/useProjectData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ProjectList } from "@/components/dashboard/consultant/ProjectList";

const ArchivedProjects = () => {
  const { projects, isLoading, updateProject } = useProjectData();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const archivedProjects = projects?.filter(project => project.status === 'archived') || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Archived Projects</h1>
      </div>

      {archivedProjects.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">No archived projects found</p>
          </CardContent>
        </Card>
      ) : (
        <ProjectList projects={archivedProjects} onProjectUpdate={updateProject} />
      )}
    </div>
  );
};

export default ArchivedProjects;