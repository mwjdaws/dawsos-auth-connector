
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { RefreshIcon } from "@/components/DebugPanel/RefreshIcon";
import { Button } from "@/components/ui/button";

interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id?: string | null;
  type_name?: string;
}

interface GroupedTagListProps {
  contentId: string;
  onTagClick?: (tagName: string) => void;
  refreshTrigger?: number;
}

/**
 * Component that displays tags grouped by their type
 */
export function GroupedTagList({
  contentId,
  onTagClick,
  refreshTrigger = 0
}: GroupedTagListProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [tagTypes, setTagTypes] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchTagsAndTypes = async () => {
      if (!contentId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // First, get all tag types for lookup
        const { data: types, error: typesError } = await supabase
          .from('tag_types')
          .select('id, name');
          
        if (typesError) throw typesError;
        
        // Create a lookup map for type names
        const typeMap: Record<string, string> = {};
        if (types) {
          types.forEach(type => {
            typeMap[type.id] = type.name;
          });
        }
        setTagTypes(typeMap);
        
        // Fetch tags with joined tag types
        const { data, error } = await supabase
          .from('tags')
          .select(`
            id, 
            name, 
            content_id, 
            type_id
          `)
          .eq('content_id', contentId);
        
        if (error) throw error;
        
        if (data) {
          // Process tags to include type name
          const processedTags = data.map(tag => ({
            ...tag,
            type_name: tag.type_id ? typeMap[tag.type_id] : 'Untyped'
          }));
          
          setTags(processedTags);
        }
      } catch (err) {
        console.error("Error fetching grouped tags:", err);
        setError(err instanceof Error ? err : new Error('Failed to load tags'));
        toast({
          title: "Error",
          description: "Failed to load tags",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTagsAndTypes();
  }, [contentId, refreshTrigger]);
  
  const handleRefresh = () => {
    // This will trigger the useEffect to reload tags
    setIsLoading(true);
    
    setTimeout(() => {
      // Use the same fetch function as in useEffect
      const fetchTagsAndTypes = async () => {
        if (!contentId) return;
        
        try {
          // First, get all tag types for lookup
          const { data: types, error: typesError } = await supabase
            .from('tag_types')
            .select('id, name');
            
          if (typesError) throw typesError;
          
          // Create a lookup map for type names
          const typeMap: Record<string, string> = {};
          if (types) {
            types.forEach(type => {
              typeMap[type.id] = type.name;
            });
          }
          setTagTypes(typeMap);
          
          // Fetch tags with joined tag types
          const { data, error } = await supabase
            .from('tags')
            .select(`
              id, 
              name, 
              content_id, 
              type_id
            `)
            .eq('content_id', contentId);
          
          if (error) throw error;
          
          if (data) {
            // Process tags to include type name
            const processedTags = data.map(tag => ({
              ...tag,
              type_name: tag.type_id ? typeMap[tag.type_id] : 'Untyped'
            }));
            
            setTags(processedTags);
          }
        } catch (err) {
          console.error("Error refreshing grouped tags:", err);
          setError(err instanceof Error ? err : new Error('Failed to refresh tags'));
          toast({
            title: "Error",
            description: "Failed to refresh tags",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchTagsAndTypes();
    }, 300);
  };
  
  // Group tags by their type for display
  const groupedTags: Record<string, Tag[]> = {};
  
  tags.forEach(tag => {
    const typeName = tag.type_id && tagTypes[tag.type_id] 
      ? tagTypes[tag.type_id] 
      : 'Untyped';
      
    if (!groupedTags[typeName]) {
      groupedTags[typeName] = [];
    }
    
    groupedTags[typeName].push(tag);
  });
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-32" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <Card className="p-4 text-center">
        <p className="text-sm text-red-500">Failed to load tags</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          className="mt-2"
        >
          Try Again
        </Button>
      </Card>
    );
  }
  
  if (Object.keys(groupedTags).length === 0) {
    return (
      <Card className="p-4 text-center">
        <p className="text-sm text-muted-foreground">No tags found for this content</p>
        {contentId && contentId.startsWith('temp-') && (
          <p className="text-xs text-muted-foreground mt-1">
            This is a temporary content ID. Save content to enable tag management.
          </p>
        )}
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm">Tags for content ID: <span className="font-mono text-xs">{contentId}</span></p>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshIcon loading={isLoading} className="mr-1" />
          Refresh
        </Button>
      </div>
      
      {Object.entries(groupedTags).map(([typeName, typeTags]) => (
        <div key={typeName} className="space-y-2">
          <h4 className="text-sm font-medium">{typeName}</h4>
          <div className="flex flex-wrap gap-2">
            {typeTags.map(tag => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="cursor-pointer hover:bg-secondary/80"
                onClick={() => onTagClick?.(tag.name)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default GroupedTagList;
