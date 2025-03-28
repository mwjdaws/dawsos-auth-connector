
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { handleError } from "@/utils/errors";
import { TagPill } from "./TagPill";

interface TagListProps {
  tags: string[];
  isLoading: boolean;
  knowledgeSourceId?: string;
  onTagClick?: (tag: string) => void;
}

export function TagList({ 
  tags, 
  isLoading, 
  knowledgeSourceId,
  onTagClick 
}: TagListProps) {
  const [relatedTags, setRelatedTags] = useState<string[]>([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);
  const [relatedError, setRelatedError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch related tags if we have a valid knowledge source ID and some tags
    if (knowledgeSourceId && tags.length > 0 && !knowledgeSourceId.startsWith('temp-')) {
      fetchRelatedTags();
    }
  }, [knowledgeSourceId, tags]);

  const fetchRelatedTags = async () => {
    if (!knowledgeSourceId) return;
    
    setIsLoadingRelated(true);
    setRelatedError(null);
    
    try {
      console.log(`Fetching related tags for contentId: ${knowledgeSourceId}`);
      
      // Attempt to fetch related tags using the edge function
      const { data, error } = await supabase.functions.invoke('get-related-tags', {
        body: { knowledgeSourceId }
      });
      
      if (error) {
        console.error("Failed to fetch related tags:", error);
        // Set the error but don't throw - we'll handle it gracefully
        setRelatedError("Could not load related tags");
      } else if (data && Array.isArray(data.tags)) {
        // Updated to use 'tags' property from response
        setRelatedTags(data.tags);
        console.log("Retrieved related tags:", data.tags);
      } else {
        // If we get an unexpected response format
        console.error("Unexpected response format:", data);
        setRelatedTags([]);
      }
    } catch (error) {
      console.error("Error fetching related tags:", error);
      handleError(
        error, 
        "Failed to fetch related tags", 
        { level: "warning", silent: true }
      );
      setRelatedError("Could not load related tags");
    } finally {
      setIsLoadingRelated(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Generated Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-12" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const filteredTags = tags.filter(tag => {
    // Filter out certain tag formats that might come from OpenAI
    if (!tag || typeof tag !== 'string') return false;
    if (tag.startsWith('```') || tag.endsWith('```')) return false;
    if (tag.startsWith('"') && tag.endsWith('"')) return true;
    return true;
  }).map(tag => {
    // Clean up tag strings
    if (typeof tag === 'string') {
      // Remove any quotes
      return tag.replace(/^["']|["']$/g, '').trim();
    }
    return tag;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Generated Tags</CardTitle>
      </CardHeader>
      <CardContent>
        {filteredTags.length > 0 ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {filteredTags.map((tag, index) => (
                <TagPill 
                  key={index} 
                  tag={tag} 
                  onClick={onTagClick ? () => onTagClick(tag) : undefined} 
                />
              ))}
            </div>
            
            {relatedTags.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Related Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {relatedTags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="cursor-pointer hover:bg-accent">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {isLoadingRelated && (
              <div className="flex flex-wrap gap-2 mt-4">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            )}
            
            {relatedError && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{relatedError}</AlertDescription>
              </Alert>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No tags generated yet. Try adding some content and clicking "Generate Tags".
          </p>
        )}
      </CardContent>
    </Card>
  );
}
