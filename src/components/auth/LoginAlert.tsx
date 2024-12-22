import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface LoginAlertProps {
  error?: string | null;
}

const LoginAlert = ({ error }: LoginAlertProps) => {
  return (
    <>
      <Alert variant="default" className="border-accent/20 bg-accent/5">
        <AlertCircle className="h-4 w-4 text-accent" />
        <AlertDescription className="text-foreground/80">
          Sign in to manage your construction projects and quotes efficiently.
        </AlertDescription>
      </Alert>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default LoginAlert;