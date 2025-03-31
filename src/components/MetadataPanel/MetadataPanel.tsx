
import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { HeaderSection } from './sections/HeaderSection';
import { MetadataContent } from './components/MetadataContent';
import { ContentAlert } from './components/ContentAlert';
import { useMetadataPanel } from './hooks/useMetadataPanel';
import { MetadataPanelProps } from './types';

/**
 * MetadataPanel Component
 * 
 * Displays metadata for a content item including tags, external source
 * information, and ontology terms.
 */
const MetadataPanel: React.FC<MetadataPanelProps> = ({
  contentId,
  editable = false,
  onMetadataChange,
  isCollapsible = false,
  initialCollapsed = false,
  showOntologyTerms = true,
  showDomain = false,
  domain = null,
  className = '',
  children
}) => {
  // Use custom hook for panel state and data
  const {
    isCollapsed,
    setIsCollapsed,
    contentExists,
    isValidContent,
    data,
    isLoading,
    error,
    externalSourceUrl,
    needsExternalReview,
    lastCheckedAt,
    tags,
    newTag,
    setNewTag,
    handleAddTag,
    handleDeleteTag,
    handleRefresh,
    handleMetadataChange
  } = useMetadataPanel({
    contentId,
    onMetadataChange: onMetadataChange || undefined,
    isCollapsible,
    initialCollapsed
  });
  
  // Content validation check
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
          needsExternalReview={false}
          handleRefresh={handleRefresh}
          isLoading={true}
          isCollapsible={isCollapsible}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed ? setIsCollapsed : undefined}
        />
        <div className="p-4 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </Card>
    );
  }
  
  // Safe wrapper for onMetadataChange to handle undefined
  const safeOnMetadataChange = onMetadataChange ? onMetadataChange : () => {};
  
  return (
    <Card className={className}>
      <HeaderSection 
        needsExternalReview={needsExternalReview}
        handleRefresh={handleRefresh}
        isLoading={isLoading}
        isCollapsible={isCollapsible}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed ? setIsCollapsed : undefined}
      />
      
      {!isCollapsed && (
        <MetadataContent
          data={data}
          contentId={contentId}
          error={error}
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
          onMetadataChange={safeOnMetadataChange}
          showOntologyTerms={showOntologyTerms}
        />
      )}
      
      {children}
    </Card>
  );
};

export default MetadataPanel;
