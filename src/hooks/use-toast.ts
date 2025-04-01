
import { toast as toastPrimitive, useToast as useToastPrimitive } from "@/components/ui/use-toast-primitive";
import { ToastProps } from "@/components/ui/toast";

// Re-export the hook to be used within React components
export const useToast = useToastPrimitive;

// Create a function that can safely be imported anywhere without actually
// calling hooks until the returned function is called within a component
export const toast = (props: ToastProps) => {
  // We're just returning the toast function to be called later
  // This avoids calling hooks outside of components
  return toastPrimitive(props);
};

// Function to clear all toasts - this will need to be called from within a component
export const clearToasts = () => {
  const { dismiss } = useToastPrimitive();
  dismiss(); // Dismiss all toasts
};

// Maximum number of visible toasts
export const MAX_TOASTS = 3;

// Toast timeout in milliseconds (5 seconds)
export const TOAST_TIMEOUT = 5000;
