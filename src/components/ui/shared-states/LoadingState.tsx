
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface LoadingStateProps {
  variant?: "skeleton" | "spinner";
  text?: string;
  className?: string;
}

/**
 * Unified loading state component that can be used across the application
 * Supports both skeleton and spinner loading indicators
 */
export function LoadingState({ 
  variant = "skeleton", 
  text = "Loading...",
  className = "" 
}: LoadingStateProps) {
  if (variant === "spinner") {
    return <LoadingSpinner text={text} className={className} />;
  }
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-8 w-full" />
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-4 w-[120px]" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-4 w-[150px]" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-32 rounded-full" />
        </div>
      </div>
    </div>
  );
}
