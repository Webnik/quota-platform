import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import ProfileForm from "./ProfileForm";

const LoginForm = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, company_name')
            .eq('id', user.id)
            .single();

          if (profile && (!profile.full_name || !profile.company_name)) {
            setShowProfile(true);
          }
        }
      } catch (error) {
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
    return (
      <div className="w-full max-w-md space-y-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (showProfile) {
    return <ProfileForm />;
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
          Welcome to Quota
        </h1>
        <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">
          BY CANOPY
        </p>
      </div>

      <Alert variant="default" className="border-accent/20 bg-accent/5">
        <AlertCircle className="h-4 w-4 text-accent" />
        <AlertDescription className="text-foreground/80">
          Sign in to manage your construction projects and quotes efficiently.
        </AlertDescription>
      </Alert>

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
            button: 'bg-primary hover:bg-primary/90 text-primary-foreground',
            input: 'bg-background/50 border-accent/20 text-foreground focus:border-accent',
            label: 'text-foreground/80',
            message: 'text-muted-foreground text-sm',
            anchor: 'text-primary hover:text-primary/80',
            divider: 'bg-accent/20',
          },
        }}
        theme="dark"
        providers={[]}
        view="sign_in"
        showLinks={true}
        redirectTo={`${window.location.origin}/dashboard`}
      />
    </div>
  );
};

export default LoginForm;