import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, isAfter, isBefore, addDays, differenceInDays } from 'date-fns';

export const ProjectDelayChart = () => {
  const { data: delayData } = useQuery({
    queryKey: ['project-delays'],
    queryFn: async () => {
      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .not('status', 'eq', 'closed');
      
      if (error) throw error;

      const now = new Date();
      const warningThreshold = addDays(now, 7); // Projects due within 7 days

      const projectsWithDelay = projects.map(project => {
        const dueDate = new Date(project.due_date);
        const delay = differenceInDays(now, dueDate);
        
        let status;
        if (isAfter(now, dueDate)) {
          status = 'Delayed';
        } else if (isBefore(dueDate, warningThreshold)) {
          status = 'At Risk';
        } else {
          status = 'On Time';
        }

        return {
          ...project,
          delay,
          status
        };
      });

      const delayCategories = {
        'Delayed': { count: 0, avgDelay: 0, fill: '#ef4444' },
        'At Risk': { count: 0, avgDelay: 0, fill: '#f59e0b' },
        'On Time': { count: 0, avgDelay: 0, fill: '#22c55e' }
      };

      projectsWithDelay.forEach(project => {
        delayCategories[project.status].count++;
        delayCategories[project.status].avgDelay += Math.abs(project.delay);
      });

      return Object.entries(delayCategories).map(([status, data]) => ({
        name: status,
        projects: data.count,
        averageDelay: data.count > 0 ? Math.round(data.avgDelay / data.count) : 0,
        fill: data.fill
      }));
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Delay Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={delayData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                label={{ value: 'Avg Days', angle: 90, position: 'insideRight' }}
              />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'averageDelay' ? `${value} days` : value,
                  name === 'averageDelay' ? 'Average Delay' : 'Projects'
                ]}
              />
              <Legend />
              <Bar 
                dataKey="projects" 
                fill="#8884d8" 
                yAxisId="left"
                name="Number of Projects"
              />
              <Bar 
                dataKey="averageDelay" 
                fill="#82ca9d" 
                yAxisId="right"
                name="Average Delay (Days)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};