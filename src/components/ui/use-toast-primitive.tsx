
import * as React from "react";
import {
  ToastActionElement,
  ToastProps as ToastPrimitiveProps
} from "@/components/ui/toast";

export type ToastProps = {
  title?: string;
  description?: string;
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
  toast: (props: ToastProps) => void;
  dismiss: (toastId?: string) => void;
};

const ToastContext = React.createContext<ToastContextType | null>(null);

// Generate a unique ID for each toast
const generateId = () => Math.random().toString(36).substring(2, 9);

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

      setToasts((toasts) => [
        ...toasts,
        { ...props, id, dismiss },
      ].slice(-TOAST_LIMIT));

      return id;
    },
    [setToasts]
  );

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

// Hook to use toast functionality
export const useToast = () => {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
};
