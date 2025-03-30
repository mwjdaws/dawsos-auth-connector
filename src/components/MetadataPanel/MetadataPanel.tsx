
import React, { useState } from "react";
import { usePanelState } from "./hooks/usePanelState";
import { useTagOperations } from "./hooks/tag-operations/useTagOperations";
import { useSourceMetadata } from "./hooks/useSourceMetadata";
import { Spinner } from "@/components/ui/spinner";
import { ContentAlert } from "./components/ContentAlert";
import { MetadataContent } from "./components/MetadataContent";
import { isValidContentId } from "@/utils/validation/contentIdValidation";

export interface MetadataPanelProps {
  contentId: string;
  editable?: boolean;
  onMetadataChange?: (() => void) | undefined;
  isCollapsible?: boolean;
  initialCollapsed?: boolean;
  showOntologyTerms?: boolean;
  showDomain?: boolean;
  domain?: string | null;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Metadata Panel Component
 * 
 * Displays metadata for a knowledge source including tags, ontology terms, 
 * and external source information with editing capabilities.
 */
export function MetadataPanel({
  contentId,
  editable = true,
  onMetadataChange,
  isCollapsible = false,
  initialCollapsed = false,
  showOntologyTerms = true,
  showDomain = false,
  domain = null,
  className = "",
  children
}: MetadataPanelProps) {
  const {
    isCollapsed,
    setIsCollapsed,
    contentExists,
    handleMetadataChange
  } = usePanelState({
    contentId,
    onMetadataChange,
    isCollapsible,
    initialCollapsed
  });

  // Initialize tag operations
  const {
    tags,
    isTagsLoading,
    tagsError,
    newTag,
    setNewTag,
    handleAddTag,
    handleDeleteTag,
    handleRefresh
  } = useTagOperations(contentId);

  // Use source metadata to get external source details
  const {
    data,
    isLoading: isSourceLoading,
    error: sourceError,
    fetchSourceMetadata
  } = useSourceMetadata({ contentId });

  // Extract external source information
  const externalSourceUrl = data?.external_source_url || null;
  const lastCheckedAt = data?.external_source_checked_at || null;
  const needsExternalReview = data?.needs_external_review || false;

  // Check if content ID is valid
  const isValidContent = isValidContentId(contentId);

  // Loading state
  if (isSourceLoading || isTagsLoading) {
    return (
      <div className={`flex justify-center items-center p-4 ${className}`}>
        <Spinner className="h-6 w-6 text-primary" />
        <span className="ml-2 text-muted-foreground">Loading metadata...</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <ContentAlert 
        contentId={contentId} 
        isValidContent={isValidContent}
        contentExists={contentExists}
      />
      
      {isValidContent && contentExists && (
        <MetadataContent
          data={data}
          contentId={contentId}
          error={sourceError || tagsError}
          tags={tags}
          editable={editable}
          newTag={newTag}
          setNewTag={setNewTag}
          onAddTag={handleAddTag}
          onDeleteTag={handleDeleteTag}
          onRefresh={handleRefresh}
          externalSourceUrl={externalSourceUrl}
          lastCheckedAt={lastCheckedAt}
          needsExternalReview={needsExternalReview}
          onMetadataChange={onMetadataChange}
          showOntologyTerms={showOntologyTerms}
        />
      )}

      {children}
    </div>
  );
}

export default MetadataPanel;
