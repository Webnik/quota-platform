import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const ProjectSuccessMetrics = () => {
  const { data: metrics } = useQuery({
    queryKey: ['project-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('status, due_date');
      
      if (error) throw error;

      const total = data.length;
      const completed = data.filter(p => p.status === 'closed').length;
      const delayed = data.filter(p => {
        return new Date(p.due_date) < new Date() && p.status !== 'closed';
      }).length;

      return {
        successRate: total ? (completed / total * 100).toFixed(1) : 0,
        delayRate: total ? (delayed / total * 100).toFixed(1) : 0,
        totalProjects: total
      };
    }
  });

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics?.successRate}%</div>
          <p className="text-xs text-muted-foreground">
            Projects completed successfully
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Delay Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics?.delayRate}%</div>
          <p className="text-xs text-muted-foreground">
            Projects with delays
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics?.totalProjects}</div>
          <p className="text-xs text-muted-foreground">
            All-time projects
          </p>
        </CardContent>
      </Card>
    </div>
  );
};