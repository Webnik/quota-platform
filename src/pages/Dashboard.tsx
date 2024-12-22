import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConsultantDashboard } from "@/components/dashboard/ConsultantDashboard";
import { ContractorDashboard } from "@/components/dashboard/ContractorDashboard";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";
import { QuoteResponse } from "@/types/quote";
import { Project } from "@/types/project";
import { toast } from "sonner";

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
        if (user) {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (error) throw error;
          setProfile(profileData);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      }
    };

    const fetchQuotes = async () => {
      try {
        setQuotesLoading(true);
        const { data: quotesData, error } = await supabase
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
          `);
        
        if (error) throw error;
        setQuotes(quotesData || []);
      } catch (error) {
        console.error('Error fetching quotes:', error);
        toast.error('Failed to load quotes');
      } finally {
        setQuotesLoading(false);
      }
    };

    const fetchProjects = async () => {
      try {
        setProjectsLoading(true);
        const { data: projectsData, error } = await supabase
          .from('projects')
          .select('*');
        
        if (error) throw error;
        setProjects(projectsData || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to load projects');
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchProfile();
    fetchQuotes();
    fetchProjects();
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="container py-8 space-y-8">
        <Skeleton className="h-8 w-[200px]" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {profile?.full_name}
          </p>
        </div>
        {profile?.role === 'consultant' && (
          <Link to="/projects/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Project
            </Button>
          </Link>
        )}
      </div>

      {profile?.role === 'consultant' ? (
        <ConsultantDashboard 
          projects={projects} 
          isLoading={projectsLoading} 
        />
      ) : profile?.role === 'contractor' ? (
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