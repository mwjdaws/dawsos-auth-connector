
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { TagCards } from "./TagCards";
import { TagCardsLoading } from "./TagCardsLoading";
import { TagCardsError } from "./TagCardsError";
import { TagCardsEmpty } from "./TagCardsEmpty";
import { isValidContentId } from "@/utils/content-validation";

interface GroupedTag {
  id: string;
  name: string;
  type_name: string | null;
}

interface TagGroup {
  type: string;
  tags: GroupedTag[];
}

interface GroupedTagListProps {
  contentId: string;
  refreshTrigger?: number;
  onTagClick?: (tag: string) => void;
  disabled?: boolean;
}

export function GroupedTagList({ contentId, refreshTrigger = 0, onTagClick, disabled = false }: GroupedTagListProps) {
  const [tagGroups, setTagGroups] = useState<TagGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Skip fetching for invalid or disabled content
    if (disabled || !isValidContentId(contentId)) {
      return;
    }
    
    const fetchTags = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching tags for content: ${contentId}`);
        
        // Check if the knowledge source exists
        const { data: knowledgeSource, error: knowledgeSourceError } = await supabase
          .from('knowledge_sources')
          .select('id')
          .eq('id', contentId)
          .maybeSingle();
          
        if (knowledgeSourceError) {
          console.error('Error checking knowledge source:', knowledgeSourceError);
          throw knowledgeSourceError;
        }
        
        if (!knowledgeSource) {
          console.warn(`Knowledge source not found for ID: ${contentId}`);
          setTagGroups([]);
          setIsLoading(false);
          return;
        }
        
        // Get tags for the current content
        const { data, error } = await supabase
          .from('tags')
          .select(`
            id,
            name,
            type_id,
            tag_types(name)
          `)
          .eq('content_id', contentId);
          
        if (error) throw error;
        
        // Process data to group by tag type
        const processedTags: GroupedTag[] = data.map(tag => ({
          id: tag.id,
          name: tag.name,
          type_name: tag.tag_types?.name || 'Other'
        }));
        
        // Group tags by type
        const groups: Record<string, GroupedTag[]> = {};
        
        processedTags.forEach(tag => {
          const type = tag.type_name || 'Other';
          if (!groups[type]) {
            groups[type] = [];
          }
          groups[type].push(tag);
        });
        
        // Convert to array of TagGroup objects and sort alphabetically
        const sortedGroups = Object.entries(groups)
          .map(([type, tags]) => ({ type, tags }))
          .sort((a, b) => a.type.localeCompare(b.type));
          
        setTagGroups(sortedGroups);
      } catch (err) {
        console.error('Error fetching grouped tags:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load tags';
        setError(errorMessage);
        
        toast({
          title: "Error",
          description: "Failed to load content tags",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTags();
  }, [contentId, refreshTrigger, disabled]);
  
  if (disabled) {
    return (
      <TagCardsEmpty message="Save the note before viewing tags" />
    );
  }
  
  if (!isValidContentId(contentId)) {
    return (
      <TagCardsEmpty message="Save the note before viewing tags" />
    );
  }
  
  if (isLoading) {
    return <TagCardsLoading />;
  }
  
  if (error) {
    return <TagCardsError message={error} />;
  }
  
  if (tagGroups.length === 0) {
    return <TagCardsEmpty message="No tags found for this content" />;
  }
  
  return (
    <div className="space-y-6">
      {tagGroups.map(group => (
        <TagCards 
          key={group.type}
          title={group.type}
          tags={group.tags.map(tag => tag.name)}
          onTagClick={onTagClick}
        />
      ))}
    </div>
  );
}
