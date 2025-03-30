
import React, { useState, useEffect, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import MarkdownViewer from "@/components/MarkdownViewer/MarkdownViewer";

interface MarkdownViewerTabProps {
  contentId?: string;
}

export function MarkdownViewerTab({ contentId }: MarkdownViewerTabProps) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContent() {
      if (!contentId) {
        setContent("# No Content Selected\n\nPlease select or create content to view.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('knowledge_sources')
          .select('content')
          .eq('id', contentId)
          .single();

        if (error) {
          throw error;
        }

        // Handle missing data case
        if (!data || !data.content) {
          setContent("# Content Not Found\n\nThe requested content could not be found.");
        } else {
          setContent(data.content);
        }
      } catch (err) {
        console.error("Error fetching content:", err);
        setError("Failed to load content. Please try again.");
        // Set fallback content
        setContent("# Error Loading Content\n\nThere was a problem loading the content. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, [contentId]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Markdown Viewer</h2>
      <Suspense fallback={<Skeleton className="h-[300px] w-full rounded-lg" />}>
        {loading ? (
          <Skeleton className="h-[300px] w-full rounded-lg" />
        ) : (
          <MarkdownViewer 
            content={content || "# No Content Available"}
            contentId={contentId || "temp-no-content"}
          />
        )}
      </Suspense>
    </>
  );
}
