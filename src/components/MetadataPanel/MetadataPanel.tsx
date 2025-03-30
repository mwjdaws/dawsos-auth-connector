
/**
 * MetadataPanel Component
 * 
 * This is the unified entry point for displaying and editing content metadata.
 * It combines various section components to create a complete metadata panel
 * with consistent styling and behavior across the application.
 */

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
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

// Import React Query hooks
import { useMetadataQuery, useTagsQuery, useTagMutations, useOntologyTermsQuery, useContentExists } from "@/hooks/metadata";
import { useAuth } from "@/hooks/useAuth";

export interface MetadataPanelProps {
  contentId?: string;
  onMetadataChange?: () => void;
  isCollapsible?: boolean;
  initialCollapsed?: boolean;
  showOntologyTerms?: boolean;
  showDomain?: boolean;
  domain?: string | null;
  editable?: boolean;
  className?: string;
  children?: React.ReactNode;
}

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
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const [newTag, setNewTag] = useState("");
  
  const { user } = useAuth();
  const contentValidationResult = getContentIdValidationResult(contentId);
  const isValidContent = contentValidationResult === ContentIdValidationResult.VALID;
  
  // Query hooks
  const { 
    data: metadata, 
    isLoading: isLoadingMetadata, 
    error: metadataError,
    refetch: refetchMetadata
  } = useMetadataQuery(isValidContent ? contentId : undefined);
  
  const { 
    data: tags = [], 
    isLoading: isLoadingTags,
    error: tagsError,
    refetch: refetchTags
  } = useTagsQuery(isValidContent ? contentId : undefined);
  
  const {
    data: ontologyTerms = [],
    isLoading: isLoadingOntology,
    error: ontologyError,
    refetch: refetchOntology
  } = useOntologyTermsQuery(
    isValidContent && showOntologyTerms ? contentId : undefined,
    { enabled: showOntologyTerms }
  );
  
  const { data: contentExists = false } = useContentExists(isValidContent ? contentId : undefined);
  
  // Mutation hooks
  const { addTag, deleteTag, isAddingTag, isDeletingTag } = useTagMutations();
  
  // Handle tag operations
  const handleAddTag = () => {
    if (!contentId || !newTag.trim()) return;
    
    addTag({
      contentId,
      name: newTag,
    });
    
    setNewTag("");
    
    if (onMetadataChange) {
      onMetadataChange();
    }
  };
  
  const handleDeleteTag = (tagId: string) => {
    if (!contentId) return;
    
    deleteTag({
      tagId,
      contentId,
    });
    
    if (onMetadataChange) {
      onMetadataChange();
    }
  };
  
  // Handle refresh
  const handleRefresh = () => {
    refetchMetadata();
    refetchTags();
    if (showOntologyTerms) {
      refetchOntology();
    }
    
    if (onMetadataChange) {
      onMetadataChange();
    }
  };
  
  // Determine if content is editable (use prop or fallback to user presence)
  const isEditable = (editable !== undefined ? editable : !!user) && isValidContent && contentExists;
  
  // Loading and error states
  const isLoading = isLoadingMetadata || isLoadingTags || isLoadingOntology;
  const error = metadataError || tagsError || ontologyError;
  const isPending = isAddingTag || isDeletingTag;
  
  // Extract metadata values
  const externalSourceUrl = metadata?.external_source_url;
  const needsExternalReview = metadata?.needs_external_review;
  const lastCheckedAt = metadata?.external_source_checked_at;
  
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

  // Determine card border styling based on review status
  const cardBorderClass = needsExternalReview
    ? "border-yellow-400 dark:border-yellow-600"
    : "";

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
                  terms={ontologyTerms}
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
