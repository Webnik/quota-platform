import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";
import { useNavigate } from "react-router-dom";

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
          setIsLoading(false);
          return;
        }

        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  return { profile, isLoading };
};