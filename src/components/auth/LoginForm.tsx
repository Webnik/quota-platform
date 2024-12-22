import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const LoginForm = () => {
  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome to Quota</h1>
        <p className="text-muted-foreground text-sm uppercase tracking-wider">BY CANOPY</p>
      </div>

      <Alert variant="default" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
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
                brand: '#9b87f5',
                brandAccent: '#7E69AB',
                inputBackground: 'transparent',
                inputText: 'inherit',
              },
            },
          },
          className: {
            container: 'w-full',
            button: 'bg-primary hover:bg-primary/90 text-primary-foreground',
            input: 'bg-background/50 border-input text-foreground',
            label: 'text-foreground',
            message: 'text-muted-foreground text-sm',
          },
        }}
        theme="dark"
        providers={[]}
      />
    </div>
  );
};

export default LoginForm;