import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ProfileHeader from "./ProfileHeader";
import ProfileAlert from "./ProfileAlert";
import ProfileFormFields from "./ProfileFormFields";

const ProfileForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState<string>("");
  const [currentProfile, setCurrentProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setCurrentProfile(profile);
          setFullName(profile.full_name || "");
          setCompanyName(profile.company_name || "");
          setRole(profile.role || "");
        }
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Authentication Error", {
          description: "Please sign in to update your profile"
        });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          company_name: companyName,
          role: role || currentProfile?.role || 'contractor',
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success("Profile Updated", {
        description: "Your profile has been successfully updated"
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Update Failed", {
        description: "There was a problem updating your profile"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <ProfileHeader />
      <ProfileAlert />

      <form onSubmit={handleSubmit} className="space-y-6">
        <ProfileFormFields
          fullName={fullName}
          setFullName={setFullName}
          companyName={companyName}
          setCompanyName={setCompanyName}
          role={role}
          setRole={setRole}
          currentProfile={currentProfile}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </div>
  );
};

export default ProfileForm;