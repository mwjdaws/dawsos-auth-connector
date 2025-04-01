
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

import { MetadataContent } from './components/MetadataContent';
import { ContentIdDetail } from './components/ContentIdDetail';
import { MetadataQueryProvider } from './providers/MetadataQueryProvider';
import { MetadataPanelProps } from './types';
import { useMetadataPanel } from './hooks/useMetadataPanel';

/**
 * MetadataPanel Component
 * 
 * Displays and allows editing of content metadata including:
 * - Tags
 * - External source information
 * - Ontology terms
 */
const MetadataPanel = ({
  contentId,
  editable = false,
  onMetadataChange = null,
  isCollapsible = false,
  initialCollapsed = false,
  showOntologyTerms = true,
  showDomain = false,
  domain = null,
  className
}: MetadataPanelProps) => {
  // Get metadata state and handlers from hook
  const {
    isCollapsed,
    setIsCollapsed,
    isCollapsible: panelIsCollapsible,
    isLoading,
    error,
    handleRefresh
  } = useMetadataPanel({
    contentId,
    onMetadataChange,
    isCollapsible,
    initialCollapsed
  });
  
  // Handle refresh button click
  const handleRefreshClick = () => {
    handleRefresh();
  };
  
  // Toggle panel collapsed state
  const toggleCollapsed = () => {
    if (panelIsCollapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };
  
  return (
    <MetadataQueryProvider
      contentId={contentId}
      editable={editable}
    >
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="px-4 py-3 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-base font-medium">
              Metadata
            </CardTitle>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8"
              onClick={handleRefreshClick}
              disabled={isLoading}
            >
              <RefreshCw className={cn(
                "h-4 w-4",
                isLoading && "animate-spin"
              )} />
              <span className="sr-only">Refresh metadata</span>
            </Button>
          </div>
          
          {panelIsCollapsible && (
            <CollapsibleTrigger asChild onClick={toggleCollapsed}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {isCollapsed 
                  ? <ChevronDown className="h-4 w-4" /> 
                  : <ChevronUp className="h-4 w-4" />
                }
              </Button>
            </CollapsibleTrigger>
          )}
        </CardHeader>
        
        {panelIsCollapsible ? (
          <Collapsible open={!isCollapsed} onOpenChange={(open) => setIsCollapsed(!open)}>
            <CollapsibleContent>
              <CardContent className="px-4 py-3">
                <ContentIdDetail contentId={contentId} className="mb-4" />
                <MetadataContent 
                  showOntologyTerms={showOntologyTerms}
                  showDomain={showDomain} 
                />
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <CardContent className="px-4 py-3">
            <ContentIdDetail contentId={contentId} className="mb-4" />
            <MetadataContent 
              showOntologyTerms={showOntologyTerms}
              showDomain={showDomain} 
            />
          </CardContent>
        )}
      </Card>
    </MetadataQueryProvider>
  );
};

export default MetadataPanel;
