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
    return <LoginSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Login form */}
      <div className="w-full md:w-1/2 bg-background flex flex-col justify-center items-center p-4 md:p-8 lg:p-12">
        <LoginForm />
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