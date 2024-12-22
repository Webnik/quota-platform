import { QuoteResponse } from "@/types/quote";
import { QuoteResponseMetrics } from "./metrics/QuoteResponseMetrics";
import { PriceTrendsChart } from "./charts/PriceTrendsChart";
import { MarketComparisonChart } from "./charts/MarketComparisonChart";
import { SeasonalTrendsChart } from "./charts/SeasonalTrendsChart";
import { CostBreakdownChart } from "./charts/CostBreakdownChart";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface QuoteAnalyticsProps {
  quotes: QuoteResponse[];
}

export const QuoteAnalytics = ({ quotes }: QuoteAnalyticsProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quote Analytics Overview</CardTitle>
        </CardHeader>
        <QuoteResponseMetrics quotes={quotes} />
      </Card>

      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Price Trends</TabsTrigger>
          <TabsTrigger value="market">Market Analysis</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal Patterns</TabsTrigger>
          <TabsTrigger value="breakdown">Cost Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <PriceTrendsChart quotes={quotes} />
        </TabsContent>

        <TabsContent value="market">
          <MarketComparisonChart quotes={quotes} />
        </TabsContent>

        <TabsContent value="seasonal">
          <SeasonalTrendsChart quotes={quotes} />
        </TabsContent>

        <TabsContent value="breakdown">
          <CostBreakdownChart quotes={quotes} />
        </TabsContent>
      </Tabs>
    </div>
  );
};