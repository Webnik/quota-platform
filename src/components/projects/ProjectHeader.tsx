import { formatCurrency } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectHeaderProps {
  name: string;
  status: string;
  dueDate: Date;
  totalQuotes?: number;
  totalAmount?: number;
  isLoading?: boolean;
}

const ProjectHeader = ({ 
  name, 
  status, 
  dueDate, 
  totalQuotes = 0, 
  totalAmount = 0, 
  isLoading = false 
}: ProjectHeaderProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{name}</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-lg bg-secondary/50">
          <p className="text-sm text-muted-foreground">Status</p>
          <p className="text-2xl font-semibold mt-1 capitalize">{status}</p>
        </div>
        
        <div className="p-6 rounded-lg bg-secondary/50">
          <p className="text-sm text-muted-foreground">Due Date</p>
          <p className="text-2xl font-semibold mt-1">
            {new Date(dueDate).toLocaleDateString()}
          </p>
        </div>
        
        <div className="p-6 rounded-lg bg-secondary/50">
          <p className="text-sm text-muted-foreground">
            Total Quotes ({totalQuotes})
          </p>
          <p className="text-2xl font-semibold mt-1">
            {formatCurrency(totalAmount)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;