import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Profile } from "@/types/profile";

interface DashboardHeaderProps {
  profile: Profile;
}

export const DashboardHeader = ({ profile }: DashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {profile.full_name}
        </p>
      </div>
      {profile.role === 'consultant' && (
        <Link to="/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Button>
        </Link>
      )}
    </div>
  );
};