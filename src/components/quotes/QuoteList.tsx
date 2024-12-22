import { useQuery } from "@tanstack/react-query";
import { QuoteResponse, Quote } from "@/types/quote";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { QuoteManagement } from "./QuoteManagement";

interface QuoteListProps {
  projectId: string;
  isConsultant?: boolean;
}

export const QuoteList = ({ projectId, isConsultant = false }: QuoteListProps) => {
  const { data: quotes, isLoading } = useQuery({
    queryKey: ['quotes', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          contractor:contractor_id (
            id,
            full_name,
            company_name
          ),
          project:project_id (*),
          files (*)
        `)
        .eq('project_id', projectId);

      if (error) throw error;
      return data as unknown as QuoteResponse[];
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500";
      case "accepted":
        return "bg-green-500/10 text-green-500";
      case "rejected":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  if (isLoading) {
    return <div>Loading quotes...</div>;
  }

  if (!quotes || quotes.length === 0) {
    return <div className="text-muted-foreground">No quotes submitted yet.</div>;
  }

  return (
    <div className="space-y-4">
      {quotes.map((quoteResponse) => {
        // Transform QuoteResponse to Quote for QuoteManagement
        const quote: Quote = {
          id: quoteResponse.id,
          project_id: quoteResponse.project.id,
          contractor_id: quoteResponse.contractor.id,
          trade_id: quoteResponse.trade_id,
          amount: quoteResponse.amount,
          status: quoteResponse.status,
          notes: quoteResponse.notes,
          preferred: quoteResponse.preferred,
          created_at: quoteResponse.created_at,
          updated_at: quoteResponse.updated_at,
        };

        return (
          <Card key={quote.id} className={quote.preferred ? "border-primary" : ""}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-medium">
                  {quoteResponse.contractor.company_name || quoteResponse.contractor.full_name}
                </CardTitle>
                <Badge className={getStatusColor(quote.status)} variant="secondary">
                  {quote.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-medium">{formatCurrency(quote.amount)}</span>
                </div>
                {quote.notes && (
                  <div className="mt-2">
                    <span className="text-muted-foreground">Notes:</span>
                    <p className="mt-1 text-sm">{quote.notes}</p>
                  </div>
                )}
                {quoteResponse.files && quoteResponse.files.length > 0 && (
                  <div className="mt-2">
                    <span className="text-muted-foreground">Attachments:</span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {quoteResponse.files.map((file) => (
                        <a
                          key={file.id}
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {file.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                {isConsultant && (
                  <QuoteManagement quote={quote} isConsultant={isConsultant} />
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};