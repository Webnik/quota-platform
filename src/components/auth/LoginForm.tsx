import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const LoginForm = () => {
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