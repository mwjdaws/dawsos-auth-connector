
// Adapted from: https://ui.shadcn.com/docs/components/toast
import * as React from "react";
import {
  type ToastActionElement,
  type ToastProps,
} from "@/components/ui/toast";

const TOAST_LIMIT = 3;
export type ToastType = ToastProps & {
  id: string;
  title?: string;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

type ToasterToast = ToastType;

type ToastActionType = 
  | { type: "ADD_TOAST"; toast: Omit<ToasterToast, "id"> & { id?: string } }
  | { type: "UPDATE_TOAST"; toast: Partial<ToasterToast> & { id: string } }
  | { type: "DISMISS_TOAST"; toastId?: string }
  | { type: "REMOVE_TOAST"; toastId?: string };

interface ToastState {
  toasts: ToasterToast[];
}

const initialState: ToastState = {
  toasts: [],
};

let count = 0;

function generateId() {
  return `toast-${++count}`;
}

const reducer = (state: ToastState, action: ToastActionType): ToastState => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [
          ...state.toasts,
          { ...action.toast, id: action.toast.id || generateId() },
        ].slice(-TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // Dismiss all toasts if no toastId is provided
      if (toastId === undefined) {
        return {
          ...state,
          toasts: state.toasts.map((t) => ({
            ...t,
            dismissed: true,
          })),
        };
      }

      // Dismiss specific toast with toastId
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId ? { ...t, dismissed: true } : t
        ),
      };
    }

    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const ToastContext = React.createContext<{
  toasts: ToasterToast[];
  toast: (props: Omit<ToasterToast, "id"> & { id?: string }) => { id: string; dismiss: () => void };
  update: (props: Partial<ToasterToast> & { id: string }) => void;
  dismiss: (toastId?: string) => void;
  remove: (toastId?: string) => void;
}>({
  toasts: [],
  toast: () => ({ id: "", dismiss: () => {} }),
  update: () => {},
  dismiss: () => {},
  remove: () => {},
});

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const toast = React.useCallback(
    (props: Omit<ToasterToast, "id"> & { id?: string }) => {
      const id = props.id || generateId();
      
      dispatch({
        type: "ADD_TOAST",
        toast: { ...props, id },
      });

      return {
        id,
        dismiss: () => dispatch({ type: "DISMISS_TOAST", toastId: id }),
      };
    },
    []
  );

  const update = React.useCallback(
    (props: Partial<ToasterToast> & { id: string }) => {
      dispatch({
        type: "UPDATE_TOAST",
        toast: props,
      });
    },
    []
  );

  const dismiss = React.useCallback(
    (toastId?: string) => {
      dispatch({ type: "DISMISS_TOAST", toastId });
    },
    []
  );

  const remove = React.useCallback(
    (toastId?: string) => {
      dispatch({ type: "REMOVE_TOAST", toastId });
    },
    []
  );

  return (
    <ToastContext.Provider
      value={{
        toasts: state.toasts,
        toast,
        update,
        dismiss,
        remove,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  
  return context;
};

// Create a compatible toast function that can be imported directly
export const toast = (props: Omit<ToasterToast, "id"> & { id?: string }) => {
  const { toast: contextToast } = useToast();
  return contextToast(props);
};

// Add a utility function to clear all toasts
export const clearToasts = () => {
  const { remove } = useToast();
  remove();
};

// Helper function to ensure compatibility
export const compatibleToast = (props: any) => {
  // Make sure variant is one of the allowed values
  if (props.variant && !["default", "destructive"].includes(props.variant)) {
    props.variant = "default";
  }
  return props;
};
