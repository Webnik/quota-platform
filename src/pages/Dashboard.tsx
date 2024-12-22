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

const Dashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [quotes, setQuotes] = useState<QuoteResponse[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quotesLoading, setQuotesLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(profileData);
      }
    };

    const fetchQuotes = async () => {
      setQuotesLoading(true);
      const { data: quotesData } = await supabase
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
      setQuotes(quotesData || []);
      setQuotesLoading(false);
    };

    const fetchProjects = async () => {
      setProjectsLoading(true);
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*');
      setProjects(projectsData || []);
      setProjectsLoading(false);
    };

    fetchProfile();
    fetchQuotes();
    fetchProjects();
    setIsLoading(false);
  }, []);

  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        {profile?.role === 'consultant' && (
          <Link to="/projects/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Project
            </Button>
          </Link>
        )}
      </div>

      {isLoading ? (
        <Skeleton className="h-8 w-[200px]" />
      ) : profile?.role === 'consultant' ? (
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
      ) : null}
    </div>
  );
};

export default Dashboard;