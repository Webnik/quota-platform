import { Card } from "@/components/ui/card";
import { QuoteResponse } from "@/types/quote";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface QuoteAnalyticsProps {
  quotes: QuoteResponse[];
}

export const QuoteAnalytics = ({ quotes }: QuoteAnalyticsProps) => {
  // Calculate price trends
  const sortedQuotes = [...quotes].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const trendData = sortedQuotes.map(quote => ({
    date: new Date(quote.created_at).toLocaleDateString(),
    amount: Number(quote.amount),
  }));

  // Calculate response time metrics
  const averageResponseTime = quotes.reduce((sum, quote) => {
    const created = new Date(quote.created_at);
    const updated = new Date(quote.updated_at);
    return sum + (updated.getTime() - created.getTime());
  }, 0) / (quotes.length || 1);

  const daysToRespond = Math.floor(averageResponseTime / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quote Response Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Quotes</p>
            <p className="text-2xl font-bold">{quotes.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Average Response Time</p>
            <p className="text-2xl font-bold">{daysToRespond} days</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quote Price Trends</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};