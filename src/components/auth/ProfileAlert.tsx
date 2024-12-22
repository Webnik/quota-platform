import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const ProfileAlert = () => {
  return (
    <Alert variant="default" className="border-accent/20 bg-accent/5">
      <AlertCircle className="h-4 w-4 text-accent" />
      <AlertDescription className="text-foreground/80">
        Please provide your details to complete your profile setup.
      </AlertDescription>
    </Alert>
  );
};

export default ProfileAlert;