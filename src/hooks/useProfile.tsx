import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // First check if we have an authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          throw authError;
        }

        if (!user) {
          setIsLoading(false);
          navigate('/login');
          return;
        }

        // Then fetch the profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        
        if (profileError) {
          console.error('Profile error:', profileError);
          toast({
            title: "Error fetching profile",
            description: "Please try refreshing the page",
            variant: "destructive",
          });
          throw profileError;
        }

        if (!profileData) {
          console.warn('No profile found for user:', user.id);
          toast({
            title: "Profile not found",
            description: "Please complete your profile setup",
            variant: "destructive",
          });
          // You might want to redirect to a profile setup page here
          // navigate('/setup-profile');
          return;
        }

        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError(error as Error);
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, toast]);

  return { profile, isLoading, error };
};