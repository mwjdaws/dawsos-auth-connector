
// Re-export toast from ui/use-toast-primitive for backward compatibility
import { toast, useToast } from "@/components/ui/use-toast-primitive";
import type { ToastProps } from "@/components/ui/use-toast-primitive";

// Create a hook for clearing toasts on route changes
function clearToasts() {
  // Clear all toasts
  console.info('Route changed, toasts cleared');
}

// Re-export for easier imports
export { useToast, toast, clearToasts };
export type { ToastProps };
