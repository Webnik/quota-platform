import { Card } from "@/components/ui/card";
import { QuoteResponse } from "@/types/quote";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface SeasonalTrendsChartProps {
  quotes: QuoteResponse[];
}

export const SeasonalTrendsChart = ({ quotes }: SeasonalTrendsChartProps) => {
  const seasonalData = quotes.reduce((acc, quote) => {
    const date = new Date(quote.created_at);
    const month = date.getMonth();
    const year = date.getFullYear();
    const key = `${year}-${month}`;
    
    if (!acc[key]) {
      acc[key] = { total: 0, count: 0, month, year };
    }
    acc[key].total += Number(quote.amount);
    acc[key].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number; month: number; year: number }>);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const seasonalTrendsData = Object.values(seasonalData)
    .map(({ total, count, month, year }) => ({
      period: `${monthNames[month]} ${year}`,
      averageAmount: total / count,
      month,
      year,
    }))
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Seasonal Price Variations</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={seasonalTrendsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`$${value.toLocaleString()}`, 'Average Amount']}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="averageAmount" 
              stroke="#82ca9d" 
              name="Seasonal Average"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};