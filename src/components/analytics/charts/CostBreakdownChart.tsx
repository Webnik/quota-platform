import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const CostBreakdownChart = () => {
  const { data: costData } = useQuery({
    queryKey: ['cost-breakdown'],
    queryFn: async () => {
      const { data: quotes, error } = await supabase
        .from('quotes')
        .select(`
          amount,
          trade:trades(
            name
          )
        `)
        .eq('status', 'accepted');
      
      if (error) throw error;

      // Group and sum amounts by trade
      const tradeAmounts = quotes.reduce((acc: Record<string, number>, quote) => {
        const tradeName = quote.trade?.name || 'Uncategorized';
        acc[tradeName] = (acc[tradeName] || 0) + Number(quote.amount);
        return acc;
      }, {});

      // Convert to chart data format
      return Object.entries(tradeAmounts).map(([name, value]) => ({
        name,
        value: Number(value.toFixed(2))
      }));
    }
  });

  if (!costData?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cost Breakdown by Trade</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No cost data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Breakdown by Trade</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={costData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {costData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `$${value.toLocaleString()}`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};