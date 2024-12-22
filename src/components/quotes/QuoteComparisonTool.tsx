import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QuoteResponse } from "@/types/quote";
import { Trade } from "@/types/trade";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface QuoteComparisonToolProps {
  quotes: QuoteResponse[];
}

export const QuoteComparisonTool = ({ quotes }: QuoteComparisonToolProps) => {
  const [selectedTrade, setSelectedTrade] = useState<string | null>(null);

  const tradeGroups = useMemo(() => {
    const groups = quotes.reduce((acc, quote) => {
      const tradeName = quote.trade?.name || 'Uncategorized';
      if (!acc[tradeName]) {
        acc[tradeName] = [];
      }
      acc[tradeName].push(quote);
      return acc;
    }, {} as Record<string, QuoteResponse[]>);

    // Sort quotes by amount within each trade
    Object.keys(groups).forEach(trade => {
      groups[trade].sort((a, b) => a.amount - b.amount);
    });

    return groups;
  }, [quotes]);

  const uniqueTrades = Object.keys(tradeGroups);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Quote Comparison</CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          {uniqueTrades.map((trade) => (
            <Badge
              key={trade}
              variant={selectedTrade === trade ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedTrade(trade === selectedTrade ? null : trade)}
            >
              {trade}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] w-full">
          {(selectedTrade ? [selectedTrade] : uniqueTrades).map((trade) => (
            <div key={trade} className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{trade}</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contractor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Files</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tradeGroups[trade].map((quote) => (
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
                      <TableCell>
                        {new Date(quote.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {quote.files.length > 0 ? (
                          <div className="flex gap-1">
                            {quote.files.map((file) => (
                              <Badge key={file.id} variant="outline">
                                {file.name}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">No files</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="truncate">
                          {quote.notes || <span className="text-muted-foreground">No notes</span>}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};