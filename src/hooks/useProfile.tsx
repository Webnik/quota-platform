import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw new Error("Failed to get session");
        }

        if (!session?.user) {
          setIsLoading(false);
          navigate('/login');
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (profileError) {
          console.error('Profile error:', profileError);
          toast.error("Error fetching profile");
          throw profileError;
        }

        setProfile(profileData);
      } catch (error) {
        console.error('Error in profile fetch:', error);
        setError(error as Error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  return { profile, isLoading, error };
};