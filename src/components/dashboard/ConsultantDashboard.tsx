import { Profile } from "@/types/profile";
import { Project } from "@/types/project";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ConsultantDashboardProps {
  projects?: Project[];
  isLoading: boolean;
}

export const ConsultantDashboard = ({ projects, isLoading }: ConsultantDashboardProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Consultant Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Consultant Dashboard</h2>
        <Button onClick={() => navigate("/projects/new")}>
          Create Project
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-card rounded-lg">
          <h3 className="font-semibold">Active Projects</h3>
          <p className="text-2xl">{projects?.filter(p => p.status === 'open').length || 0}</p>
        </div>
        <div className="p-4 bg-card rounded-lg">
          <h3 className="font-semibold">Total Projects</h3>
          <p className="text-2xl">{projects?.length || 0}</p>
        </div>
      </div>
      <div className="space-y-4">
        {projects?.map((project) => (
          <div key={project.id} className="p-4 bg-card rounded-lg">
            <h3 className="font-semibold">{project.name}</h3>
            <p className="text-sm text-muted-foreground">{project.description}</p>
            <div className="flex justify-between mt-2">
              <span className="text-sm">Due: {new Date(project.due_date).toLocaleDateString()}</span>
              <span className="capitalize px-2 py-1 rounded text-xs bg-primary/10">{project.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};