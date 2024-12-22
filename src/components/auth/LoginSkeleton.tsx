import { Skeleton } from "@/components/ui/skeleton";

const LoginSkeleton = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <Skeleton className="h-8 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-1/2 mx-auto" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    </div>
  );
};

export default LoginSkeleton;