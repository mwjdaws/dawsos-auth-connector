
// Import from hooks instead of importing directly from primitive
// This maintains backward compatibility
import { useToast, toast, clearToasts, ToastProps } from "@/hooks/use-toast";

// Re-export for backward compatibility
export { useToast, toast, clearToasts, ToastProps };
