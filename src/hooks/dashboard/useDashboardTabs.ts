
import { useCallback } from "react";

interface UseDashboardTabsProps {
  onTabChange: (value: string) => void;
  startTransition: (callback: () => void) => void;
}

export function useDashboardTabs({ onTabChange, startTransition }: UseDashboardTabsProps) {
  const handleTabChange = useCallback((value: string) => {
    startTransition(() => {
      onTabChange(value);
    });
  }, [onTabChange, startTransition]);

  return {
    handleTabChange
  };
}
