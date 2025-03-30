
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

interface RelationshipGraphTabProps {
  contentId: string;
}

export function RelationshipGraphTab({ contentId }: RelationshipGraphTabProps) {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Knowledge Graph</h2>
      <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-lg" />}>
        <div className="h-[400px] flex items-center justify-center bg-muted/20 rounded-lg border">
          <p className="text-muted-foreground">Knowledge Graph visualization will be displayed here.</p>
        </div>
      </Suspense>
    </>
  );
}
