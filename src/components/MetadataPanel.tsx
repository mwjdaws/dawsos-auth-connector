
import { useState, useEffect, useTransition, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface MetadataProps {
  contentId: string;
  onMetadataChange?: () => void;
}

interface Metadata {
  tags: string[];
  ontology_terms: string[];
  [key: string]: any;
}

export function MetadataPanel({ contentId, onMetadataChange }: MetadataProps) {
  const [metadata, setMetadata] = useState<Metadata>({
    tags: [],
    ontology_terms: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const isMounted = useRef(true);

  useEffect(() => {
    // Set up cleanup function
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!contentId) return;
    
    const fetchMetadata = async () => {
      setIsLoading(true);
      try {
        // Fetch tags associated with the contentId
        const { data: tagData, error: tagError } = await supabase
          .from("tags")
          .select("name")
          .eq("content_id", contentId);
        
        if (tagError) throw tagError;
        
        // Update metadata with fetched tags
        if (isMounted.current) {
          startTransition(() => {
            setMetadata(prev => ({
              ...prev,
              tags: tagData?.map(t => t.name) || []
            }));
          });
        }

        if (onMetadataChange && isMounted.current) {
          onMetadataChange();
        }
      } catch (error) {
        console.error("Error fetching metadata:", error);
        if (isMounted.current) {
          toast({
            title: "Error",
            description: "Failed to load metadata. Please try again.",
            variant: "destructive",
          });
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };

    fetchMetadata();
  }, [contentId, onMetadataChange]);

  const renderBadges = (items: string[], type: string) => {
    if (!items || items.length === 0) {
      return <p className="text-sm text-muted-foreground">No {type} available</p>;
    }

    return (
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Badge key={`${type}-${item}`} variant="secondary">
            {item}
          </Badge>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : (
        <>
          <div>
            <h3 className="text-sm font-medium mb-2">Tags:</h3>
            {renderBadges(metadata.tags, "tags")}
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Ontology Terms:</h3>
            {renderBadges(metadata.ontology_terms, "ontology terms")}
          </div>
          
          {Object.entries(metadata)
            .filter(([key]) => !["tags", "ontology_terms"].includes(key))
            .map(([key, value]) => (
              <div key={key}>
                <h3 className="text-sm font-medium mb-2 capitalize">{key.replace(/_/g, " ")}:</h3>
                {typeof value === "object" && Array.isArray(value) 
                  ? renderBadges(value, key)
                  : <p className="text-sm">{String(value)}</p>}
              </div>
            ))
          }
        </>
      )}
      {isPending && <div className="mt-2 text-sm text-muted-foreground">Updating metadata...</div>}
    </div>
  );
}

export default MetadataPanel;
