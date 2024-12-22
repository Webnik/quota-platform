import { Card } from "@/components/ui/card";
import { Project } from "@/types/project";

interface ProjectSuccessMetricsProps {
  projects: Project[];
}

export const ProjectSuccessMetrics = ({ projects }: ProjectSuccessMetricsProps) => {
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'closed').length;
  const successRate = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;
  const delayedProjects = projects.filter(project => {
    const dueDate = new Date(project.due_date);
    return dueDate < new Date() && project.status !== 'closed';
  }).length;
  const delayRate = totalProjects > 0 ? (delayedProjects / totalProjects) * 100 : 0;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Project Success Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Total Projects</p>
          <p className="text-2xl font-bold">{totalProjects}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Completed Projects</p>
          <p className="text-2xl font-bold">{completedProjects}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Success Rate</p>
          <p className="text-2xl font-bold">{successRate.toFixed(1)}%</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Delay Rate</p>
          <p className="text-2xl font-bold">{delayRate.toFixed(1)}%</p>
        </div>
      </div>
    </Card>
  );
};