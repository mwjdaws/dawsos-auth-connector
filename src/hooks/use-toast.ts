
// This file provides toast utilities that are safe to import anywhere in the app
import { 
  toast as toastPrimitive,
  useToast as useToastPrimitive,
  clearToasts as clearToastsPrimitive,
  ToastProps 
} from "@/components/ui/use-toast-primitive";

/**
 * Safe toast function that can be imported and used anywhere
 * This is a pass-through function that doesn't use hooks directly
 */
export const toast = (props: ToastProps) => {
  return toastPrimitive(props);
};

/**
 * Re-export the hook for use inside components only
 */
export const useToast = useToastPrimitive;

/**
 * Re-export clearToasts function
 */
export const clearToasts = clearToastsPrimitive;

// Constants
export const MAX_TOASTS = 3;
export const TOAST_TIMEOUT = 5000;

// Re-export the types
export type { ToastProps };
