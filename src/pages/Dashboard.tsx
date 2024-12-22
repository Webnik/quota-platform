import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Profile {
  id: string;
  role: string;
  full_name: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

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
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  const renderDashboardContent = () => {
    switch (profile?.role) {
      case "consultant":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Consultant Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-card rounded-lg">
                <h3 className="font-semibold">Active Projects</h3>
                <p className="text-2xl">0</p>
              </div>
              <div className="p-4 bg-card rounded-lg">
                <h3 className="font-semibold">Pending Quotes</h3>
                <p className="text-2xl">0</p>
              </div>
              <div className="p-4 bg-card rounded-lg">
                <h3 className="font-semibold">Completed Projects</h3>
                <p className="text-2xl">0</p>
              </div>
              <div className="p-4 bg-card rounded-lg">
                <h3 className="font-semibold">Total Value</h3>
                <p className="text-2xl">$0</p>
              </div>
            </div>
          </div>
        );
      case "contractor":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Contractor Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-card rounded-lg">
                <h3 className="font-semibold">Active Quotes</h3>
                <p className="text-2xl">0</p>
              </div>
              <div className="p-4 bg-card rounded-lg">
                <h3 className="font-semibold">Won Projects</h3>
                <p className="text-2xl">0</p>
              </div>
              <div className="p-4 bg-card rounded-lg">
                <h3 className="font-semibold">Total Revenue</h3>
                <p className="text-2xl">$0</p>
              </div>
            </div>
          </div>
        );
      case "project_manager":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Project Manager Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-card rounded-lg">
                <h3 className="font-semibold">Managed Projects</h3>
                <p className="text-2xl">0</p>
              </div>
              <div className="p-4 bg-card rounded-lg">
                <h3 className="font-semibold">Active Contractors</h3>
                <p className="text-2xl">0</p>
              </div>
              <div className="p-4 bg-card rounded-lg">
                <h3 className="font-semibold">Project Value</h3>
                <p className="text-2xl">$0</p>
              </div>
            </div>
          </div>
        );
      case "super_admin":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Admin Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-card rounded-lg">
                <h3 className="font-semibold">Total Users</h3>
                <p className="text-2xl">0</p>
              </div>
              <div className="p-4 bg-card rounded-lg">
                <h3 className="font-semibold">Active Projects</h3>
                <p className="text-2xl">0</p>
              </div>
              <div className="p-4 bg-card rounded-lg">
                <h3 className="font-semibold">Total Contractors</h3>
                <p className="text-2xl">0</p>
              </div>
              <div className="p-4 bg-card rounded-lg">
                <h3 className="font-semibold">System Health</h3>
                <p className="text-2xl">100%</p>
              </div>
            </div>
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