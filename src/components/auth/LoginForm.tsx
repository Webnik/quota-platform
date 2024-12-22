import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import LoginHeader from "./LoginHeader";
import LoginAlert from "./LoginAlert";

const LoginForm = () => {
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        toast.success("Successfully logged in", {
          description: "Welcome back!"
        });
        navigate("/dashboard");
      }
    });

    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="w-full max-w-md space-y-8">
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
    </div>
  );
};

export default LoginForm;