import { Card } from "@/components/ui/card";
import { Project } from "@/types/project";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProjectStatusChartProps {
  projects: Project[];
}

export const ProjectStatusChart = ({ projects }: ProjectStatusChartProps) => {
  const statusData = projects.reduce((acc, project) => {
    const status = project.status || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(statusData).map(([status, count]) => ({
    status,
    count,
  }));

  return (
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
  );
};