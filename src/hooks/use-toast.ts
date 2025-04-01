
// This file provides toast utilities that are safe to import anywhere in the app
import { toast as toastPrimitive } from "@/components/ui/use-toast-primitive";
import type { ToastProps } from "@/components/ui/toast";

/**
 * Safe toast function that can be imported and used anywhere
 * This is just a pass-through function - hooks are only called when used in a component
 */
export const toast = (props: ToastProps) => {
  return toastPrimitive(props);
};

// Re-export from the primitive for use in components
export { useToast, type ToastProps } from "@/components/ui/use-toast-primitive";
export { clearToasts } from "@/components/ui/use-toast-primitive";

// Constants
export const MAX_TOASTS = 3;
export const TOAST_TIMEOUT = 5000;
