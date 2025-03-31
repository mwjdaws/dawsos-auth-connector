
/**
 * Custom hook for rendering links in the graph
 */
import { useMemo } from 'react';
import { GraphLink } from '../../components/graph-renderer/GraphRendererTypes';

interface LinkRendererConfig {
  getLinkColor: (link: GraphLink) => string;
  getLinkWidth: (link: GraphLink) => number;
  getLinkLabel: (link: GraphLink) => string;
}

export function useLinkRenderer(): LinkRendererConfig {
  // Determine link color based on type
  const getLinkColor = (link: GraphLink): string => {
    const linkType = link.type || 'default';
    
    switch (linkType) {
      case 'reference':
        return '#4338ca'; // Indigo
      case 'parent':
        return '#0891b2'; // Cyan
      case 'child':
        return '#2563eb'; // Blue
      case 'related':
        return '#a855f7'; // Purple
      case 'includes':
        return '#65a30d'; // Lime
      case 'mention':
        return '#f59e0b'; // Amber
      default:
        return '#6b7280'; // Gray
    }
  };
  
  // Determine link label based on type
  const getLinkLabel = (link: GraphLink): string => {
    const linkType = link.type || 'related';
    
    // Capitalize first letter
    return linkType.charAt(0).toUpperCase() + linkType.slice(1);
  };
  
  // Determine link width based on type or weight
  const getLinkWidth = (link: GraphLink): number => {
    // Default link width
    const defaultWidth = 1.5;
    
    // Check if the link has a weight property
    if (link.weight !== undefined) {
      // Scale weight between 1 and 3 for visibility
      return Math.max(1, Math.min(3, (Number(link.weight) * 2) || defaultWidth));
    }
    
    // Different widths based on link type
    if (link.type === 'reference' || link.type === 'parent') {
      return 2;
    }
    
    return defaultWidth;
  };
  
  return useMemo(() => ({
    getLinkColor,
    getLinkWidth,
    getLinkLabel
  }), []);
}
