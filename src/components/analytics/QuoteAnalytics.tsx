import { QuoteResponse } from "@/types/quote";
import { QuoteResponseMetrics } from "./metrics/QuoteResponseMetrics";
import { PriceTrendsChart } from "./charts/PriceTrendsChart";
import { MarketComparisonChart } from "./charts/MarketComparisonChart";
import { SeasonalTrendsChart } from "./charts/SeasonalTrendsChart";

interface QuoteAnalyticsProps {
  quotes: QuoteResponse[];
}

export const QuoteAnalytics = ({ quotes }: QuoteAnalyticsProps) => {
  return (
    <div className="space-y-6">
      <QuoteResponseMetrics quotes={quotes} />
      <PriceTrendsChart quotes={quotes} />
      <MarketComparisonChart quotes={quotes} />
      <SeasonalTrendsChart quotes={quotes} />
    </div>
  );
};