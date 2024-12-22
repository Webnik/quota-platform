import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        toast.error("Error checking authentication status");
        console.error("Auth error:", error);
        return;
      }
      if (session) {
        navigate("/dashboard");
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        toast.success("Successfully logged in");
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 bg-background flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Welcome to Quota</h1>
            <p className="text-muted text-sm uppercase tracking-wider">BY CANOPY</p>
          </div>
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
                    inputText: 'white',
                  },
                },
              },
              className: {
                container: 'w-full',
                button: 'bg-primary hover:bg-primary/90 text-white',
                input: 'bg-background/50 border-gray-700 text-foreground',
                label: 'text-foreground',
              },
            }}
            theme="dark"
            providers={[]}
          />
        </div>
      </div>
      <div 
        className="hidden md:block md:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: "url('/lovable-uploads/11e9ef38-ad3f-439c-a205-3ddf1ee96f5e.png')"
        }}
      />
    </div>
  );
};

export default Login;