
import React, { useState, useEffect, useTransition, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, X, Plus, ExternalLink, AlertTriangle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

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
  
  // New state for source metadata
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Get formatted date for last checked
  const formattedLastChecked = lastCheckedAt 
    ? format(new Date(lastCheckedAt), 'MMM d, yyyy h:mm a')
    : null;

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
            {externalSourceUrl && (
              <div>
                <h3 className="text-sm font-medium mb-2">External Source</h3>
                <div className="flex items-center gap-2 mb-2">
                  <a 
                    href={externalSourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {externalSourceUrl.length > 40 
                      ? `${externalSourceUrl.substring(0, 40)}...` 
                      : externalSourceUrl}
                  </a>
                </div>
                
                {lastCheckedAt && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Last checked: {formattedLastChecked}</span>
                  </div>
                )}
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium mb-2">Tags</h3>
              {user && (
                <div className="flex items-center space-x-2 mb-3">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add a new tag..."
                    className="flex-1"
                  />
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleAddTag}
                    disabled={!newTag.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              {tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge 
                      key={tag.id} 
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag.name}
                      {user && (
                        <button 
                          onClick={() => handleDeleteTag(tag.id)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No tags available for this content.
                </p>
              )}
            </div>
            
            <div className="text-xs text-muted-foreground">
              Content ID: {contentId}
            </div>
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
