
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const HomePage = () => {
  const { user } = useAuth();

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
          {user ? (
            <div className="space-y-4">
              <p className="text-center text-muted-foreground">
                Welcome back, {user.email}
              </p>
              <Button as={Link} to="/dashboard">
                Go to Dashboard
              </Button>
            </div>
          ) : (
            <>
              <Link to="/auth">
                <Button className="w-full">Get Started</Button>
              </Link>
              <Button variant="outline" className="w-full">Learn More</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
