import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-xl text-muted-foreground mt-2 mb-8">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Button onClick={() => navigate(-1)} variant="outline">
        Go Back
      </Button>
    </div>
  );
}