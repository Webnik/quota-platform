import { QuoteResponse } from "@/types/quote";
import { Project } from "@/types/project";
import { Skeleton } from "@/components/ui/skeleton";
import { ContractorStats } from "./contractor/ContractorStats";
import { QuotesList } from "./contractor/QuotesList";
import { QuoteAnalytics } from "../analytics/QuoteAnalytics";
import { ContractorRatings } from "./contractor/ContractorRatings";
import { useProfile } from "@/hooks/useProfile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useQuoteData } from "@/hooks/useQuoteData";

interface ContractorDashboardProps {
  quotes?: QuoteResponse[];
  projects?: Project[];
  isLoading: boolean;
}

export const ContractorDashboard = ({ quotes: initialQuotes = [], projects = [], isLoading }: ContractorDashboardProps) => {
  const { profile } = useProfile();
  const [quotes, setQuotes] = useState<QuoteResponse[]>(initialQuotes);
  const { updateQuote } = useQuoteData();

  const handleQuoteUpdate = async (updatedQuote: QuoteResponse) => {
    try {
      // Update the database
      await updateQuote.mutateAsync({
        id: updatedQuote.id,
        status: updatedQuote.status,
        amount: updatedQuote.amount,
        notes: updatedQuote.notes,
        preferred: updatedQuote.preferred
      });

      // Update local state after successful database update
      setQuotes(prevQuotes => 
        prevQuotes.map(quote => 
          quote.id === updatedQuote.id ? updatedQuote : quote
        )
      );
    } catch (error) {
      console.error('Error updating quote:', error);
    }
  };

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
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
        </TabsList>

        <TabsContent value="quotes">
          <QuotesList quotes={quotes} onQuoteUpdate={handleQuoteUpdate} />
        </TabsContent>

        <TabsContent value="analytics">
          <QuoteAnalytics quotes={quotes} />
        </TabsContent>

        <TabsContent value="ratings">
          {profile && <ContractorRatings contractorId={profile.id} />}
        </TabsContent>
      </Tabs>
    </div>
  );
};