import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ConsultantDashboard } from "@/components/dashboard/ConsultantDashboard";
import { ContractorDashboard } from "@/components/dashboard/ContractorDashboard";
import { SuperAdminDashboard } from "@/components/dashboard/SuperAdminDashboard";
import { ContractorQualityMetrics } from "@/components/analytics/metrics/ContractorQualityMetrics";
import { ReportExportManager } from "@/components/reports/ReportExportManager";
import { AdvancedSearch } from "@/components/search/AdvancedSearch";
import { NotificationPreferences } from "@/components/notifications/NotificationPreferences";
import { TwoFactorAuth } from "@/components/auth/TwoFactorAuth";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { KeyboardShortcuts } from "@/components/ui/keyboard-shortcuts";
import { EmptyState } from "@/components/ui/empty-state";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, isLoading: profileLoading } = useProfile();
  const [quotes, setQuotes] = useState([]);
  const [projects, setProjects] = useState([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // First fetch projects with basic consultant info
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select(`
          id,
          name,
          description,
          consultant_id,
          due_date,
          status,
          created_at,
          updated_at,
          consultant:profiles!projects_consultant_id_fkey (
            id,
            full_name,
            company_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      // Then fetch quotes with basic contractor info
      const { data: quotesData, error: quotesError } = await supabase
        .from("quotes")
        .select(`
          id,
          project_id,
          contractor_id,
          trade_id,
          amount,
          status,
          notes,
          created_at,
          updated_at,
          preferred,
          contractor:profiles!quotes_contractor_id_fkey (
            id,
            full_name,
            company_name,
            email
          ),
          project:projects!quotes_project_id_fkey (
            id,
            name,
            description,
            due_date,
            status
          ),
          trade:trades!quotes_trade_id_fkey (
            id,
            name,
            description
          )
        `)
        .order('created_at', { ascending: false });

      if (quotesError) throw quotesError;

      return {
        quotes: quotesData || [],
        projects: projectsData || [],
      };
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

  const showEmptyState = !isLoading && projects.length === 0 && quotes.length === 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <KeyboardShortcuts />
      <Breadcrumbs />
      
      <ErrorBoundary>
        <DashboardHeader profile={profile} />
      </ErrorBoundary>

      {profile?.role === 'super_admin' ? (
        <ErrorBoundary>
          <SuperAdminDashboard />
        </ErrorBoundary>
      ) : showEmptyState ? (
        <EmptyState
          icon={FileText}
          title="No Projects or Quotes Yet"
          description={
            profile.role === "consultant"
              ? "Start by creating your first project"
              : "You'll see projects here once you're invited to quote"
          }
          action={
            profile.role === "consultant"
              ? {
                  label: "Create Project",
                  onClick: () => navigate("/projects/new"),
                }
              : undefined
          }
        />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default Dashboard;