import { useToast as useToastShadcn } from "@/components/ui/use-toast";
import { toast as toastShadcn } from "@/components/ui/use-toast";
import { ToastActionElement } from "@/components/ui/toast";

export type ToastProps = {
  title?: string;
  description?: string;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
  id?: string;
};

export const useToast = useToastShadcn;
export const toast = toastShadcn;

export const clearToasts = () => {
  // Implementation will be provided by shadcn/ui
  console.log("Clearing all toasts");
};
