import { Project } from "@/types/project";
import { useNavigate } from "react-router-dom";

interface ProjectListProps {
  projects: Project[];
}

export const ProjectList = ({ projects }: ProjectListProps) => {
  const navigate = useNavigate();

  if (projects.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No projects found matching your criteria
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div 
          key={project.id} 
          className="p-4 bg-card rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
          onClick={() => navigate(`/projects/${project.id}`)}
        >
          <h3 className="font-semibold">{project.name}</h3>
          <p className="text-sm text-muted-foreground">{project.description}</p>
          <div className="flex justify-between mt-2">
            <span className="text-sm">Due: {new Date(project.due_date).toLocaleDateString()}</span>
            <span className="capitalize px-2 py-1 rounded text-xs bg-primary/10">{project.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
};