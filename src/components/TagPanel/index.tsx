import React, { useState, useTransition, useEffect } from "react";
import { TagGenerator } from "./TagGenerator";
import { TagList } from "./TagList";
import { TagSaver } from "./TagSaver";
import { useSaveTags } from "./hooks/useSaveTags";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { TagPanelErrorFallback } from "./TagPanelErrorFallback";
import { useTagGeneration } from "@/hooks/tagGeneration";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManualTagCreator } from "./ManualTagCreator";
import { GroupedTagList } from "./GroupedTagList";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { isValidContentId } from "@/utils/content-validation";

/**
 * TagPanel Component
 *
 * Renders the UI for manually adding and displaying tags on a knowledge source.
 * Supports grouped rendering by tag type and integration with Supabase for CRUD.
 *
 * ## Props
 * @param {string} contentId - The ID of the note or knowledge source
 * @param {boolean} editable - Whether the tag input is editable
 * @param {Function} onMetadataChange - Callback triggered after tag updates
 *
 * ## Behavior
 * - Tags are stored in the `tags` table with associated `content_id` and `type_id`
 * - Grouping is handled by `GroupedTagList` based on `tag_types.name`
 * - Input is trimmed, lowercased, and validated before insert
 * - Duplicate tags for the same note are prevented
 *
 * ## Example
 * ```tsx
 * <TagPanel
 *   contentId="abc123"
 *   editable
 *   onMetadataChange={refresh}
 * />
 * ```
 */

interface TagPanelProps {
  contentId: string;
  onTagsSaved: (contentId: string) => void;
  editable?: boolean;
  onMetadataChange?: () => void;
}

export function TagPanel({ contentId, onTagsSaved, editable = true, onMetadataChange }: TagPanelProps) {
  const navigate = useNavigate();
  const {
    saveTags,
    isProcessing,
    isRetrying
  } = useSaveTags();
  
  // Use the hook for tag generation
  const {
    tags,
    isLoading,
    contentId: tagContentId,
    setContentId,
    handleGenerateTags
  } = useTagGeneration();
  
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"automatic" | "manual">("automatic");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const isValidContent = isValidContentId(contentId);
  
  // Debug logging for component state
  useEffect(() => {
    console.log("[TagPanel] Current state:", {
      contentId,
      tagContentId,
      isValidContentId: isValidContent,
      tags: tags.length > 0 ? `${tags.length} tags` : "no tags",
      isLoading,
      isPending,
      isProcessing,
      isRetrying
    });
  }, [contentId, tagContentId, tags, isLoading, isPending, isProcessing, isRetrying, isValidContent]);
  
  // Force refresh when contentId changes to ensure correct display
  useEffect(() => {
    setRefreshTrigger(prev => prev + 1);
  }, [contentId, tagContentId]);
  
  // Handle tag generation from content
  const processTagGeneration = (text: string) => {
    if (text && text.trim()) {
      setContent(text);
      console.log("[TagPanel] Generating tags for text:", text.substring(0, 50) + "...");
      
      startTransition(() => {
        handleGenerateTags(text)
          .then(newContentId => {
            if (newContentId) {
              console.log("[TagPanel] Generation complete, new contentId:", newContentId);
              setContentId(newContentId);
              setRefreshTrigger(prev => prev + 1); // Force refresh
            } else {
              console.error("[TagPanel] No contentId returned from tag generation");
            }
          })
          .catch(err => {
            console.error("[TagPanel] Error generating tags:", err);
            toast({
              title: "Error",
              description: "Failed to generate tags. Please try again.",
              variant: "destructive"
            });
          });
      });
    } else {
      console.warn("[TagPanel] Attempted to generate tags with empty text");
    }
  };
  
  // Handle save tags with improved error handling and Promise resolution
  const handleSaveTags = async () => {
    console.log("[TagPanel] Saving tags:", {
      tagCount: tags.length,
      contentId: tagContentId || contentId,
      isProcessing
    });
    
    if (!tags.length) {
      console.warn("[TagPanel] Attempted to save empty tags array");
      return;
    }
    
    const result = await saveTags("", tags, {
      contentId: tagContentId || contentId
    });
    
    console.log("[TagPanel] Save result:", result);
    
    if (result && typeof result === 'string') {
      console.log("[TagPanel] Tags saved, calling onTagsSaved with:", result);
      onTagsSaved(result);
      
      // Also call onMetadataChange if provided
      if (onMetadataChange) {
        onMetadataChange();
      }
      
      setRefreshTrigger(prev => prev + 1); // Force refresh after save
    }
  };
  
  // Handle tag click for filtering or navigation
  const handleTagClick = (tag: string) => {
    toast({
      title: "Navigating to tag",
      description: `Searching for content with tag: ${tag}`
    });
    navigate(`/search?tag=${encodeURIComponent(tag)}`);
  };

  // Trigger a refresh of the grouped tag list
  const handleTagCreated = () => {
    setRefreshTrigger(prev => prev + 1);
    
    // Call onMetadataChange if provided
    if (onMetadataChange) {
      onMetadataChange();
    }
    
    toast({
      title: "Success",
      description: "Tag created and added to the content",
    });
  };

  const renderTemporaryContentAlert = () => (
    <Alert className="border-yellow-400 dark:border-yellow-600 mb-4">
      <Info className="h-4 w-4" />
      <AlertDescription>
        Save the note before adding tags. This is a temporary note.
      </AlertDescription>
    </Alert>
  );
  
  return (
    <ErrorBoundary fallback={<TagPanelErrorFallback />}>
      <div className="space-y-6 w-full">
        {!isValidContent && renderTemporaryContentAlert()}
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "automatic" | "manual")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="automatic">Automatic Tags</TabsTrigger>
            <TabsTrigger value="manual">Manual Tags</TabsTrigger>
          </TabsList>
          
          <TabsContent value="automatic" className="space-y-6 pt-4">
            <TagGenerator 
              isLoading={isLoading || isPending}
              onGenerateTags={processTagGeneration}
            />
            
            <TagList 
              tags={tags}
              isLoading={isLoading || isPending}
              knowledgeSourceId={tagContentId || (isValidContent ? contentId : undefined)}
              onTagClick={handleTagClick}
            />
            
            <TagSaver
              tags={tags}
              contentId={tagContentId || contentId}
              saveTags={saveTags}
              isProcessing={isProcessing}
              isRetrying={isRetrying}
              onTagsSaved={onTagsSaved}
              disabled={!isValidContent}
            />
          </TabsContent>
          
          <TabsContent value="manual" className="space-y-6 pt-4">
            <ManualTagCreator 
              contentId={contentId} 
              onTagCreated={handleTagCreated}
              editable={editable && isValidContent}
            />
            
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Tags for this Content</h3>
              <GroupedTagList 
                contentId={contentId}
                refreshTrigger={refreshTrigger}
                onTagClick={handleTagClick}
                disabled={!isValidContent}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  );
}
