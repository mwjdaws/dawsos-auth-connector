
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TagPill } from "./TagPill";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { isValidContentId } from "@/utils/content-validation";

interface TagType {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
  type_id: string | null;
}

interface GroupedTag extends Tag {
  type_name: string;
}

interface GroupedTagsMap {
  [typeName: string]: Tag[];
}

interface GroupedTagListProps {
  contentId: string;
  refreshTrigger?: number;
  onTagClick?: (tag: string) => void;
}

export function GroupedTagList({ contentId, refreshTrigger = 0, onTagClick }: GroupedTagListProps) {
  const [groupedTags, setGroupedTags] = useState<GroupedTagsMap>({});
  const [ungroupedTags, setUngroupedTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTagsWithTypes = async () => {
      // Validate content ID before attempting to fetch tags
      if (!isValidContentId(contentId)) {
        console.log("Invalid or temporary contentId, skipping tag fetch:", contentId);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        console.log("Fetching tags for content ID:", contentId);
        
        // First, fetch all tag types to ensure we have type information even if no tags exist for a type
        const { data: typeData, error: typeError } = await supabase
          .from("tag_types")
          .select("id, name");

        if (typeError) throw typeError;

        const tagTypes: Record<string, string> = {};
        (typeData || []).forEach((type) => {
          tagTypes[type.id] = type.name;
        });

        // Then fetch all tags for this content
        const { data: tagData, error: tagError } = await supabase
          .from("tags")
          .select("id, name, type_id")
          .eq("content_id", contentId);

        if (tagError) throw tagError;

        console.log(`Fetched ${tagData?.length || 0} tags for content ID: ${contentId}`);

        // Group tags by their type
        const grouped: GroupedTagsMap = {};
        const ungrouped: Tag[] = [];

        (tagData || []).forEach((tag) => {
          if (tag.type_id && tagTypes[tag.type_id]) {
            const typeName = tagTypes[tag.type_id];
            if (!grouped[typeName]) {
              grouped[typeName] = [];
            }
            grouped[typeName].push(tag);
          } else {
            ungrouped.push(tag);
          }
        });

        setGroupedTags(grouped);
        setUngroupedTags(ungrouped);
      } catch (error) {
        console.error("Error fetching tags with types:", error);
        toast({
          title: "Error",
          description: "Failed to load tags",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTagsWithTypes();
  }, [contentId, refreshTrigger]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-24" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-8 w-20 rounded-xl" />
          <Skeleton className="h-8 w-16 rounded-xl" />
          <Skeleton className="h-8 w-24 rounded-xl" />
        </div>
        <Skeleton className="h-4 w-24 mt-4" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-8 w-20 rounded-xl" />
          <Skeleton className="h-8 w-16 rounded-xl" />
        </div>
      </div>
    );
  }

  // Check if we have any tags to display
  const hasGroupedTags = Object.keys(groupedTags).length > 0;
  const hasUngroupedTags = ungroupedTags.length > 0;
  
  if (!hasGroupedTags && !hasUngroupedTags) {
    return (
      <div className="text-sm text-muted-foreground mt-2">
        No tags available for this content.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grouped Tags */}
      {Object.entries(groupedTags).map(([typeName, tags]) => (
        <div key={typeName} className="space-y-2">
          <h3 className="text-sm font-medium capitalize">{typeName}</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <TagPill
                key={tag.id}
                tag={tag.name}
                onClick={onTagClick}
                variant="primary"
              />
            ))}
          </div>
        </div>
      ))}

      {/* Ungrouped Tags */}
      {hasUngroupedTags && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Other Tags</h3>
          <div className="flex flex-wrap gap-2">
            {ungroupedTags.map((tag) => (
              <TagPill
                key={tag.id}
                tag={tag.name}
                onClick={onTagClick}
                variant="secondary"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
