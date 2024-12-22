import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuoteResponse } from "@/types/quote";
import { Project } from "@/types/project";
import { Skeleton } from "@/components/ui/skeleton";

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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {quotes.map((quote) => (
        <Link key={quote.id} to={`/projects/${quote.project_id}`}>
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
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};