import { useQuoteData } from "@/hooks/useQuoteData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuoteAnalytics } from "@/components/analytics/QuoteAnalytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

const Quotes = () => {
  const { quotes, isLoading } = useQuoteData();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Quotes</h1>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">All Quotes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <div className="grid gap-6">
            {quotes.map((quote) => (
              <Card key={quote.id}>
                <CardHeader>
                  <CardTitle>Quote for {quote.project.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Amount: </span>
                      <span className="text-muted-foreground">
                        ${Number(quote.amount).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Contractor: </span>
                      <span className="text-muted-foreground">
                        {quote.contractor.company_name || quote.contractor.full_name}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Status: </span>
                      <span className="text-muted-foreground capitalize">
                        {quote.status}
                      </span>
                    </div>
                    {quote.notes && (
                      <div>
                        <span className="font-medium">Notes: </span>
                        <span className="text-muted-foreground">{quote.notes}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <QuoteAnalytics quotes={quotes} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Quotes;