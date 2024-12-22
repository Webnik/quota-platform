import { Card } from "@/components/ui/card";
import { Project } from "@/types/project";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface ProjectAnalyticsProps {
  projects: Project[];
}

export const ProjectAnalytics = ({ projects }: ProjectAnalyticsProps) => {
  // Calculate success rate metrics
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'closed').length;
  const successRate = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;

  // Calculate timeline metrics
  const delayedProjects = projects.filter(project => {
    const dueDate = new Date(project.due_date);
    return dueDate < new Date() && project.status !== 'closed';
  }).length;

  const delayRate = totalProjects > 0 ? (delayedProjects / totalProjects) * 100 : 0;

  // Prepare data for status chart
  const statusData = projects.reduce((acc, project) => {
    const status = project.status || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(statusData).map(([status, count]) => ({
    status,
    count,
  }));

  // Prepare timeline data with formatted dates
  const timelineData = projects.map(project => ({
    name: project.name,
    dueDate: new Date(project.due_date).getTime(),
    formattedDate: new Date(project.due_date).toLocaleDateString(),
    status: project.status,
  })).sort((a, b) => a.dueDate - b.dueDate);

  return (
    <div className="space-y-6">
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

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Project Status Distribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Project Timeline Analysis</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Tooltip 
                labelFormatter={(label) => `Project: ${label}`}
                formatter={(value) => [new Date(value as number).toLocaleDateString(), "Due Date"]}
              />
              <Line 
                type="monotone" 
                dataKey="dueDate" 
                stroke="#8884d8"
                name="Due Date"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};