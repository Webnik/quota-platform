import { QuoteResponse } from "@/types/quote";
import { QuoteResponseMetrics } from "./metrics/QuoteResponseMetrics";
import { PriceTrendsChart } from "./charts/PriceTrendsChart";
import { MarketComparisonChart } from "./charts/MarketComparisonChart";
import { SeasonalTrendsChart } from "./charts/SeasonalTrendsChart";
import { CostBreakdownChart } from "./charts/CostBreakdownChart";

interface QuoteAnalyticsProps {
  quotes: QuoteResponse[];
}

export const QuoteAnalytics = ({ quotes }: QuoteAnalyticsProps) => {
  return (
    <div className="space-y-6">
      <QuoteResponseMetrics quotes={quotes} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CostBreakdownChart quotes={quotes} />
        <MarketComparisonChart quotes={quotes} />
      </div>
      <PriceTrendsChart quotes={quotes} />
      <SeasonalTrendsChart quotes={quotes} />
    </div>
  );
};