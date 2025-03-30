
/**
 * MetadataPanel Component
 * 
 * This is the unified entry point for displaying and editing content metadata.
 * It combines various section components to create a complete metadata panel
 * with consistent styling and behavior across the application.
 */

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { HeaderSection } from "./sections";
import ContentAlert from "./components/ContentAlert";
import MetadataContent from "./components/MetadataContent"; 
import { useMetadataPanel } from "./hooks/useMetadataPanel";
import { MetadataPanelProps } from "./types";
import { ContentIdValidationResult } from "@/utils/validation";

const MetadataPanel: React.FC<MetadataPanelProps> = ({ 
  contentId = "",
  onMetadataChange,
  isCollapsible = false,
  initialCollapsed = false,
  showOntologyTerms = true,
  showDomain = false,
  domain = null,
  editable,
  className = "",
  children
}) => {
  // Get content data from our custom hook
  const {
    contentExists,
    isValidContent,
    contentValidationResult,
    metadata,
    tags,
    ontologyTerms,
    isLoading,
    error,
    handleRefresh,
    newTag,
    setNewTag,
    handleAddTag,
    handleDeleteTag,
    isCollapsed,
    setIsCollapsed
  } = useMetadataPanel({
    contentId,
    onMetadataChange,
    isCollapsible,
    initialCollapsed
  });
  
  // Determine if content is editable (use prop or fallback to editable prop)
  const isEditable = editable !== undefined ? editable : false;
  
  // Extract metadata values
  const externalSourceUrl = metadata?.external_source_url;
  const needsExternalReview = metadata?.needs_external_review;
  const lastCheckedAt = metadata?.external_source_checked_at;

  // Determine card border styling based on review status
  const cardBorderClass = needsExternalReview
    ? "border-yellow-400 dark:border-yellow-600"
    : "";

  // Ensure tag array always exists and is the right type
  const tagsArray = Array.isArray(tags) ? tags : [];
  const ontologyTermsArray = Array.isArray(ontologyTerms) ? ontologyTerms : [];

  if (!isValidContent || !contentExists) {
    return (
      <Card className={className}>
        <CardContent className="pt-4">
          <ContentAlert 
            contentValidationResult={contentValidationResult as ContentIdValidationResult} 
            contentExists={contentExists} 
          />
        </CardContent>
      </Card>
    );
  }

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
          <MetadataContent
            isLoading={isLoading}
            error={error}
            contentId={contentId}
            externalSourceUrl={externalSourceUrl}
            lastCheckedAt={lastCheckedAt}
            tags={tagsArray}
            editable={isEditable}
            newTag={newTag}
            setNewTag={setNewTag}
            onAddTag={handleAddTag}
            onDeleteTag={handleDeleteTag}
            isPending={false}
            showOntologyTerms={showOntologyTerms}
            ontologyTerms={ontologyTermsArray}
            onMetadataChange={onMetadataChange}
            onRefresh={handleRefresh}
            children={children}
          />
        </CardContent>
      )}
    </Card>
  );
};

export default MetadataPanel;
