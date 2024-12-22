import { Card } from "@/components/ui/card";
import { QuoteResponse } from "@/types/quote";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface MarketComparisonChartProps {
  quotes: QuoteResponse[];
}

export const MarketComparisonChart = ({ quotes }: MarketComparisonChartProps) => {
  const tradeAverages = quotes.reduce((acc, quote) => {
    const tradeName = quote.trade?.name || 'Unknown';
    if (!acc[tradeName]) {
      acc[tradeName] = { total: 0, count: 0 };
    }
    acc[tradeName].total += Number(quote.amount);
    acc[tradeName].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const marketComparisonData = Object.entries(tradeAverages).map(([trade, data]) => ({
    trade,
    averageAmount: data.total / data.count,
  }));

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Market Rate Comparison by Trade</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={marketComparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="trade" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`$${value.toLocaleString()}`, 'Average Amount']}
            />
            <Legend />
            <Bar 
              dataKey="averageAmount" 
              fill="#82ca9d" 
              name="Average Quote Amount"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};