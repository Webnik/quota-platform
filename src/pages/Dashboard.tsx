import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Profile } from "@/types/profile";
import { QuoteResponse } from "@/types/quote";
import { Project } from "@/types/project";
import { ConsultantDashboard } from "@/components/dashboard/ConsultantDashboard";
import { ContractorDashboard } from "@/components/dashboard/ContractorDashboard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { ProfileNotFound } from "@/components/dashboard/ProfileNotFound";

const Dashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [quotes, setQuotes] = useState<QuoteResponse[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quotesLoading, setQuotesLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch data based on user role
        if (profileData.role === 'consultant') {
          fetchConsultantData(user.id);
        } else if (profileData.role === 'contractor') {
          fetchContractorData(user.id);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchConsultantData = async (userId: string) => {
      try {
        setProjectsLoading(true);
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('consultant_id', userId);
        
        if (projectsError) throw projectsError;
        setProjects(projectsData || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to load projects');
      } finally {
        setProjectsLoading(false);
      }
    };

    const fetchContractorData = async (userId: string) => {
      try {
        setQuotesLoading(true);
        const { data: quotesData, error: quotesError } = await supabase
          .from('quotes')
          .select(`
            *,
            contractor:contractor_id (
              id,
              full_name,
              company_name
            ),
            project:project_id (*),
            files (*)
          `)
          .eq('contractor_id', userId);
        
        if (quotesError) throw quotesError;
        setQuotes(quotesData || []);
      } catch (error) {
        console.error('Error fetching quotes:', error);
        toast.error('Failed to load quotes');
      } finally {
        setQuotesLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!profile) {
    return <ProfileNotFound />;
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