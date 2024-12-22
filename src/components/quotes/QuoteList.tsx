import { Quote } from "@/types/quote";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface QuoteListProps {
  quotes: Quote[];
}

export const QuoteList = ({ quotes }: QuoteListProps) => {
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

  return (
    <div className="space-y-4">
      {quotes.map((quote) => (
        <Card key={quote.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-medium">
                {quote.contractor.company_name || quote.contractor.full_name}
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
              {quote.files && quote.files.length > 0 && (
                <div className="mt-2">
                  <span className="text-muted-foreground">Attachments:</span>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {quote.files.map((file) => (
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
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};