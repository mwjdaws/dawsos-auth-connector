
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export function TemplatesTab() {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Knowledge Templates</h2>
      <Suspense fallback={<Skeleton className="h-[300px] w-full rounded-lg" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-medium mb-2">Template {i}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Description of template {i} and what it can be used for.
              </p>
              <div className="flex justify-end">
                <button className="text-xs bg-primary text-white px-3 py-1 rounded">
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </Suspense>
    </>
  );
}
