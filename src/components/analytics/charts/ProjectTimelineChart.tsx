import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const ProjectTimelineChart = () => {
  const { data: timelineData } = useQuery({
    queryKey: ['project-timeline'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_timeline')
        .select('created_at, event_type')
        .order('created_at');
      
      if (error) throw error;

      const events = data.reduce((acc: Record<string, number>, event) => {
        const date = format(new Date(event.created_at), 'yyyy-MM-dd');
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(events).map(([date, count]) => ({
        date,
        events: count
      }));
    }
  });

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Project Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData}>
              <XAxis 
                dataKey="date"
                tickFormatter={(value) => format(new Date(value), 'MMM d')}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => format(new Date(value), 'MMM d, yyyy')}
              />
              <Line
                type="monotone"
                dataKey="events"
                stroke="#8884d8"
                name="Events"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectTimelineChart;