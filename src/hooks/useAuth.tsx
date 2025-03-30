
// This file wraps the useAuth hook from the AuthContext with proper transition handling
import { useAuth as useAuthFromContext } from "@/context/AuthContext";
import { useTransition } from "react";

export function useAuth() {
  const [isPending, startTransition] = useTransition();
  
  // Make sure we're using the context properly
  const authContext = useAuthFromContext();

  // Return the original context plus isPending for loading states
  return {
    ...authContext,
    isPending,
    startTransition
  };
}
