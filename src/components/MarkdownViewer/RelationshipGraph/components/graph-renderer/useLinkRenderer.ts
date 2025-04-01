
/**
 * useLinkRenderer hook
 * 
 * This hook provides functions for rendering links in the graph
 */
import { useCallback } from 'react';
import { GraphLink } from '../../types';

interface UseLinkRendererProps {
  linkColorMap?: Record<string, string>;
  defaultLinkColor?: string;
  linkWidthRange?: [number, number];
  defaultLinkWidth?: number;
}

export function useLinkRenderer({
  linkColorMap = {},
  defaultLinkColor = '#cccccc',
  linkWidthRange = [1, 4],
  defaultLinkWidth = 1.5
}: UseLinkRendererProps = {}) {
  
  // Get link color based on type
  const getLinkColor = useCallback((link: GraphLink): string => {
    // Use explicit color if defined
    if (link.color) return link.color;
    
    // Look up color by link type
    if (link.type && linkColorMap[link.type]) {
      return linkColorMap[link.type];
    }
    
    // Default color
    return defaultLinkColor;
  }, [linkColorMap, defaultLinkColor]);
  
  // Get link width based on weight
  const getLinkWidth = useCallback((link: GraphLink): number => {
    if (link.width !== undefined) return link.width;
    
    const weight = link.weight || 1;
    const [min, max] = linkWidthRange;
    
    // Normalize width between min and max
    return Math.max(min, Math.min(max, defaultLinkWidth * weight));
  }, [linkWidthRange, defaultLinkWidth]);
  
  // Get link label (if any)
  const getLinkLabel = useCallback((link: GraphLink): string => {
    return link.label || link.type || '';
  }, []);
  
  return {
    getLinkColor,
    getLinkWidth,
    getLinkLabel
  };
}
