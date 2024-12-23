import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";
import { toast } from "sonner";

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setError(sessionError);
          setIsLoading(false);
          return;
        }

        if (!session) {
          setIsLoading(false);
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Profile error:', profileError);
          setError(profileError);
          setIsLoading(false);
          return;
        }

        if (!profileData) {
          console.log('No profile found for user:', session.user.id);
          setError(new Error('Profile not found'));
          setIsLoading(false);
          return;
        }

        setProfile(profileData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error in profile fetch:', error);
        setError(error as Error);
        setIsLoading(false);
      }
    };

    fetchProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchProfile();
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { profile, isLoading, error };
};