
import React, { useState, useTransition } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { TagPanelErrorFallback } from "./TagPanelErrorFallback";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isValidContentId } from "@/utils/content-validation";
import { useTagGeneration } from "@/hooks/tagGeneration";
import { useSaveTags } from "./hooks/useSaveTags";
import { useTagsQuery, useTagMutations } from "@/hooks/metadata";

// Import refactored components
import { AutomaticTagTab } from "./AutomaticTagTab";
import { ManualTagTab } from "./ManualTagTab";
import { TemporaryContentAlert } from "./TemporaryContentAlert";

interface TagPanelProps {
  contentId: string;
  onTagsSaved: (contentId: string) => void;
  editable?: boolean;
  onMetadataChange?: () => void;
}

export function TagPanel({ 
  contentId, 
  onTagsSaved, 
  editable = true, 
  onMetadataChange 
}: TagPanelProps) {
  // State for tag panel
  const [activeTab, setActiveTab] = useState<"automatic" | "manual">("automatic");
  const [isPending, startTransition] = useTransition();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [newTag, setNewTag] = useState("");
  
  // Tag generation hook
  const tagGeneration = useTagGeneration();
  
  // Tag saving hook
  const { saveTags, isProcessing, isRetrying } = useSaveTags();
  
  // Fetch existing tags with React Query
  const { 
    data: existingTags = [], 
    isLoading: isLoadingTags 
  } = useTagsQuery(contentId, {
    enabled: isValidContentId(contentId)
  });
  
  // Tag mutations
  const { 
    addTag, 
    deleteTag, 
    isAddingTag, 
    isDeletingTag 
  } = useTagMutations();
  
  const isValidContent = isValidContentId(contentId);
  
  // Handle tag generation from content
  const processTagGeneration = (text: string) => {
    if (!text || !text.trim()) return;
    
    startTransition(() => {
      tagGeneration.handleGenerateTags(text)
        .then(newContentId => {
          if (newContentId) {
            tagGeneration.setContentId(newContentId);
            setRefreshTrigger(prev => prev + 1);
          }
        })
        .catch(err => {
          console.error("Error generating tags:", err);
          toast({
            title: "Error",
            description: "Failed to generate tags",
            variant: "destructive"
          });
        });
    });
  };
  
  // Handle save tags
  const handleSaveTags = async () => {
    if (!tagGeneration.tags.length) return;
    
    const result = await saveTags("", tagGeneration.tags, {
      contentId: tagGeneration.contentId || contentId
    });
    
    if (result && typeof result === 'string') {
      onTagsSaved(result);
      
      if (onMetadataChange) {
        onMetadataChange();
      }
      
      setRefreshTrigger(prev => prev + 1);
      
      toast({
        title: "Tags Saved",
        description: "Tags were successfully saved to the content",
      });
    }
  };
  
  // Handle tag click
  const handleTagClick = (tag: string) => {
    toast({
      title: "Tag Selected",
      description: `Selected tag: ${tag}`
    });
  };

  // Handle manual tag creation
  const handleAddManualTag = () => {
    if (!newTag.trim() || !isValidContent) return;
    
    addTag({
      contentId,
      name: newTag
    });
    
    setNewTag("");
    setRefreshTrigger(prev => prev + 1);
    
    if (onMetadataChange) {
      onMetadataChange();
    }
  };
  
  // Handle tag deletion
  const handleDeleteTag = (tagId: string) => {
    if (!isValidContent) return;
    
    deleteTag({
      tagId,
      contentId
    });
    
    setRefreshTrigger(prev => prev + 1);
    
    if (onMetadataChange) {
      onMetadataChange();
    }
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
                tags: tagGeneration.tags,
                isLoading: tagGeneration.isLoading,
                contentId: tagGeneration.contentId
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

export default TagPanel;
