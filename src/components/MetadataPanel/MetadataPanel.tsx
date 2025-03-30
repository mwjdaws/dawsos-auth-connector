
/**
 * MetadataPanel Component
 * 
 * This is the unified entry point for displaying and editing content metadata.
 * It combines various section components to create a complete metadata panel
 * with consistent styling and behavior across the application.
 */

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import { MetadataPanelProps } from "./types";
import { useMetadataPanel } from "./hooks/useMetadataPanel";
import { ContentIdValidationResult, getContentIdValidationResult } from "@/utils/content-validation";

// Import all sections from the unified sections directory
import {
  HeaderSection,
  ExternalSourceSection,
  TagsSection,
  OntologySection,
  ContentIdSection,
  LoadingState
} from "./sections";

const MetadataPanel: React.FC<MetadataPanelProps> = ({ 
  contentId,
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
  const contentValidationResult = getContentIdValidationResult(contentId);
  const isValidContent = contentValidationResult === ContentIdValidationResult.VALID;
  
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
    handleDeleteTag,
    contentExists
  } = useMetadataPanel(
    isValidContent ? contentId : undefined, 
    onMetadataChange, 
    isCollapsible, 
    initialCollapsed
  );

  // Determine if content is editable (use prop or fallback to user presence)
  // Also ensure it's not editable if the content ID is temporary/invalid
  const isEditable = (editable !== undefined ? editable : !!user) && isValidContent && contentExists;

  // Determine card border styling based on review status
  const cardBorderClass = needsExternalReview
    ? "border-yellow-400 dark:border-yellow-600"
    : "";

  // Function to render the appropriate alert message based on content ID validation result
  const renderContentAlert = () => {
    switch (contentValidationResult) {
      case ContentIdValidationResult.MISSING:
        return (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No content ID provided. Metadata cannot be loaded.
            </AlertDescription>
          </Alert>
        );
      case ContentIdValidationResult.TEMPORARY:
        return (
          <Alert variant="warning" className="border-yellow-400 dark:border-yellow-600">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Save the note before editing metadata. This is a temporary note.
            </AlertDescription>
          </Alert>
        );
      case ContentIdValidationResult.INVALID:
        return (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Invalid content ID format. Metadata cannot be loaded.
            </AlertDescription>
          </Alert>
        );
      default:
        if (!contentExists) {
          return (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Content not found in database. Please save the note first.
              </AlertDescription>
            </Alert>
          );
        }
        return null;
    }
  };

  if (!isValidContent || !contentExists) {
    return (
      <Card className={className}>
        <CardContent className="pt-4">
          {renderContentAlert()}
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
          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error.toString()}</AlertDescription>
            </Alert>
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
                className="mt-4"
              />
              
              {showOntologyTerms && contentId && (
                <OntologySection
                  sourceId={contentId} 
                  editable={isEditable}
                  className="mt-4" 
                />
              )}
              
              {children}
              
              <ContentIdSection contentId={contentId} className="mt-4" />
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
