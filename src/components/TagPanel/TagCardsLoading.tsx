
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TagCardsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {[1, 2, 3, 4].map(i => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map(j => (
                <Skeleton key={j} className="h-6 w-16 rounded-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
