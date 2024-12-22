import { Card } from "@/components/ui/card";
import { QuoteResponse } from "@/types/quote";

interface QuoteResponseMetricsProps {
  quotes: QuoteResponse[];
}

export const QuoteResponseMetrics = ({ quotes }: QuoteResponseMetricsProps) => {
  const averageResponseTime = quotes.reduce((sum, quote) => {
    const created = new Date(quote.created_at);
    const updated = new Date(quote.updated_at);
    return sum + (updated.getTime() - created.getTime());
  }, 0) / (quotes.length || 1);

  const daysToRespond = Math.floor(averageResponseTime / (1000 * 60 * 60 * 24));

  return (
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
  );
};