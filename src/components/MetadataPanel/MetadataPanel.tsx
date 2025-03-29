
import React, { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useMetadataPanel } from "./useMetadataPanel";
import { HeaderSection } from "./HeaderSection";
import { ExternalSourceSection } from "./ExternalSourceSection";
import { TagsSection } from "./TagsSection";
import { ContentIdSection } from "./ContentIdSection";
import { LoadingState } from "./LoadingState";
import { OntologyTermsPanel } from "@/components/MarkdownViewer/OntologyTermsPanel";

interface MetadataPanelProps {
  contentId: string;
  onMetadataChange?: () => void;
  isCollapsible?: boolean;
  initialCollapsed?: boolean;
  showOntologyTerms?: boolean;
  editable?: boolean;
  className?: string;
  children?: ReactNode;
}

const MetadataPanel: React.FC<MetadataPanelProps> = ({ 
  contentId,
  onMetadataChange,
  isCollapsible = false,
  initialCollapsed = false,
  showOntologyTerms = true,
  editable,
  className = "",
  children
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
    isCollapsed,
    setIsCollapsed,
    handleRefresh,
    handleAddTag,
    handleDeleteTag
  } = useMetadataPanel(contentId, onMetadataChange, isCollapsible, initialCollapsed);

  // Determine if content is editable (use prop or fallback to user presence)
  const isEditable = editable !== undefined ? editable : !!user;

  // Determine card border styling based on review status
  const cardBorderClass = needsExternalReview
    ? "border-yellow-400 dark:border-yellow-600"
    : "";

  return (
    <Card className={`${cardBorderClass} ${className}`}>
      <HeaderSection 
        needsExternalReview={needsExternalReview}
        handleRefresh={handleRefresh}
        isLoading={isLoading}
        isCollapsible={isCollapsible}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      
      {(!isCollapsible || !isCollapsed) && (
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
                editable={isEditable}
                newTag={newTag}
                setNewTag={setNewTag}
                onAddTag={handleAddTag}
                onDeleteTag={handleDeleteTag}
              />
              
              {showOntologyTerms && contentId && (
                <OntologyTermsPanel 
                  sourceId={contentId} 
                  editable={isEditable} 
                />
              )}
              
              {children}
              
              <ContentIdSection contentId={contentId} />
            </div>
          )}
          {isPending && (
            <div className="text-sm text-muted-foreground mt-2">
              Updating...
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default MetadataPanel;
