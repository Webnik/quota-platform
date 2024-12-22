import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;

      toast.success("Check your email for the password reset link", {
        description: "If you don't see it, check your spam folder"
      });
      
      // Navigate back to login after 3 seconds
      setTimeout(() => navigate("/login"), 3000);
    } catch (error: any) {
      toast.error("Error resetting password", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 w-full max-w-md">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset your password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </div>

      <form onSubmit={handleReset} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Sending reset link..." : "Send reset link"}
        </Button>
      </form>

      <div className="text-center">
        <Button
          variant="link"
          onClick={() => navigate("/login")}
          className="text-sm text-muted-foreground"
        >
          Back to login
        </Button>
      </div>
    </div>
  );
};