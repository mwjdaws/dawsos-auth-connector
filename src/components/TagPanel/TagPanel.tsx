
import React, { useState, useTransition } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { TagPanelErrorFallback } from "./TagPanelErrorFallback";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Info } from "lucide-react";
import { isValidContentId } from "@/utils/content-validation";
import { useTagsQuery, useTagMutations } from "@/hooks/metadata";
import { useSaveTags } from "./hooks/useSaveTags";

// Import tag panel components
import { TagGenerator } from "./TagGenerator";
import { TagList } from "./TagList";
import { TagSaver } from "./TagSaver";
import { ManualTagCreator } from "./ManualTagCreator";
import { GroupedTagList } from "./GroupedTagList";

// Import tag generation hook
import { useTagGeneration } from "@/hooks/tagGeneration";

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

  const renderTemporaryContentAlert = () => (
    <Alert className="border-yellow-400 dark:border-yellow-600 mb-4">
      <Info className="h-4 w-4" />
      <AlertDescription>
        Save the note before adding tags. This is a temporary note.
      </AlertDescription>
    </Alert>
  );

  // Fix the type mismatch
  const tagObjects = tagGeneration.tags.map(tagName => ({
    name: tagName,
    id: `temp-${tagName}`
  }));

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
              isLoading={tagGeneration.isLoading || isPending}
              onGenerateTags={processTagGeneration}
            />
            
            <TagList 
              tags={tagObjects}
              isLoading={tagGeneration.isLoading || isPending}
              knowledgeSourceId={tagGeneration.contentId || (isValidContent ? contentId : undefined)}
              onTagClick={handleTagClick}
            />
            
            <TagSaver
              tags={tagGeneration.tags}
              contentId={tagGeneration.contentId || contentId}
              saveTags={saveTags}
              isProcessing={isProcessing}
              isRetrying={isRetrying}
              onTagsSaved={onTagsSaved}
              disabled={!isValidContent}
            />
          </TabsContent>
          
          <TabsContent value="manual" className="space-y-6 pt-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Add Tag</h3>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter tag name..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  disabled={!isValidContent || isAddingTag}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddManualTag()}
                />
                
                <Button 
                  onClick={handleAddManualTag}
                  disabled={!newTag.trim() || !isValidContent || isAddingTag}
                >
                  Add Tag
                </Button>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Tags for this Content</h3>
              
              {isLoadingTags ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-6 w-24 bg-muted rounded"></div>
                  <div className="h-6 w-32 bg-muted rounded"></div>
                </div>
              ) : existingTags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {existingTags.map(tag => (
                    <Badge 
                      key={tag.id} 
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag.name}
                      {editable && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => handleDeleteTag(tag.id)}
                          disabled={isDeletingTag}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No tags for this content yet</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  );
}

export default TagPanel;
