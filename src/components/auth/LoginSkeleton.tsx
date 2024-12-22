import { Skeleton } from "@/components/ui/skeleton";

const LoginSkeleton = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-4 text-center">
          <Skeleton className="h-10 w-3/4 mx-auto bg-accent/10" />
          <Skeleton className="h-4 w-1/3 mx-auto bg-accent/10" />
        </div>
        <Skeleton className="h-16 w-full bg-accent/10" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full bg-accent/10" />
          <Skeleton className="h-12 w-full bg-accent/10" />
          <Skeleton className="h-12 w-full bg-accent/10" />
        </div>
      </div>
    </div>
  );
};

export default LoginSkeleton;