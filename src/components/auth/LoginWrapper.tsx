import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import ProfileForm from "./ProfileForm";
import LoginForm from "./LoginForm";
import LoginLoader from "./LoginLoader";

const LoginWrapper = ({ children }: { children: React.ReactNode }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showMFA, setShowMFA] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, company_name, role')
            .eq('id', user.id)
            .single();

          if (profileError) throw profileError;

          if (profile && (!profile.full_name || !profile.company_name || !profile.role)) {
            setShowProfile(true);
          }
        }
      } catch (error) {
        console.error('Profile check error:', error);
        toast.error("Error checking profile", {
          description: "Please try again later"
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkProfile();
  }, []);

  if (isLoading) {
    return <LoginLoader />;
  }

  if (showProfile) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <ProfileForm />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md space-y-8"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginWrapper;