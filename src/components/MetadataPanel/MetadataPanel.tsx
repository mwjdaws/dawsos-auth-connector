
/**
 * MetadataPanel Component
 * 
 * This is the unified entry point for displaying and editing content metadata.
 * It combines various section components to create a complete metadata panel
 * with consistent styling and behavior across the application.
 * 
 * Features:
 * - Display and edit content metadata (tags, external sources, ontology terms)
 * - Collapsible panel with refresh functionality
 * - Loading and error states
 * - Type safety with comprehensive TypeScript interfaces
 * 
 * @example
 * // Basic usage
 * <MetadataPanel 
 *   contentId="content-123" 
 *   onMetadataChange={() => {}} 
 * />
 * 
 * @example
 * // Advanced usage with options
 * <MetadataPanel 
 *   contentId="content-123" 
 *   onMetadataChange={handleMetadataChange} 
 *   isCollapsible={true}
 *   initialCollapsed={false}
 *   showOntologyTerms={true}
 *   showDomain={true}
 *   domain="Engineering"
 *   editable={true}
 *   className="my-4"
 * >
 *   <CustomSection />
 * </MetadataPanel>
 * 
 * @example
 * // Using the metadata context outside the component
 * import { useMetadataContext } from "@/components/MetadataPanel";
 * 
 * function MyComponent({ contentId }) {
 *   const metadata = useMetadataContext(contentId);
 *   
 *   // Access metadata state
 *   console.log(metadata.tags);
 *   
 *   // Perform operations
 *   metadata.handleAddTag();
 *   
 *   // Refresh metadata
 *   metadata.refreshMetadata();
 * }
 */

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { MetadataPanelProps } from "./types";
import { useMetadataPanel } from "./hooks/useMetadataPanel";

// Import all sections from the unified sections directory
import {
  HeaderSection,
  ExternalSourceSection,
  TagsSection,
  OntologyTermsSection,
  ContentIdSection,
  LoadingState,
  DomainSection
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

  if (!contentId) {
    return (
      <Card className={className}>
        <CardContent className="pt-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No content ID provided. Metadata cannot be loaded.
            </AlertDescription>
          </Alert>
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
              />
              
              {showOntologyTerms && contentId && (
                <OntologyTermsSection 
                  sourceId={contentId} 
                  editable={isEditable} 
                />
              )}
              
              {showDomain && (
                <DomainSection domain={domain} />
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
