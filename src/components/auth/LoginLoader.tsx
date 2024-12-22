import { Loader2 } from "lucide-react";

const LoginLoader = () => {
  return (
    <div className="w-full max-w-md space-y-8">
      <div className="flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading your profile...</p>
      </div>
    </div>
  );
};

export default LoginLoader;