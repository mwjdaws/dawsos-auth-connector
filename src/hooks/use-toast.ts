import { 
  Toast,
  ToastActionElement, 
  ToastProps
} from "@/components/ui/toast"

import {
  useToast as useToastInternal,
} from "@/components/ui/use-toast"

import { useEffect, useRef } from "react";

const TOAST_LIMIT = 3;
export const TOAST_REMOVE_DELAY = 1000000;

export type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: string;
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: string;
    };

interface State {
  toasts: ToasterToast[];
}

const toastState: State = {
  toasts: [],
};

function addToRemoveQueue(toastId: string) {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
}

function clearFromRemoveQueue(toastId: string) {
  const timeout = toastTimeouts.get(toastId);
  if (timeout) {
    clearTimeout(timeout);
    toastTimeouts.delete(toastId);
  }
}

// Event handler to clear all toasts when navigating between pages
export function clearToasts() {
  if (toastState.toasts.length > 0) {
    toastState.toasts.forEach((toast) => {
      dispatch({
        type: "DISMISS_TOAST",
        toastId: toast.id,
      });
    });
  }
}

/**
 * Check if a toast with the same fingerprint already exists
 */
function hasExistingToast(fingerprint: string | undefined): string | undefined {
  if (!fingerprint) return undefined;
  
  const existingToast = toastState.toasts.find(toast => 
    toast.id === fingerprint || toast.id === `toast-${fingerprint}`
  );
  
  return existingToast?.id;
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
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

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
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

const dispatch = (action: Action) => {
  toastState.toasts = reducer(toastState, action).toasts;
  listeners.forEach((listener) => {
    listener(toastState);
  });
};

const listeners: Array<(state: State) => void> = [];

export function toast(props: Omit<ToasterToast, "id"> & { id?: string, fingerprint?: string }) {
  const id = props.id || props.fingerprint || genId();
  const existingToastId = hasExistingToast(props.fingerprint);
  
  // Update existing toast with same fingerprint if it exists
  if (existingToastId) {
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id: existingToastId, open: true }
    });
    
    clearFromRemoveQueue(existingToastId);
    return { id: existingToastId, dismiss: () => dismiss(existingToastId) };
  }
  
  // Otherwise create new toast
  const formattedId = props.fingerprint ? `toast-${props.fingerprint}` : id;
  
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id: formattedId,
      open: true,
      onOpenChange: (open) => {
        if (!open) {
          dismiss(formattedId);
        }
      },
    },
  });

  return {
    id: formattedId,
    dismiss: () => dismiss(formattedId)
  };
}

export function dismiss(toastId?: string) {
  dispatch({
    type: "DISMISS_TOAST",
    toastId,
  });
}

export function useToast() {
  const { toast: hookToast } = useToastInternal();
  
  // Subscribe to toast changes
  useEffect(() => {
    const unsubscribe = subscribeToast(() => {
      // Just trigger re-render
    });
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  // Clear toasts when component unmounts to prevent memory leaks
  const toastIds = useRef<string[]>([]);
  useEffect(() => {
    return () => {
      toastIds.current.forEach(id => {
        clearFromRemoveQueue(id);
      });
    };
  }, []);
  
  const enhancedToast = (props: Toast) => {
    const { id, dismiss } = toast(props);
    toastIds.current.push(id);
    return { id, dismiss };
  };
  
  return {
    toast: enhancedToast,
    dismiss,
  };
}

export function subscribeToast(callback: (state: State) => void) {
  listeners.push(callback);
  callback(toastState);
  
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
}
