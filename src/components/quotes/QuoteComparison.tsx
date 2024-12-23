import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";

interface Quote {
  id: string;
  amount: number;
  status: string;
  notes: string;
  created_at: string;
  contractor: {
    full_name: string;
    company_name: string;
  };
  trade: {
    name: string;
  };
  files: {
    id: string;
    name: string;
    url: string;
  }[];
}

interface QuoteComparisonProps {
  projectId: string;
}

export function QuoteComparison({ projectId }: QuoteComparisonProps) {
  const { data: quotes, isLoading } = useQuery({
    queryKey: ["project-quotes", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select(`
          id,
          amount,
          status,
          notes,
          created_at,
          contractor:profiles(full_name, company_name),
          trade:trades(name),
          files(id, name, url)
        `)
        .eq("project_id", projectId);

      if (error) throw error;
      return (data as Quote[]).sort((a, b) => {
        const tradeNameA = a.trade?.name || '';
        const tradeNameB = b.trade?.name || '';
        return tradeNameA.localeCompare(tradeNameB);
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Group quotes by trade
  const quotesByTrade = quotes?.reduce((acc, quote) => {
    const tradeName = quote.trade.name;
    if (!acc[tradeName]) {
      acc[tradeName] = [];
    }
    acc[tradeName].push(quote);
    return acc;
  }, {} as Record<string, Quote[]>);

  return (
    <div className="space-y-6">
      {Object.entries(quotesByTrade || {}).map(([tradeName, tradeQuotes]) => (
        <Card key={tradeName}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{tradeName}</CardTitle>
            <CardDescription>
              {tradeQuotes.length} quote{tradeQuotes.length !== 1 ? "s" : ""}{" "}
              received
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contractor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Files</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tradeQuotes.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {quote.contractor.full_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {quote.contractor.company_name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">
                      ${quote.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          quote.status === "accepted"
                            ? "default"
                            : quote.status === "rejected"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {quote.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDistanceToNow(new Date(quote.created_at), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell>
                      {quote.files.length > 0 ? (
                        <div className="flex gap-2">
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
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          No files
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}