import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface Profile {
  id: string;
  role: string;
  full_name: string;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  due_date: string;
}

interface Quote {
  id: string;
  amount: number;
  status: string;
  project: Project;
}

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
      
      const query = supabase
        .from("projects")
        .select(`
          id,
          name,
          description,
          status,
          due_date
        `);

      if (profile.role === 'consultant') {
        query.eq('consultant_id', profile.id);
      } else if (profile.role === 'contractor') {
        query.in('id', 
          supabase
            .from('quotes')
            .select('project_id')
            .eq('contractor_id', profile.id)
        );
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

  const renderDashboardContent = () => {
    if (!profile) return null;

    switch (profile.role) {
      case "consultant":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Consultant Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-card rounded-lg">
                <h3 className="font-semibold">Active Projects</h3>
                {projectsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl">{projects?.filter(p => p.status === 'open').length || 0}</p>
                )}
              </div>
              <div className="p-4 bg-card rounded-lg">
                <h3 className="font-semibold">Total Projects</h3>
                {projectsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl">{projects?.length || 0}</p>
                )}
              </div>
            </div>
            {projectsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                {projects?.map((project) => (
                  <div key={project.id} className="p-4 bg-card rounded-lg">
                    <h3 className="font-semibold">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                    <div className="flex justify-between mt-2">
                      <span className="text-sm">Due: {new Date(project.due_date).toLocaleDateString()}</span>
                      <span className="capitalize px-2 py-1 rounded text-xs bg-primary/10">{project.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "contractor":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Contractor Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-card rounded-lg">
                <h3 className="font-semibold">Active Quotes</h3>
                {quotesLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl">{quotes?.filter(q => q.status === 'pending').length || 0}</p>
                )}
              </div>
              <div className="p-4 bg-card rounded-lg">
                <h3 className="font-semibold">Total Quotes</h3>
                {quotesLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl">{quotes?.length || 0}</p>
                )}
              </div>
            </div>
            {quotesLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                {quotes?.map((quote) => (
                  <div key={quote.id} className="p-4 bg-card rounded-lg">
                    <h3 className="font-semibold">{quote.project.name}</h3>
                    <p className="text-sm text-muted-foreground">{quote.project.description}</p>
                    <div className="flex justify-between mt-2">
                      <span className="text-sm">Amount: ${quote.amount}</span>
                      <span className="capitalize px-2 py-1 rounded text-xs bg-primary/10">{quote.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-destructive">Invalid Role</h2>
            <p className="text-muted">Please contact an administrator.</p>
          </div>
        );
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
      {renderDashboardContent()}
    </div>
  );
};

export default Dashboard;