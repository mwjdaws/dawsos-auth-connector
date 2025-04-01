
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useEffect } from "react"

export function Toaster() {
  const { toasts } = useToast()
  
  // Set a maximum number of toasts to display at once
  const MAX_VISIBLE_TOASTS = 3;
  
  // Ensure we don't have memory leaks with toast timeouts
  useEffect(() => {
    return () => {
      // Clear any lingering toast timeouts to prevent memory leaks
      document.querySelectorAll('[toast-close]').forEach((el) => {
        el.dispatchEvent(new MouseEvent('click'));
      });
    };
  }, []);

  return (
    <ToastProvider>
      {toasts.slice(0, MAX_VISIBLE_TOASTS).map(function ({ id, title, description, action, ...props }) {
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
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
