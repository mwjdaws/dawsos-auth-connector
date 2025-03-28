
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface TagGroup {
  content_id: string;
  tags: string[];
}

export function TagCards() {
  const [tagGroups, setTagGroups] = useState<TagGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function fetchTags() {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log("TagCards: Fetching recent tag groups...");
        
        // Direct query to get distinct content IDs with tags
        const { data: contentIdsData, error: contentIdsError } = await supabase
          .from("tags")
          .select("content_id")
          .not("content_id", "is", null)
          .order("id", { ascending: false }) // Using ID instead of created_at
          .limit(20); // Fetch more to account for duplicates
        
        if (contentIdsError) {
          console.error("TagCards: Error fetching content IDs:", contentIdsError);
          throw contentIdsError;
        }
        
        if (!contentIdsData || contentIdsData.length === 0) {
          console.log("TagCards: No recent tags found");
          setTagGroups([]);
          setIsLoading(false);
          return;
        }
        
        // Extract unique content IDs (newest first based on the order above)
        const uniqueContentIds: string[] = [];
        contentIdsData.forEach(item => {
          if (item.content_id && !uniqueContentIds.includes(item.content_id)) {
            uniqueContentIds.push(item.content_id);
          }
        });
        
        // Limit to 5 most recent unique content IDs
        const recentUniqueContentIds = uniqueContentIds.slice(0, 5);
        console.log("TagCards: Recent unique content IDs:", recentUniqueContentIds);
        
        // Fetch all tags for these content_ids
        const tagGroupsData: TagGroup[] = [];
        
        for (const contentId of recentUniqueContentIds) {
          const { data: tagData, error: tagError } = await supabase
            .from("tags")
            .select("name")
            .eq("content_id", contentId);
            
          if (tagError) {
            console.error(`TagCards: Error fetching tags for contentId ${contentId}:`, tagError);
            continue; // Skip this content ID but continue with others
          }
          
          if (tagData && tagData.length > 0) {
            tagGroupsData.push({
              content_id: contentId,
              tags: tagData.map(tag => tag.name)
            });
            console.log(`TagCards: Found ${tagData.length} tags for contentId ${contentId}`);
          }
        }

        setTagGroups(tagGroupsData);
        console.log("TagCards: Loaded tag groups:", tagGroupsData);
        
        // Show a success toast if this was a manual refresh
        if (refreshKey > 0) {
          toast({
            title: "Tags Refreshed",
            description: `Loaded ${tagGroupsData.length} tag groups`
          });
        }
      } catch (err) {
        console.error("TagCards: Error in fetchTags:", err);
        setError("Failed to load tags. Please try again later.");
        
        // Show error toast if this was a manual refresh
        if (refreshKey > 0) {
          toast({
            title: "Refresh Failed",
            description: "Could not refresh tags. Please try again.",
            variant: "destructive"
          });
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchTags();
  }, [refreshKey]);

  const handleRefresh = () => {
    console.log("TagCards: Manual refresh triggered");
    toast({
      title: "Refreshing",
      description: "Updating recent tags..."
    });
    setRefreshKey(prev => prev + 1);
  };

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
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            className="flex items-center"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
        <Card className="mt-2">
          <CardContent className="p-6">
            <div className="text-red-500">{error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (tagGroups.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            className="flex items-center"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
        <Card className="mt-2">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4 py-4">
              <p className="text-center text-muted-foreground">No tags found. Generate and save some tags to see them here.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh} 
          className="flex items-center"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tagGroups.map((group, index) => (
          <Card key={`${group.content_id}-${index}`}>
            <CardHeader>
              <CardTitle className="text-sm font-medium truncate">
                Content ID: {group.content_id.substring(0, 20)}
                {group.content_id.length > 20 ? '...' : ''}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {group.tags.map((tag, tagIndex) => (
                  <Badge key={`${tag}-${tagIndex}`} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
