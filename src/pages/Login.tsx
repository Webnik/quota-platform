import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          toast.error("Error checking authentication status");
          console.error("Auth error:", error);
          return;
        }
        if (session) {
          navigate("/dashboard");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        toast.success("Successfully logged in");
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Login form */}
      <div className="w-full md:w-1/2 bg-background flex flex-col justify-center items-center p-4 md:p-8">
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
      </div>
      
      {/* Right side - Image */}
      <div 
        className="hidden md:block md:w-1/2 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/lovable-uploads/11e9ef38-ad3f-439c-a205-3ddf1ee96f5e.png')",
          backgroundSize: 'cover'
        }}
      />
    </div>
  );
};

export default Login;