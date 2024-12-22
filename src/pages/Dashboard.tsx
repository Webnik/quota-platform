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
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { toast } from "sonner";

const Dashboard = () => {
  const { profile, isLoading: profileLoading } = useProfile();
  const [quotes, setQuotes] = useState([]);
  const [projects, setProjects] = useState([]);

  const { data, isLoading, error } = useQuery({
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

      try {
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
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data", {
          description: "Please try again later",
        });
        throw error;
      }
    },
    retry: 3,
    retryDelay: 1000,
  });

  useEffect(() => {
    if (data) {
      setQuotes(data.quotes);
      setProjects(data.projects);
    }
  }, [data]);

  if (error) {
    toast.error("Error loading dashboard", {
      description: "Please try refreshing the page",
    });
    console.error("Dashboard error:", error);
  }

  if (profileLoading || !profile) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <ErrorBoundary>
        <DashboardHeader profile={profile} />
      </ErrorBoundary>
      
      <div className="grid gap-6 md:grid-cols-2">
        <ErrorBoundary>
          <AdvancedSearch />
        </ErrorBoundary>
        <ErrorBoundary>
          <ReportExportManager />
        </ErrorBoundary>
      </div>

      <ErrorBoundary>
        {profile?.role === 'consultant' ? (
          <ConsultantDashboard projects={projects} isLoading={isLoading} />
        ) : (
          <ContractorDashboard quotes={quotes} projects={projects} isLoading={isLoading} />
        )}
      </ErrorBoundary>

      <div className="grid gap-6 md:grid-cols-2">
        <ErrorBoundary>
          <NotificationPreferences />
        </ErrorBoundary>
        <ErrorBoundary>
          <TwoFactorAuth />
        </ErrorBoundary>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ErrorBoundary>
          <ContractorQualityMetrics />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default Dashboard;