import { Card } from "@/components/ui/card";
import { QuoteResponse } from "@/types/quote";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CostBreakdownChartProps {
  quotes: QuoteResponse[];
}

export const CostBreakdownChart = ({ quotes }: CostBreakdownChartProps) => {
  const costBreakdown = quotes.reduce((acc, quote) => {
    const tradeName = quote.trade?.name || 'Unspecified';
    acc[tradeName] = (acc[tradeName] || 0) + Number(quote.amount);
    return acc;
  }, {} as Record<string, number>);

  const totalCost = Object.values(costBreakdown).reduce((sum, amount) => sum + amount, 0);
  
  const data = Object.entries(costBreakdown).map(([name, value]) => ({
    name,
    value,
    percentage: ((value / totalCost) * 100).toFixed(1)
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Cost Breakdown by Trade</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percentage }) => `${name} (${percentage}%)`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Amount']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};