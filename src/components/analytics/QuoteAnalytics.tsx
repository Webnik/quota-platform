import { Card } from "@/components/ui/card";
import { QuoteResponse } from "@/types/quote";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

interface QuoteAnalyticsProps {
  quotes: QuoteResponse[];
}

export const QuoteAnalytics = ({ quotes }: QuoteAnalyticsProps) => {
  // Calculate price trends with year-over-year comparison
  const sortedQuotes = [...quotes].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const trendData = sortedQuotes.map(quote => ({
    date: new Date(quote.created_at).toLocaleDateString(),
    amount: Number(quote.amount),
    projectName: quote.project.name,
    trade: quote.trade?.name || 'Unknown',
  }));

  // Calculate average by trade for market comparison
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

  // Calculate seasonal variations with more detail
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
    </div>
  );
};