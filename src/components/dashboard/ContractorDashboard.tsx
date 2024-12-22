import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuoteResponse } from "@/types/quote";
import { Project } from "@/types/project";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarClock, DollarSign, FileText, ListChecks } from "lucide-react";

interface ContractorDashboardProps {
  quotes?: QuoteResponse[];
  projects?: Project[];
  isLoading: boolean;
}

export const ContractorDashboard = ({ quotes = [], projects = [], isLoading }: ContractorDashboardProps) => {
  const pendingQuotes = quotes.filter(q => q.status === 'pending');
  const acceptedQuotes = quotes.filter(q => q.status === 'accepted');
  const totalQuoteValue = acceptedQuotes.reduce((sum, quote) => sum + Number(quote.amount), 0);
  const activeProjects = new Set(quotes.map(q => q.project.id)).size;

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[70px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-[100px] mb-2" />
              <Skeleton className="h-4 w-[130px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              Projects with your quotes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Quotes</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingQuotes.length}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted Quotes</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{acceptedQuotes.length}</div>
            <p className="text-xs text-muted-foreground">
              Ready to proceed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalQuoteValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              From accepted quotes
            </p>
          </CardContent>
        </Card>
      </div>

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
    </div>
  );
};