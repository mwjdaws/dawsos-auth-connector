
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface TagGroup {
  content_id: string;
  tags: string[];
}

export function useTagGroups() {
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

  return {
    tagGroups,
    isLoading,
    error,
    handleRefresh
  };
}
