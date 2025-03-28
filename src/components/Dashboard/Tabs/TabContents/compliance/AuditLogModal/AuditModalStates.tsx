
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  );
}

export function ErrorState({ error }: { error: string }) {
  return (
    <div className="p-4 text-sm border rounded-md bg-red-50 border-red-200 text-red-800">
      {error}
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="text-center py-8">
      <p className="text-gray-500">No audit history available for this item.</p>
    </div>
  );
}
