
import { RefreshCw } from "lucide-react";

interface RefreshIconProps {
  isRefreshing?: boolean;
  size?: number;
}

export function RefreshIcon({ isRefreshing = false, size = 16 }: RefreshIconProps) {
  return (
    <RefreshCw 
      className={`h-${size} w-${size} ${isRefreshing ? 'animate-spin' : ''}`} 
    />
  );
}
