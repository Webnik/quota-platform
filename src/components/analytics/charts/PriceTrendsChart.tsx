import { Card } from "@/components/ui/card";
import { QuoteResponse } from "@/types/quote";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { useMemo } from "react";

interface PriceTrendsChartProps {
  quotes: QuoteResponse[];
}

interface TrendDataPoint {
  date: string;
  amount: number;
  projectName: string;
  trade: string;
  status: string;
}

export const PriceTrendsChart = ({ quotes }: PriceTrendsChartProps) => {
  const trendData = useMemo(() => {
    const sortedQuotes = [...quotes].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    return sortedQuotes.map(quote => ({
      date: new Date(quote.created_at).toLocaleDateString(),
      amount: Number(quote.amount),
      projectName: quote.project.name,
      trade: quote.trade?.name || 'Unknown',
      status: quote.status
    }));
  }, [quotes]);

  const averageAmount = useMemo(() => {
    const sum = trendData.reduce((acc, curr) => acc + curr.amount, 0);
    return sum / trendData.length;
  }, [trendData]);

  const getDotFill = (status: string) => {
    switch(status) {
      case 'accepted': return "#22c55e";
      case 'rejected': return "#ef4444";
      default: return "#8884d8";
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Historical Price Trends</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip 
              formatter={(value, name, props) => [
                `$${Number(value).toLocaleString()}`,
                `${props.payload.projectName} (${props.payload.trade})`
              ]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <ReferenceLine 
              y={averageAmount} 
              label="Average" 
              stroke="#ff7300" 
              strokeDasharray="3 3"
            />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#8884d8" 
              name="Quote Amount"
              dot={{
                r: 4,
                strokeWidth: 1,
                stroke: "#fff",
                fill: "#8884d8"
              }}
              activeDot={{
                r: 6,
                fill: (props: any) => getDotFill(props.payload.status)
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};