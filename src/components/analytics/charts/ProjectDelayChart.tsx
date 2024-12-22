import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, isAfter, isBefore, addDays } from 'date-fns';

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

      const delayed = projects.filter(p => isAfter(now, new Date(p.due_date))).length;
      const atRisk = projects.filter(p => {
        const dueDate = new Date(p.due_date);
        return isBefore(now, dueDate) && isBefore(dueDate, warningThreshold);
      }).length;
      const onTime = projects.filter(p => isBefore(now, new Date(p.due_date))).length - atRisk;

      return [
        { name: 'Delayed', value: delayed, fill: '#ef4444' },
        { name: 'At Risk', value: atRisk, fill: '#f59e0b' },
        { name: 'On Time', value: onTime, fill: '#22c55e' }
      ];
    }
  });

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Project Delay Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={delayData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Projects" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};