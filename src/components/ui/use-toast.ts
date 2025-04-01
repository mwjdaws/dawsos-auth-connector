
// Import from hooks instead of importing directly from primitive
// This maintains backward compatibility
import { useToast, toast, clearToasts } from "@/hooks/use-toast";
import type { ToastProps } from "@/hooks/use-toast";

// Re-export for backward compatibility
export { useToast, toast, clearToasts };
export type { ToastProps };
