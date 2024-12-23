import ProjectAnalytics from "@/components/analytics/ProjectAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AdminAnalyticsOverview = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ProjectAnalytics />
      </CardContent>
    </Card>
  );
};