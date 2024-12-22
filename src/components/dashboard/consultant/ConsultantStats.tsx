import { Project } from "@/types/project";
import { Card } from "@/components/ui/card";
import { FileText, ListChecks } from "lucide-react";

interface ConsultantStatsProps {
  projects?: Project[];
}

export const ConsultantStats = ({ projects = [] }: ConsultantStatsProps) => {
  const activeProjects = projects?.filter(p => p.status === 'open').length || 0;
  const totalProjects = projects?.length || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">Active Projects</h3>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="text-2xl font-bold">{activeProjects}</p>
        <p className="text-xs text-muted-foreground">Currently in progress</p>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">Total Projects</h3>
          <ListChecks className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="text-2xl font-bold">{totalProjects}</p>
        <p className="text-xs text-muted-foreground">All time</p>
      </Card>
    </div>
  );
};