import { QuoteResponse } from "@/types/quote";
import { Project } from "@/types/project";
import { Skeleton } from "@/components/ui/skeleton";
import { ContractorStats } from "./contractor/ContractorStats";
import { QuotesList } from "./contractor/QuotesList";

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
      <QuotesList quotes={quotes} />
    </div>
  );
};