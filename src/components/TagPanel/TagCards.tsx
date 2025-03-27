
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface TagGroup {
  content_id: string;
  tags: string[];
}

export function TagCards() {
  const [tagGroups, setTagGroups] = useState<TagGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTags() {
      try {
        setIsLoading(true);
        
        // Get all unique content_ids
        const { data: contentIds, error: contentIdError } = await supabase
          .from("tags")
          .select("content_id")
          .not("content_id", "is", null)
          .order("content_id", { ascending: false })
          .limit(5);

        if (contentIdError) throw contentIdError;

        if (!contentIds || contentIds.length === 0) {
          setTagGroups([]);
          return;
        }

        // Get unique content_ids
        const uniqueContentIds = [...new Set(contentIds.map(item => item.content_id))];

        // Fetch all tags for these content_ids
        const tagGroupsData: TagGroup[] = [];
        
        for (const contentId of uniqueContentIds) {
          if (!contentId) continue;
          
          const { data: tagData, error: tagError } = await supabase
            .from("tags")
            .select("name")
            .eq("content_id", contentId);
            
          if (tagError) throw tagError;
          
          if (tagData && tagData.length > 0) {
            tagGroupsData.push({
              content_id: contentId,
              tags: tagData.map(tag => tag.name)
            });
          }
        }

        setTagGroups(tagGroupsData);
      } catch (err) {
        console.error("Error fetching tags:", err);
        setError("Failed to load tags. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTags();
  }, []);

  if (isLoading) {
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

  if (error) {
    return <div className="mt-6 text-red-500">{error}</div>;
  }

  if (tagGroups.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No tags found. Generate and save some tags to see them here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {tagGroups.map((group, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Content ID: {group.content_id}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {group.tags.map((tag, tagIndex) => (
                <Badge key={tagIndex} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
