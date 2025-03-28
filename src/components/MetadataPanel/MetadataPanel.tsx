
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useMetadataPanel } from "./useMetadataPanel";
import { HeaderSection } from "./HeaderSection";
import { ExternalSourceSection } from "./ExternalSourceSection";
import { TagsSection } from "./TagsSection";
import { ContentIdSection } from "./ContentIdSection";
import { LoadingState } from "./LoadingState";

interface MetadataPanelProps {
  contentId: string;
  onMetadataChange?: () => void;
}

const MetadataPanel: React.FC<MetadataPanelProps> = ({ 
  contentId,
  onMetadataChange 
}) => {
  const {
    tags,
    isLoading,
    error,
    isPending,
    newTag,
    setNewTag,
    user,
    externalSourceUrl,
    needsExternalReview,
    lastCheckedAt,
    handleRefresh,
    handleAddTag,
    handleDeleteTag
  } = useMetadataPanel(contentId, onMetadataChange);

  // Determine card border styling based on review status
  const cardBorderClass = needsExternalReview
    ? "border-yellow-400 dark:border-yellow-600"
    : "";

  return (
    <Card className={`${cardBorderClass}`}>
      <HeaderSection 
        needsExternalReview={needsExternalReview}
        handleRefresh={handleRefresh}
        isLoading={isLoading}
      />
      <CardContent className="pt-4">
        {isLoading ? (
          <LoadingState />
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
