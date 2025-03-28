
import { Skeleton } from "@/components/ui/skeleton";
import TemplatesPanel from "@/components/TemplatesPanel";
import { Suspense } from "react";

export function TemplatesTab() {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Knowledge Templates</h2>
      <Suspense fallback={<Skeleton className="h-[300px] w-full rounded-lg" />}>
        <TemplatesPanel />
      </Suspense>
    </>
  );
}
