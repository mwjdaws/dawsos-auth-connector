
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const LoadingState: React.FC = () => {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
};
