
/**
 * MetadataPanel Component
 * 
 * This is the unified entry point for displaying and editing content metadata.
 * It combines various section components to create a complete metadata panel
 * with consistent styling and behavior across the application.
 */

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { HeaderSection } from "./sections";
import ContentAlert from "./components/ContentAlert";
import MetadataContent from "./components/MetadataContent"; 
import { usePanelContent } from "./hooks/usePanelContent";
import { useAuth } from "@/hooks/useAuth";
import { useTagMutations } from "@/hooks/metadata";

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
    handleRefresh
  } = usePanelContent(contentId, onMetadataChange, showOntologyTerms);
  
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
  
  // Determine if content is editable (use prop or fallback to user presence)
  const isEditable = (editable !== undefined ? editable : !!user) && isValidContent && contentExists;
  
  // Loading and pending states
  const isPending = isAddingTag || isDeletingTag;
  
  // Extract metadata values
  const externalSourceUrl = metadata?.external_source_url;
  const needsExternalReview = metadata?.needs_external_review;
  const lastCheckedAt = metadata?.external_source_checked_at;

  // Determine card border styling based on review status
  const cardBorderClass = needsExternalReview
    ? "border-yellow-400 dark:border-yellow-600"
    : "";

  if (!isValidContent || !contentExists) {
    return (
      <Card className={className}>
        <CardContent className="pt-4">
          <ContentAlert 
            contentValidationResult={contentValidationResult} 
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
            tags={tags}
            editable={isEditable}
            newTag={newTag}
            setNewTag={setNewTag}
            onAddTag={handleAddTag}
            onDeleteTag={handleDeleteTag}
            isPending={isPending}
            showOntologyTerms={showOntologyTerms}
            ontologyTerms={ontologyTerms}
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
