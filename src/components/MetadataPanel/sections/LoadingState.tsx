
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
