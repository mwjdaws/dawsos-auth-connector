
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast as useToastImpl } from "@/components/ui/use-toast-primitive";

export const toast = useToastImpl().toast;
export const useToast = useToastImpl;
export const clearToasts = () => {
  const { dismiss } = useToastImpl();
  dismiss(); // Dismiss all toasts
};

export function Toaster() {
  const { toasts } = useToastImpl();

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
