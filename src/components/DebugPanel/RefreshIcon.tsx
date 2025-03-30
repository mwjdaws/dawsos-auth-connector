
import { RefreshCw } from "lucide-react";

interface RefreshIconProps {
  isRefreshing?: boolean;
  size?: number;
  className?: string;
  loading?: boolean;
}

export function RefreshIcon({ isRefreshing = false, loading = false, size = 16, className = "" }: RefreshIconProps) {
  return (
    <RefreshCw 
      className={`h-${size} w-${size} ${isRefreshing || loading ? 'animate-spin' : ''} ${className}`} 
    />
  );
}
