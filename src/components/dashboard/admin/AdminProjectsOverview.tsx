import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuoteAnalytics } from "@/components/analytics/QuoteAnalytics";
import { QuoteResponse } from "@/types/quote";

interface AdminProjectsOverviewProps {
  quotes: QuoteResponse[];
}

export const AdminProjectsOverview = ({ quotes }: AdminProjectsOverviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <QuoteAnalytics quotes={quotes} />
      </CardContent>
    </Card>
  );
};