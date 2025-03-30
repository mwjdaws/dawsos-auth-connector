
import React, { useState, useTransition, useEffect } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { TagPanelErrorFallback } from "./TagPanelErrorFallback";
import { useTagGeneration } from "@/hooks/tagGeneration";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useSaveTags } from "./hooks/useSaveTags";
import { ManualTagCreator } from "./ManualTagCreator";
import { GroupedTagList } from "./GroupedTagList";
import { isValidContentId } from "@/utils/validation";
import { useTagsQuery, useTagMutations } from "@/hooks/metadata";
import { AutomaticTagTab } from "./AutomaticTagTab";
import { ManualTagTab } from "./ManualTagTab";
import { TemporaryContentAlert } from "./TemporaryContentAlert";

/**
 * TagPanel Component
 *
 * Renders the UI for manually adding and displaying tags on a knowledge source.
 * Supports grouped rendering by tag type and integration with Supabase for CRUD.
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
  const [newTag, setNewTag] = useState("");
  
  const isValidContent = isValidContentId(contentId);
  
  // Fetch existing tags for the content
  const { 
    data: existingTags = [], 
    isLoading: isLoadingTags 
  } = useTagsQuery(contentId, { 
    enabled: isValidContent,
    includeTypeInfo: true
  });
  
  // Tag mutation hooks
  const {
    addTag,
    deleteTag,
    isAddingTag,
    isDeletingTag
  } = useTagMutations(contentId);
  
  // Force refresh when contentId changes to ensure correct display
  useEffect(() => {
    setRefreshTrigger(prev => prev + 1);
  }, [contentId, tagContentId]);
  
  // Handle tag generation from content
  const processTagGeneration = (text: string) => {
    if (text && text.trim()) {
      setContent(text);
      
      startTransition(() => {
        handleGenerateTags(text)
          .then(newContentId => {
            if (newContentId) {
              setContentId(newContentId);
              setRefreshTrigger(prev => prev + 1);
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
    }
  };
  
  // Handle save tags with improved error handling
  const handleSaveTags = async () => {
    if (!tags.length) {
      return;
    }
    
    const result = await saveTags("", tags, {
      contentId: tagContentId || contentId
    });
    
    if (result && typeof result === 'string') {
      onTagsSaved(result);
      
      if (onMetadataChange) {
        onMetadataChange();
      }
      
      setRefreshTrigger(prev => prev + 1);
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

  // Handle adding a new manual tag
  const handleAddManualTag = () => {
    if (!newTag.trim() || !isValidContent) return;
    
    addTag({ 
      contentId, 
      name: newTag.trim() 
    });
    
    setNewTag("");
    setRefreshTrigger(prev => prev + 1);
    
    // Call onMetadataChange if provided
    if (onMetadataChange) {
      onMetadataChange();
    }
  };

  // Handle deleting a tag
  const handleDeleteTag = (tagId: string) => {
    if (!isValidContent) return;
    
    deleteTag({ 
      tagId, 
      contentId 
    });
    
    setRefreshTrigger(prev => prev + 1);
    
    // Call onMetadataChange if provided
    if (onMetadataChange) {
      onMetadataChange();
    }
  };

  // Trigger a refresh of the grouped tag list
  const handleTagCreated = () => {
    setRefreshTrigger(prev => prev + 1);
    
    if (onMetadataChange) {
      onMetadataChange();
    }
    
    toast({
      title: "Success",
      description: "Tag created and added to the content",
    });
  };
  
  return (
    <ErrorBoundary fallback={<TagPanelErrorFallback />}>
      <div className="space-y-6 w-full">
        {!isValidContent && <TemporaryContentAlert />}
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "automatic" | "manual")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="automatic">Automatic Tags</TabsTrigger>
            <TabsTrigger value="manual">Manual Tags</TabsTrigger>
          </TabsList>
          
          <TabsContent value="automatic">
            <AutomaticTagTab
              contentId={contentId}
              tagGeneration={{
                tags,
                isLoading,
                contentId: tagContentId
              }}
              isPending={isPending}
              handleTagClick={handleTagClick}
              processTagGeneration={processTagGeneration}
              handleSaveTags={handleSaveTags}
              saveTags={{
                isProcessing,
                isRetrying
              }}
              onTagsSaved={onTagsSaved}
            />
          </TabsContent>
          
          <TabsContent value="manual">
            <ManualTagTab
              contentId={contentId}
              existingTags={existingTags}
              isLoadingTags={isLoadingTags}
              newTag={newTag}
              setNewTag={setNewTag}
              handleAddManualTag={handleAddManualTag}
              handleDeleteTag={handleDeleteTag}
              isAddingTag={isAddingTag}
              isDeletingTag={isDeletingTag}
              isValidContent={isValidContent}
              editable={editable}
              refreshTrigger={refreshTrigger}
              handleTagClick={handleTagClick}
            />
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  );
}
