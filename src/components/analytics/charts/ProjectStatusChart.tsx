import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ProjectStatusChart = () => {
  const { data: statusData } = useQuery({
    queryKey: ['project-status'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('status');
      
      if (error) throw error;

      const statusCounts = data.reduce((acc: Record<string, number>, project) => {
        acc[project.status] = (acc[project.status] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(statusCounts).map(([status, count]) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1),
        count
      }));
    }
  });

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Project Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData}>
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectStatusChart;