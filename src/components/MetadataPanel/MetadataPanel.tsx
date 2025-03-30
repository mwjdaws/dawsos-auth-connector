
import React, { useState, useEffect } from "react";
import { usePanelState } from "./hooks/usePanelState";
import { useTagOperations } from "./hooks/tag-operations/useTagOperations";
import { useOntologyTerms } from "./hooks/useOntologyTerms";
import { useExternalSource } from "./hooks/useExternalSource";
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

  // Safely handle null or undefined states
  const safeContentId = contentId || '';
  const safeMetadataChange = onMetadataChange || (() => {});

  // Get tag operations
  const {
    tags,
    isLoading: isTagsLoading,
    error: tagsError,
    newTag,
    setNewTag,
    handleAddTag,
    handleDeleteTag,
    isAddingTag,
    isDeletingTag,
    handleRefresh
  } = useTagOperations(safeContentId);

  // Get ontology terms
  const {
    ontologyTerms,
    isLoading: isOntologyLoading
  } = useOntologyTerms(safeContentId, showOntologyTerms);

  // Get external source info
  const {
    externalSourceUrl,
    lastCheckedAt
  } = useExternalSource(safeContentId);

  // Combined loading state
  const isLoading = isTagsLoading || isOntologyLoading;
  
  // Prepare validation data
  const isValidContent = isValidContentId(safeContentId);
  const contentValidationResult = "Valid content ID"; // Simplified for now

  // Handle all loading states
  if (isLoading) {
    return (
      <div className={`p-4 flex justify-center items-center ${className}`}>
        <Spinner size="md" />
      </div>
    );
  }

  // Handle content validation
  if (!isValidContent) {
    return (
      <div className={className}>
        <ContentAlert contentId={safeContentId} />
      </div>
    );
  }

  // Show metadata content when everything is ready
  return (
    <div className={className}>
      <MetadataContent
        isLoading={isLoading}
        error={tagsError as Error}
        contentId={safeContentId}
        externalSourceUrl={externalSourceUrl}
        lastCheckedAt={lastCheckedAt}
        tags={tags}
        editable={editable}
        newTag={newTag}
        setNewTag={setNewTag}
        onAddTag={handleAddTag}
        onDeleteTag={handleDeleteTag}
        isPending={isAddingTag || isDeletingTag}
        showOntologyTerms={showOntologyTerms}
        ontologyTerms={ontologyTerms}
        onMetadataChange={safeMetadataChange}
        onRefresh={handleRefresh}
      >
        {children}
      </MetadataContent>
    </div>
  );
}

export default MetadataPanel;
