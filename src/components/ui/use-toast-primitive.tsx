
import * as React from "react";
import {
  ToastActionElement,
  ToastProps as ToastPrimitiveProps
} from "@/components/ui/toast";

export type ToastProps = {
  title?: string;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
  id?: string;
};

const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY = 1000;

type ToasterToast = ToastProps & {
  id: string;
  dismiss: () => void;
};

// Create a context to manage toasts
type ToastContextType = {
  toasts: ToasterToast[];
  toast: (props: ToastProps) => string;
  dismiss: (toastId?: string) => void;
};

const ToastContext = React.createContext<ToastContextType | null>(null);

// Generate a unique ID for each toast
const generateId = () => Math.random().toString(36).substring(2, 9);

// Global reference to the toast function that gets set when the provider mounts
let toastFn: ((props: ToastProps) => string) | null = null;

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = React.useState<ToasterToast[]>([]);

  const toast = React.useCallback(
    ({ ...props }: ToastProps) => {
      const id = props.id || generateId();

      const dismiss = () => {
        setToasts((toasts) =>
          toasts.filter((toast) => toast.id !== id)
        );
      };
      
      // Ensure description is a string or null (not undefined)
      const finalProps = {
        ...props,
        description: props.description ?? null
      };

      setToasts((prevToasts) => [
        ...prevToasts,
        { ...finalProps, id, dismiss },
      ].slice(-TOAST_LIMIT));

      return id;
    },
    [setToasts]
  );

  // Set the global toast function reference
  React.useEffect(() => {
    toastFn = toast;
    return () => {
      toastFn = null;
    };
  }, [toast]);

  const dismiss = React.useCallback((toastId?: string) => {
    setToasts((toasts) =>
      toastId
        ? toasts.filter((toast) => toast.id !== toastId)
        : []
    );
  }, []);

  // Remove toast after it's been shown
  React.useEffect(() => {
    const timeoutIds = new Map<string, NodeJS.Timeout>();

    toasts.forEach((toast) => {
      if (!timeoutIds.has(toast.id)) {
        const timeoutId = setTimeout(() => {
          dismiss(toast.id);
          timeoutIds.delete(toast.id);
        }, TOAST_REMOVE_DELAY * 5);

        timeoutIds.set(toast.id, timeoutId);
      }
    });

    return () => {
      timeoutIds.forEach((id) => clearTimeout(id));
    };
  }, [toasts, dismiss]);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
};

// Hook to use toast functionality - must be used within components
export const useToast = () => {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
};

// Function that can be imported anywhere - doesn't use hooks directly
// It will use the global toast reference if available, otherwise it will
// queue the toast to be shown when the toast provider mounts
let queuedToasts: ToastProps[] = [];

export const toast = (props: ToastProps) => {
  if (toastFn) {
    return toastFn(props);
  } else {
    // Queue the toast to be shown when the provider mounts
    queuedToasts.push(props);
    console.warn("Toast was called before ToastProvider was mounted");
    return props.id || generateId();
  }
};

// Process any queued toasts when the provider mounts
export const clearToasts = () => {
  if (toastFn) {
    const { dismiss } = useToast();
    dismiss();
  }
};
