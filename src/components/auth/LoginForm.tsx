import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import ProfileForm from "./ProfileForm";
import LoginLoader from "./LoginLoader";
import LoginHeader from "./LoginHeader";
import LoginAlert from "./LoginAlert";

const LoginForm = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        toast.success("Successfully logged in", {
          description: "Welcome back!"
        });
      }
    });

    return () => subscription.unsubscribe();
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
        <LoginHeader />
        <LoginAlert error={authError} />

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#8E9196',
                  brandAccent: '#403E43',
                  inputBackground: 'transparent',
                  inputText: 'inherit',
                },
              },
            },
            className: {
              container: 'w-full',
              button: 'bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200',
              input: 'bg-background/50 border-accent/20 text-foreground focus:border-accent transition-colors duration-200',
              label: 'text-foreground/80',
              message: 'text-muted-foreground text-sm',
              anchor: 'text-primary hover:text-primary/80 transition-colors duration-200',
              divider: 'bg-accent/20',
            },
          }}
          theme="dark"
          providers={[]}
          view="sign_in"
          showLinks={true}
          redirectTo={`${window.location.origin}/dashboard`}
          localization={{
            variables: {
              sign_in: {
                email_input_placeholder: "Your email address",
                password_input_placeholder: "Your password",
                email_label: "Email",
                password_label: "Password",
                button_label: "Sign in",
                loading_button_label: "Signing in ...",
                social_provider_text: "Sign in with {{provider}}",
                link_text: "Already have an account? Sign in",
              },
              forgotten_password: {
                email_input_placeholder: "Your email address",
                email_label: "Email",
                button_label: "Send reset instructions",
                loading_button_label: "Sending reset instructions...",
                link_text: "Forgot your password?",
                confirmation_text: "Check your email for the password reset link",
              },
            },
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginForm;
