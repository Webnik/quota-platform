import { Card } from "@/components/ui/card";
import { Project } from "@/types/project";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProjectTimelineChartProps {
  projects: Project[];
}

export const ProjectTimelineChart = ({ projects }: ProjectTimelineChartProps) => {
  const timelineData = projects.map(project => ({
    name: project.name,
    dueDate: new Date(project.due_date).getTime(),
    formattedDate: new Date(project.due_date).toLocaleDateString(),
    status: project.status,
  })).sort((a, b) => a.dueDate - b.dueDate);

  return (
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
  );
};