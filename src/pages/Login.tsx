import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import LoginForm from "@/components/auth/LoginForm";
import LoginSkeleton from "@/components/auth/LoginSkeleton";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          toast.error("Authentication Error", {
            description: "There was a problem checking your login status"
          });
          console.error("Auth error:", error);
          return;
        }
        if (session) {
          // Get user profile to determine role
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            toast.error("Profile Error", {
              description: "Could not fetch user profile"
            });
            console.error("Profile error:", profileError);
            return;
          }

          toast.success("Login Successful", {
            description: `Welcome back to Quota!`
          });
          navigate("/dashboard");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        // Get user profile to determine role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) {
          toast.error("Profile Error", {
            description: "Could not fetch user profile"
          });
          console.error("Profile error:", profileError);
          return;
        }

        toast.success("Login Successful", {
          description: "Welcome back to Quota!"
        });
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return <LoginSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Login form */}
      <div className="w-full md:w-1/2 bg-background flex flex-col justify-center items-center p-8 md:p-12 lg:p-16">
        <LoginForm />
      </div>
      
      {/* Right side - Image */}
      <div 
        className="hidden md:block md:w-1/2 bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d')",
          backgroundSize: 'cover'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-background/40 backdrop-blur-sm" />
      </div>
    </div>
  );
};

export default Login;