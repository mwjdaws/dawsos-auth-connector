
// Adapted from: https://ui.shadcn.com/docs/components/toast
import { 
  Toast,
  ToastActionElement,
  compatibleToast
} from "@/utils/compatibility";

import {
  createContext,
  useContext,
  useState,
  useCallback
} from "react";

type ToasterToast = Toast & {
  id: string;
  title?: string;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

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
        ],
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

type ToastDispatch = (action: ToastActionType) => void;

const ToastContext = createContext<ToastState>(initialState);
const ToastDispatchContext = createContext<ToastDispatch>(() => null);

export function useToast() {
  const [state, dispatch] = useState<ToastState>(initialState);

  const dispatchAction = useCallback((action: ToastActionType) => {
    dispatch((prev) => reducer(prev, action));
  }, []);

  const toast = useCallback(
    (props: Omit<ToasterToast, "id"> & { id?: string }) => {
      const id = props.id || generateId();
      
      dispatchAction({
        type: "ADD_TOAST",
        toast: compatibleToast({ ...props, id }),
      });

      return {
        id,
        dismiss: () => dispatchAction({ type: "DISMISS_TOAST", toastId: id }),
      };
    },
    [dispatchAction]
  );

  const update = useCallback(
    (props: Partial<ToasterToast> & { id: string }) => {
      dispatchAction({
        type: "UPDATE_TOAST",
        toast: props,
      });
    },
    [dispatchAction]
  );

  const dismiss = useCallback(
    (toastId?: string) => {
      dispatchAction({ type: "DISMISS_TOAST", toastId });
    },
    [dispatchAction]
  );

  const remove = useCallback(
    (toastId?: string) => {
      dispatchAction({ type: "REMOVE_TOAST", toastId });
    },
    [dispatchAction]
  );

  return {
    toasts: state.toasts,
    toast,
    update,
    dismiss,
    remove,
  };
}
