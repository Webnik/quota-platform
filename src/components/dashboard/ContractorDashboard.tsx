import { QuoteResponse } from "@/types/quote";
import { Project } from "@/types/project";
import { Skeleton } from "@/components/ui/skeleton";
import { ContractorStats } from "./contractor/ContractorStats";
import { QuotesList } from "./contractor/QuotesList";
import { QuoteAnalytics } from "../analytics/QuoteAnalytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ContractorDashboardProps {
  quotes?: QuoteResponse[];
  projects?: Project[];
  isLoading: boolean;
}

export const ContractorDashboard = ({ quotes = [], projects = [], isLoading }: ContractorDashboardProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ContractorStats quotes={quotes} />
      
      <Tabs defaultValue="quotes" className="w-full">
        <TabsList>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="quotes">
          <QuotesList quotes={quotes} />
        </TabsContent>

        <TabsContent value="analytics">
          <QuoteAnalytics quotes={quotes} />
        </TabsContent>
      </Tabs>
    </div>
  );
};