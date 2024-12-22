import { Project } from "@/types/project";
import { Card } from "@/components/ui/card";

interface ConsultantStatsProps {
  projects?: Project[];
}

export const ConsultantStats = ({ projects = [] }: ConsultantStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4">
        <h3 className="font-semibold">Active Projects</h3>
        <p className="text-2xl">{projects?.filter(p => p.status === 'open').length || 0}</p>
      </Card>
      <Card className="p-4">
        <h3 className="font-semibold">Total Projects</h3>
        <p className="text-2xl">{projects?.length || 0}</p>
      </Card>
    </div>
  );
};