
import React, { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

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
  const { user } = useAuth();

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
      
      console.log("Tags fetched:", tagData);
      
      startTransition(() => {
        setTags(tagData || []);
      });
      
      if (onMetadataChange) {
        onMetadataChange();
      }
    } catch (err: any) {
      console.error("Error fetching metadata:", err);
      setError(err.message || "Failed to fetch metadata");
      toast({
        title: "Error",
        description: "Failed to load metadata",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch metadata when contentId changes
  useEffect(() => {
    console.log("MetadataPanel: contentId changed to", contentId);
    fetchMetadata();
  }, [contentId]);

  const handleRefresh = () => {
    fetchMetadata();
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Content Metadata</CardTitle>
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
            <div>
              <h3 className="text-sm font-medium mb-2">Tags</h3>
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
