import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ConsultantDashboard } from "@/components/dashboard/ConsultantDashboard";
import { ContractorDashboard } from "@/components/dashboard/ContractorDashboard";
import { ContractorQualityMetrics } from "@/components/analytics/metrics/ContractorQualityMetrics";
import { ReportExportManager } from "@/components/reports/ReportExportManager";
import { AdvancedSearch } from "@/components/search/AdvancedSearch";
import { NotificationPreferences } from "@/components/notifications/NotificationPreferences";
import { TwoFactorAuth } from "@/components/auth/TwoFactorAuth";

const Dashboard = () => {
  const { profile, isLoading: profileLoading } = useProfile();
  const [quotes, setQuotes] = useState([]);
  const [projects, setProjects] = useState([]);

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const quotesPromise = supabase
        .from("quotes")
        .select(`
          *,
          contractor:contractor_id (*),
          project:project_id (*),
          trade:trade_id (*)
        `)
        .order("created_at", { ascending: false });

      const projectsPromise = supabase
        .from("projects")
        .select(`
          *,
          consultant:consultant_id (*)
        `)
        .order("created_at", { ascending: false });

      const [quotesResponse, projectsResponse] = await Promise.all([
        quotesPromise,
        projectsPromise,
      ]);

      if (quotesResponse.error) throw quotesResponse.error;
      if (projectsResponse.error) throw projectsResponse.error;

      return {
        quotes: quotesResponse.data,
        projects: projectsResponse.data,
      };
    },
  });

  useEffect(() => {
    if (data) {
      setQuotes(data.quotes);
      setProjects(data.projects);
    }
  }, [data]);

  if (profileLoading || !profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <DashboardHeader profile={profile} />
      
      <div className="grid gap-6 md:grid-cols-2">
        <AdvancedSearch />
        <ReportExportManager />
      </div>

      {profile?.role === 'consultant' ? (
        <ConsultantDashboard projects={projects} isLoading={isLoading} />
      ) : (
        <ContractorDashboard quotes={quotes} projects={projects} isLoading={isLoading} />
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <NotificationPreferences />
        <TwoFactorAuth />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ContractorQualityMetrics />
        {/* Other metrics components */}
      </div>
    </div>
  );
};

export default Dashboard;