
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Navigation = () => {
  const { user, signOut, isLoading } = useAuth();

  return (
    <nav className="bg-background shadow-sm border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          DawsOS
        </Link>
        
        <div className="flex items-center space-x-4">
          {!isLoading && (
            user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
                <Button variant="outline" onClick={signOut} size="sm">
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button size="sm">Sign In</Button>
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
