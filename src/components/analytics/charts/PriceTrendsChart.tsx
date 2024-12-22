import { Card } from "@/components/ui/card";
import { QuoteResponse } from "@/types/quote";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PriceTrendsChartProps {
  quotes: QuoteResponse[];
}

export const PriceTrendsChart = ({ quotes }: PriceTrendsChartProps) => {
  const sortedQuotes = [...quotes].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const trendData = sortedQuotes.map(quote => ({
    date: new Date(quote.created_at).toLocaleDateString(),
    amount: Number(quote.amount),
    projectName: quote.project.name,
    trade: quote.trade?.name || 'Unknown',
  }));

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Historical Price Trends</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              formatter={(value, name, props) => [
                `$${value.toLocaleString()}`,
                `${props.payload.projectName} (${props.payload.trade})`
              ]}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#8884d8" 
              name="Quote Amount"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};