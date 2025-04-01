
/**
 * useLinkRenderer hook
 * 
 * This hook provides a customized link renderer for the force graph
 */
import { useCallback, useMemo } from 'react';
import { GraphLink } from '../../types';

interface UseLinkRendererProps {
  highlightedNodeId: string | null;
  onLinkClick?: (source: string, target: string) => void;
}

export function useLinkRenderer({ 
  highlightedNodeId,
  onLinkClick
}: UseLinkRendererProps) {
  // Determine if a link is connected to the highlighted node
  const isLinkHighlighted = useCallback((link: GraphLink): boolean => {
    if (!highlightedNodeId) return false;
    
    const sourceId = typeof link.source === 'string' 
      ? link.source 
      : link.source.id;
      
    const targetId = typeof link.target === 'string' 
      ? link.target 
      : link.target.id;
    
    return sourceId === highlightedNodeId || targetId === highlightedNodeId;
  }, [highlightedNodeId]);
  
  // Get link color based on type and highlight status
  const getLinkColor = useCallback((link: GraphLink): string => {
    if (link.color) return link.color;
    
    if (isLinkHighlighted(link)) {
      return '#ff6b6b';
    }
    
    // Color based on link type
    switch (link.type) {
      case 'ontology':
        return '#4ecdc4';
      case 'wikilink':
        return '#45b7d1';
      case 'manual':
        return '#ffd166';
      case 'AI-suggested':
        return '#6a0572';
      default:
        return '#aaa';
    }
  }, [isLinkHighlighted]);
  
  // Get link width based on weight and highlight status
  const getLinkWidth = useCallback((link: GraphLink): number => {
    const baseWidth = link.width || 1;
    const weightMultiplier = link.weight || 1;
    
    return isLinkHighlighted(link)
      ? baseWidth * weightMultiplier * 2
      : baseWidth * weightMultiplier;
  }, [isLinkHighlighted]);
  
  // Handle link click
  const handleLinkClick = useCallback((link: GraphLink) => {
    if (!onLinkClick) return;
    
    const sourceId = typeof link.source === 'string' 
      ? link.source 
      : link.source.id;
      
    const targetId = typeof link.target === 'string' 
      ? link.target 
      : link.target.id;
    
    onLinkClick(sourceId, targetId);
  }, [onLinkClick]);
  
  // Custom link object with paint method
  const linkObject = useMemo(() => ({
    color: getLinkColor,
    width: getLinkWidth
  }), [getLinkColor, getLinkWidth]);
  
  return { 
    linkObject,
    handleLinkClick
  };
}
