
import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { HeaderSection } from './sections/HeaderSection';
import { MetadataContent } from './components/MetadataContent';
import { ContentAlert } from './components/ContentAlert';
import { MetadataQueryProvider } from './providers/MetadataQueryProvider';
import { useMetadataContext } from './hooks/useMetadataContext';
import { MetadataPanelProps } from './types';

/**
 * Inner component that uses the metadata context
 */
const MetadataPanelContent: React.FC<Omit<MetadataPanelProps, 'contentId' | 'editable'>> = ({
  isCollapsible = false,
  initialCollapsed = false,
  showOntologyTerms = true,
  showDomain = false,
  domain = null,
  className = '',
  children
}) => {
  // Use metadata context
  const {
    contentId,
    isLoading,
    error,
    tags,
    refreshMetadata,
    handleAddTag,
    handleDeleteTag,
    validationResult,
    isEditable,
    sourceMetadata
  } = useMetadataContext();
  
  // State for the collapsible panel
  const [isCollapsed, setIsCollapsed] = React.useState(initialCollapsed && isCollapsible);
  
  // State for new tag input
  const [newTag, setNewTag] = React.useState("");
  
  // Extract external source info
  const externalSourceUrl = sourceMetadata?.external_source_url || null;
  const needsExternalReview = sourceMetadata?.needs_external_review || false;
  const lastCheckedAt = sourceMetadata?.external_source_checked_at || null;
  
  // Content validation check
  const isValidContent = validationResult.isValid;
  const contentExists = validationResult.contentExists || false;
  
  if (!isValidContent) {
    return (
      <Card className={className}>
        <ContentAlert 
          contentId={contentId}
          isValidContent={isValidContent}
          contentExists={contentExists}
        />
      </Card>
    );
  }
  
  // Loading state
  if (isLoading) {
    return (
      <Card className={className}>
        <HeaderSection 
          title="Content Metadata"
          needsExternalReview={false}
          handleRefresh={() => refreshMetadata ? refreshMetadata() : {}}
          isLoading={true}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
        <div className="p-4 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </Card>
    );
  }
  
  // Handle add tag wrapper
  const handleAddTagWrapper = async (typeId?: string | null) => {
    if (!newTag.trim() || !handleAddTag) return;
    await handleAddTag(newTag, typeId);
    setNewTag("");
  };
  
  return (
    <Card className={`${needsExternalReview ? 'border border-yellow-400' : ''} ${className}`}>
      <HeaderSection 
        title="Content Metadata"
        needsExternalReview={needsExternalReview}
        handleRefresh={() => refreshMetadata ? refreshMetadata() : {}}
        isLoading={false}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      
      {!isCollapsed && (
        <MetadataContent
          data={sourceMetadata || null}
          contentId={contentId}
          error={error}
          tags={tags}
          editable={isEditable}
          newTag={newTag}
          setNewTag={setNewTag}
          onAddTag={handleAddTagWrapper}
          onDeleteTag={handleDeleteTag || (async () => {})}
          onRefresh={refreshMetadata ? () => refreshMetadata() : () => {}}
          externalSourceUrl={externalSourceUrl}
          lastCheckedAt={lastCheckedAt}
          needsExternalReview={needsExternalReview}
          showOntologyTerms={showOntologyTerms}
          domain={domain}
          showDomain={showDomain}
        />
      )}
      
      {children}
    </Card>
  );
};

/**
 * MetadataPanel Component
 * 
 * Displays metadata for a content item including tags, external source
 * information, and ontology terms.
 * 
 * @param contentId - The ID of the content to display metadata for
 * @param editable - Whether the metadata is editable
 * @param onMetadataChange - Callback when metadata changes
 * @param isCollapsible - Whether the panel can be collapsed
 * @param initialCollapsed - Whether the panel starts collapsed
 * @param showOntologyTerms - Whether to show ontology terms
 * @param showDomain - Whether to show domain information
 * @param domain - The domain to display
 * @param className - Additional CSS classes
 * @param children - Child components to render inside the panel
 */
const MetadataPanel: React.FC<MetadataPanelProps> = ({
  contentId,
  editable = false,
  onMetadataChange = null,
  ...props
}) => {
  // Handle metadata changes
  const handleMetadataChange = React.useCallback(() => {
    if (onMetadataChange) {
      onMetadataChange();
    }
  }, [onMetadataChange]);

  return (
    <MetadataQueryProvider 
      contentId={contentId}
      isEditable={editable}
    >
      <MetadataPanelContent
        {...props}
        onMetadataChange={handleMetadataChange}
      />
    </MetadataQueryProvider>
  );
};

export default MetadataPanel;
