import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ResourceAllocationChart = () => {
  const { data: resourceData } = useQuery({
    queryKey: ['resource-allocation'],
    queryFn: async () => {
      const { data: quotes, error } = await supabase
        .from('quotes')
        .select(`
          trade_id,
          trades (
            name
          ),
          project_id,
          contractor_id,
          projects (
            name,
            status
          )
        `)
        .eq('projects.status', 'open');
      
      if (error) throw error;

      // Group by trade and count unique contractors
      const tradeAllocation = quotes.reduce((acc, quote) => {
        const tradeName = quote.trades?.name || 'Unspecified';
        if (!acc[tradeName]) {
          acc[tradeName] = new Set();
        }
        acc[tradeName].add(quote.contractor_id);
        return acc;
      }, {});

      return Object.entries(tradeAllocation).map(([name, contractors]) => ({
        name,
        contractors: (contractors as Set<string>).size,
        fill: '#3b82f6' // blue-500
      }));
    }
  });

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Resource Allocation by Trade</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={resourceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="contractors" name="Active Contractors" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};