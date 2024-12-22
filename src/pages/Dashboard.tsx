import { ConsultantDashboard } from "@/components/dashboard/ConsultantDashboard";
import { ContractorDashboard } from "@/components/dashboard/ContractorDashboard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useProjectsData } from "@/hooks/useProjectsData";
import { useQuotesData } from "@/hooks/useQuotesData";

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, isLoading } = useProfile();
  const { projects, projectsLoading } = useProjectsData(profile);
  const { quotes, quotesLoading } = useQuotesData(profile);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!profile) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to Quota</h1>
        <p className="text-muted-foreground mb-6">
          It looks like you're new here. Please complete your profile to get started.
        </p>
        <Button onClick={() => navigate('/complete-profile')}>
          Complete Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <DashboardHeader profile={profile} />

      {profile.role === 'consultant' ? (
        <ConsultantDashboard 
          projects={projects} 
          isLoading={projectsLoading} 
        />
      ) : profile.role === 'contractor' ? (
        <ContractorDashboard 
          quotes={quotes} 
          projects={projects}
          isLoading={quotesLoading || projectsLoading} 
        />
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          Unknown user role. Please contact support.
        </div>
      )}
    </div>
  );
};

export default Dashboard;