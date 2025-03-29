
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useState, useTransition, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const IndexPage = () => {
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();
  
  // Handler to wrap navigation in startTransition
  const handleNavigation = (path: string) => {
    startTransition(() => {
      // React Router will handle the actual navigation
      // This wraps the state updates in startTransition
      console.log(`Navigating to ${path}...`);
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            DawsOS
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            AI-augmented knowledge management system
          </p>
        </div>
        <div className="flex flex-col space-y-4">
          <Suspense fallback={<Skeleton className="h-10 w-full" />}>
            {isPending ? (
              <Skeleton className="h-10 w-full" />
            ) : user ? (
              <div className="space-y-4">
                <p className="text-center text-muted-foreground">
                  Welcome back, {user.email}
                </p>
                <Button asChild onClick={() => handleNavigation("/dashboard")}>
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              </div>
            ) : (
              <>
                <Button asChild onClick={() => handleNavigation("/auth")}>
                  <Link to="/auth" className="w-full">Get Started</Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleNavigation("/about")}
                >
                  Learn More
                </Button>
              </>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
