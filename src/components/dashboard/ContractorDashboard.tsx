import { Quote } from "@/types/quote";
import { Project } from "@/types/project";
import { Skeleton } from "@/components/ui/skeleton";

interface ContractorDashboardProps {
  quotes?: Quote[];
  projects?: Project[];
  isLoading: boolean;
}

export const ContractorDashboard = ({ quotes, projects, isLoading }: ContractorDashboardProps) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Contractor Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Contractor Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-card rounded-lg">
          <h3 className="font-semibold">Active Quotes</h3>
          <p className="text-2xl">{quotes?.filter(q => q.status === 'pending').length || 0}</p>
        </div>
        <div className="p-4 bg-card rounded-lg">
          <h3 className="font-semibold">Total Quotes</h3>
          <p className="text-2xl">{quotes?.length || 0}</p>
        </div>
      </div>
      <div className="space-y-4">
        {quotes?.map((quote) => (
          <div key={quote.id} className="p-4 bg-card rounded-lg">
            <h3 className="font-semibold">{quote.project.name}</h3>
            <p className="text-sm text-muted-foreground">{quote.project.description}</p>
            <div className="flex justify-between mt-2">
              <span className="text-sm">Amount: ${quote.amount}</span>
              <span className="capitalize px-2 py-1 rounded text-xs bg-primary/10">{quote.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};