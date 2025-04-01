
import { ToastActionElement } from "@/components/ui/toast";
import {
  useToast as useToastPrimitive,
  ToastProps as ToastPrimitiveProps
} from "@/components/ui/use-toast-primitive";

export type ToastProps = {
  title?: string;
  description?: string | null;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
  id?: string;
};

// Re-export the useToast hook from the primitive
export const useToast = useToastPrimitive;

// Export the toast function
export const toast = useToastPrimitive().toast;

// Function to clear all toasts
export const clearToasts = () => {
  const { dismiss } = useToastPrimitive();
  dismiss(); // Dismiss all toasts
};

// Maximum number of visible toasts
export const MAX_TOASTS = 3;

// Toast timeout in milliseconds (5 seconds)
export const TOAST_TIMEOUT = 5000;

// Clear toasts on route change
export const clearToastsOnRouteChange = () => {
  clearToasts();
};

// Function to deduplicate toasts
export const deduplicateToast = (id: string, props: ToastProps) => {
  const { dismiss, toasts } = useToastPrimitive();
  
  // Check if a toast with this ID already exists
  const existingToast = toasts.find(t => t.id === id);
  
  if (existingToast) {
    // Dismiss the existing toast
    dismiss(id);
  }
  
  // Return the new toast with the given ID
  return toast({
    ...props,
    id
  });
};

// Error toast helper
export const errorToast = (title: string, description?: string | null, id?: string) => {
  const toastId = id || `error-${Date.now()}`;
  return toast({
    title,
    description: description || null,
    variant: "destructive",
    id: toastId
  });
};

// Success toast helper
export const successToast = (title: string, description?: string | null, id?: string) => {
  const toastId = id || `success-${Date.now()}`;
  return toast({
    title,
    description: description || null,
    id: toastId
  });
};
