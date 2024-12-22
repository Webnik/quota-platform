import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuoteResponse } from "@/types/quote";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface QuotesListProps {
  quotes: QuoteResponse[];
  onQuoteUpdate?: (quote: QuoteResponse) => void;
}

export const QuotesList = ({ quotes, onQuoteUpdate }: QuotesListProps) => {
  useEffect(() => {
    const channel = supabase
      .channel('quotes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quotes'
        },
        async (payload) => {
          if (payload.eventType === 'UPDATE') {
            const { data: quote, error } = await supabase
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
              .eq('id', payload.new.id)
              .single();

            if (error) {
              console.error('Error fetching updated quote:', error);
              return;
            }

            if (quote) {
              onQuoteUpdate?.(quote);
              toast.info(`Quote ${payload.new.id} has been updated`);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onQuoteUpdate]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Recent Quotes</h2>
      <div className="grid gap-4">
        {quotes.slice(0, 5).map((quote) => (
          <Link key={quote.id} to={`/projects/${quote.project.id}`}>
            <Card className="hover:bg-muted/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {quote.project.name}
                </CardTitle>
                <Badge variant={quote.status === 'pending' ? 'secondary' : 'default'}>
                  {quote.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${quote.amount.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Due {new Date(quote.project.due_date).toLocaleDateString()}
                </p>
                {quote.files.length > 0 && (
                  <div className="mt-2 flex gap-2">
                    {quote.files.map((file) => (
                      <Badge key={file.id} variant="outline">
                        {file.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};