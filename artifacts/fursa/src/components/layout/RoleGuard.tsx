import { useEffect, ReactNode } from "react";
import { useLocation } from "wouter";
import { useGetCurrentUser } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

interface RoleGuardProps {
  role: "seeker" | "employer" | "admin";
  children: ReactNode;
}

export function RoleGuard({ role, children }: RoleGuardProps) {
  const [, setLocation] = useLocation();
  const { data: user, isLoading, error } = useGetCurrentUser();

  useEffect(() => {
    if (!isLoading && !error) {
      if (!user) {
        setLocation("/sign-in");
        return;
      }
      
      if (!user.onboarded && user.role !== "admin") {
        setLocation("/onboarding");
        return;
      }

      if (user.role !== role) {
        setLocation(`/${user.role}`);
      }
    }
  }, [user, isLoading, error, role, setLocation]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    );
  }

  if (error || !user || user.role !== role || (!user.onboarded && user.role !== "admin")) {
    return null;
  }

  return <>{children}</>;
}