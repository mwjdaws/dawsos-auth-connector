
// This file now simply re-exports the useAuth hook from the AuthContext
import { useAuth as useAuthFromContext } from "@/context/AuthContext";

export function useAuth() {
  return useAuthFromContext();
}
