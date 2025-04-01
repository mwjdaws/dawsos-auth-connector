
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { 
  useToast as useToastPrimitive,
  ToastProps 
} from "@/components/ui/use-toast-primitive";

export const toast = useToastPrimitive().toast;
export const useToast = useToastPrimitive;
export const clearToasts = () => {
  const { dismiss } = useToastPrimitive();
  dismiss(); // Dismiss all toasts
};

export function Toaster() {
  const { toasts } = useToastPrimitive();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
