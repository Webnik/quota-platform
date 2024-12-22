import { Card } from "@/components/ui/card";
import { QuoteResponse } from "@/types/quote";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

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
    projectName: quote.project.name,
  }));

  // Calculate response time metrics
  const averageResponseTime = quotes.reduce((sum, quote) => {
    const created = new Date(quote.created_at);
    const updated = new Date(quote.updated_at);
    return sum + (updated.getTime() - created.getTime());
  }, 0) / (quotes.length || 1);

  const daysToRespond = Math.floor(averageResponseTime / (1000 * 60 * 60 * 24));

  // Calculate seasonal variations
  const seasonalData = quotes.reduce((acc, quote) => {
    const month = new Date(quote.created_at).getMonth();
    if (!acc[month]) {
      acc[month] = { total: 0, count: 0 };
    }
    acc[month].total += Number(quote.amount);
    acc[month].count += 1;
    return acc;
  }, {} as Record<number, { total: number; count: number }>);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const seasonalAverages = Object.entries(seasonalData).map(([month, data]) => ({
    month: monthNames[Number(month)],
    averageAmount: data.total / data.count,
  }));

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quote Response Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Quotes</p>
            <p className="text-2xl font-bold">{quotes.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Average Response Time</p>
            <p className="text-2xl font-bold">{daysToRespond} days</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Average Quote Amount</p>
            <p className="text-2xl font-bold">
              ${(quotes.reduce((sum, quote) => sum + Number(quote.amount), 0) / quotes.length || 0).toFixed(2)}
            </p>
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
              <Tooltip 
                formatter={(value, name, props) => [
                  `$${value.toLocaleString()}`,
                  `${props.payload.projectName}`
                ]}
              />
              <Line type="monotone" dataKey="amount" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Seasonal Price Variations</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={seasonalAverages}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`$${value.toLocaleString()}`, 'Average Amount']}
              />
              <Bar dataKey="averageAmount" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};