
import React, { Suspense, useTransition } from "react";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ContentPanelProps {
  content: string;
  processedContent: string;
  externalSourceUrl?: string | null;
}

export function ContentPanel({ content, processedContent, externalSourceUrl }: ContentPanelProps) {
  const [isPending, startTransition] = useTransition();
  
  return (
    <Card className="p-6 relative">
      {externalSourceUrl && (
        <div className="absolute top-3 right-3">
          <a
            href={externalSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
          >
            <ExternalLink className="h-3 w-3" /> External Source
          </a>
        </div>
      )}
      <div className="prose dark:prose-invert max-w-none">
        <Suspense fallback={<Skeleton className="h-40 w-full" />}>
          {isPending ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <ReactMarkdown>{processedContent || ''}</ReactMarkdown>
          )}
        </Suspense>
      </div>
    </Card>
  );
}

export default ContentPanel;
