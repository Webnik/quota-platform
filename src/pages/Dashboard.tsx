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
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [quotes, setQuotes] = useState<QuoteResponse[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quotesLoading, setQuotesLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          navigate('/login');
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileError) {
          console.error('Profile error:', profileError);
          toast.error('Failed to load profile');
          setIsLoading(false);
          return;
        }
        
        if (!profileData) {
          console.error('No profile found');
          setIsLoading(false);
          return;
        }

        setProfile(profileData);

        // Fetch data based on user role
        if (profileData.role === 'consultant') {
          await fetchConsultantData(user.id);
        } else if (profileData.role === 'contractor') {
          await fetchContractorData(user.id);
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
        
        if (projectsError) {
          console.error('Projects error:', projectsError);
          toast.error('Failed to load projects');
          return;
        }
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
        const { data, error } = await supabase
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

        if (error) {
          console.error('Quotes error:', error);
          toast.error('Failed to load quotes');
          return;
        }

        setQuotes(data || []);
      } catch (error) {
        console.error('Error fetching quotes:', error);
        toast.error('Failed to load quotes');
      } finally {
        setQuotesLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

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