import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const ProfileNotFound = () => {
  return (
    <div className="container py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600">Profile Not Found</h1>
        <p className="mt-2 text-gray-600">Please complete your profile setup.</p>
        <Link to="/complete-profile">
          <Button className="mt-4">Complete Profile</Button>
        </Link>
      </div>
    </div>
  );
};