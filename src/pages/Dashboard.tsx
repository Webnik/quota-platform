import { useEffect } from "react";
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
import { useProjectData } from "@/hooks/useProjectData";
import { useQuoteData } from "@/hooks/useQuoteData";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, isLoading: profileLoading } = useProfile();
  const { projects = [], isLoading: projectsLoading, error: projectsError } = useProjectData();
  const { quotes = [], isLoading: quotesLoading, error: quotesError } = useQuoteData();

  useEffect(() => {
    if (projectsError) {
      toast.error("Error loading projects", {
        description: "Please try refreshing the page",
      });
      console.error("Projects error:", projectsError);
    }
    if (quotesError) {
      toast.error("Error loading quotes", {
        description: "Please try refreshing the page",
      });
      console.error("Quotes error:", quotesError);
    }
  }, [projectsError, quotesError]);

  if (profileLoading || !profile) {
    return <DashboardSkeleton />;
  }

  const isLoading = projectsLoading || quotesLoading;
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