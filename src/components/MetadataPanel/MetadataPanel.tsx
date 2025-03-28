
import React, { useState, useEffect, useTransition, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ExternalSourceSection } from "./ExternalSourceSection";
import { TagsSection } from "./TagsSection";
import { ContentIdSection } from "./ContentIdSection";

interface Tag {
  id: string;
  name: string;
  content_id: string;
}

interface MetadataPanelProps {
  contentId: string;
  onMetadataChange?: () => void;
}

const MetadataPanel: React.FC<MetadataPanelProps> = ({ 
  contentId,
  onMetadataChange 
}) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [newTag, setNewTag] = useState("");
  const { user } = useAuth();
  const isMounted = useRef(true);
  
  // State for source metadata
  const [externalSourceUrl, setExternalSourceUrl] = useState<string | null>(null);
  const [needsExternalReview, setNeedsExternalReview] = useState<boolean>(false);
  const [lastCheckedAt, setLastCheckedAt] = useState<string | null>(null);

  const fetchMetadata = async () => {
    if (!contentId || contentId.startsWith('temp-')) {
      console.log("Invalid contentId for fetching metadata:", contentId);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching tags for contentId:", contentId);
      
      const { data: tagData, error: tagError } = await supabase
        .from("tags")
        .select("*")
        .eq("content_id", contentId);
      
      if (tagError) {
        throw tagError;
      }
      
      // Fetch source metadata
      const { data: sourceData, error: sourceError } = await supabase
        .from("knowledge_sources")
        .select("external_source_url, needs_external_review, external_source_checked_at")
        .eq("id", contentId)
        .single();
      
      if (sourceError && sourceError.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" - not an error for us
        throw sourceError;
      }
      
      console.log("Tags fetched:", tagData);
      console.log("Source metadata fetched:", sourceData);
      
      if (isMounted.current) {
        startTransition(() => {
          setTags(tagData || []);
          
          if (sourceData) {
            setExternalSourceUrl(sourceData.external_source_url);
            setNeedsExternalReview(sourceData.needs_external_review || false);
            setLastCheckedAt(sourceData.external_source_checked_at);
          }
        });
      }
      
      if (onMetadataChange) {
        onMetadataChange();
      }
    } catch (err: any) {
      console.error("Error fetching metadata:", err);
      if (isMounted.current) {
        setError(err.message || "Failed to fetch metadata");
        toast({
          title: "Error",
          description: "Failed to load metadata",
          variant: "destructive",
        });
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  // Fetch metadata when contentId changes
  useEffect(() => {
    console.log("MetadataPanel: contentId changed to", contentId);
    fetchMetadata();
    
    return () => {
      isMounted.current = false;
    };
  }, [contentId]);

  const handleRefresh = () => {
    fetchMetadata();
  };
  
  const handleAddTag = async () => {
    if (!newTag.trim() || !user) {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to add tags",
          variant: "destructive",
        });
      }
      return;
    }

    try {
      const newTagData = {
        name: newTag.trim(),
        content_id: contentId
      };
      
      const { data, error } = await supabase
        .from("tags")
        .insert(newTagData)
        .select();
      
      if (error) throw error;
      
      setTags(prev => [...prev, data![0]]);
      setNewTag("");
      
      toast({
        title: "Success",
        description: "Tag added successfully",
      });
    } catch (error: any) {
      console.error("Error adding tag:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add tag",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to delete tags",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from("tags")
        .delete()
        .eq("id", tagId);
      
      if (error) throw error;
      
      setTags(tags.filter(tag => tag.id !== tagId));
      
      toast({
        title: "Success",
        description: "Tag deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting tag:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete tag",
        variant: "destructive",
      });
    }
  };

  // Determine card border styling based on review status
  const cardBorderClass = needsExternalReview
    ? "border-yellow-400 dark:border-yellow-600"
    : "";

  return (
    <Card className={`${cardBorderClass}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <CardTitle>Content Metadata</CardTitle>
          {needsExternalReview && (
            <div className="flex items-center text-yellow-600 dark:text-yellow-500">
              <AlertTriangle className="h-5 w-5 mr-1" />
              <span className="text-sm font-medium">Needs Review</span>
            </div>
          )}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          <span className="sr-only">Refresh</span>
        </Button>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : error ? (
          <div className="text-sm text-destructive">
            {error}
          </div>
        ) : (
          <div className="space-y-4">
            <ExternalSourceSection 
              externalSourceUrl={externalSourceUrl} 
              lastCheckedAt={lastCheckedAt} 
            />
            
            <TagsSection 
              tags={tags}
              editable={!!user}
              newTag={newTag}
              setNewTag={setNewTag}
              onAddTag={handleAddTag}
              onDeleteTag={handleDeleteTag}
            />
            
            <ContentIdSection contentId={contentId} />
          </div>
        )}
        {isPending && (
          <div className="text-sm text-muted-foreground mt-2">
            Updating...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetadataPanel;
