
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import Navigation from "@/components/Navigation";
import { AppRoutes } from "@/routes";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <AppRoutes />
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
