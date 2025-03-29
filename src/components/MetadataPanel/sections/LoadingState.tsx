
/**
 * LoadingState Component
 * 
 * Displays a loading state with skeleton UI elements for the metadata panel.
 * Used when metadata content is being fetched or processed.
 * 
 * @example
 * ```tsx
 * <LoadingState />
 * ```
 * 
 * @example
 * ```tsx
 * <LoadingState className="my-4" />
 * ```
 * 
 * @remarks
 * - Provides visual feedback during loading operations
 * - Uses Skeleton components with varying widths for a more natural appearance
 * - Can be styled with optional className prop
 */
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { BaseSectionProps } from "../types";

export const LoadingState: React.FC<BaseSectionProps> = ({ className }) => {
  return (
    <div className={`space-y-2 ${className || ''}`}>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
};
