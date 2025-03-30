
import { useAuth as useAuthFromContext } from "@/context/AuthContext";
import { useTransition } from "react";

/**
 * Extended auth hook that provides transition capabilities
 * for async operations that might update the UI
 */
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
