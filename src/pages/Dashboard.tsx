import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Profile } from "@/types/profile";
import { ConsultantDashboard } from "@/components/dashboard/ConsultantDashboard";
import { ContractorDashboard } from "@/components/dashboard/ContractorDashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);

  // Fetch profile data
  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate("/login");
          return;
        }

        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) throw error;
        setProfile(profileData);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Error loading profile");
      }
    };

    getProfile();
  }, [navigate]);

  // Fetch projects based on role
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects', profile?.role],
    queryFn: async () => {
      if (!profile) return [];
      
      let query = supabase
        .from("projects")
        .select(`
          id,
          name,
          description,
          status,
          due_date
        `);

      if (profile.role === 'consultant') {
        query = query.eq('consultant_id', profile.id);
      } else if (profile.role === 'contractor') {
        // First get the project IDs where the contractor has quotes
        const { data: projectIds } = await supabase
          .from('quotes')
          .select('project_id')
          .eq('contractor_id', profile.id);
        
        if (projectIds && projectIds.length > 0) {
          query = query.in('id', projectIds.map(p => p.project_id));
        } else {
          return []; // Return empty array if no projects found
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!profile
  });

  // Fetch quotes for contractors
  const { data: quotes, isLoading: quotesLoading } = useQuery({
    queryKey: ['quotes', profile?.id],
    queryFn: async () => {
      if (!profile || profile.role !== 'contractor') return [];
      
      const { data, error } = await supabase
        .from("quotes")
        .select(`
          id,
          amount,
          status,
          project:projects (
            id,
            name,
            description,
            status,
            due_date
          )
        `)
        .eq('contractor_id', profile.id);

      if (error) throw error;
      return data;
    },
    enabled: !!profile && profile.role === 'contractor'
  });

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {profile?.full_name}</h1>
          <p className="text-muted capitalize">{profile?.role}</p>
        </div>
        <Button variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
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
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive">Invalid Role</h2>
          <p className="text-muted">Please contact an administrator.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;