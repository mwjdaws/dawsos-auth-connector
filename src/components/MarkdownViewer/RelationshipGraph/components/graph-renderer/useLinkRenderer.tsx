
/**
 * useLinkRenderer Hook
 * 
 * Custom hook for rendering links in the graph visualization.
 * Encapsulates the link appearance and labeling.
 */
import { useCallback, useMemo } from 'react';
import { GraphLink } from '../../types';

export function useLinkRenderer() {
  // Memoize link colors to prevent recalculations
  const colors = useMemo(() => {
    return {
      links: {
        default: '#999',
        wikilink: '#63b3ed',
        manual: '#9f7aea',
        'AI-suggested': '#f6ad55',
        'has_term': '#cbd5e0',
        'is_a': '#a0aec0',
        'part_of': '#e53e3e',
        'related_to': '#d69e2e'
      }
    };
  }, []);
  
  // Link color accessor function
  const getLinkColor = useCallback((link: GraphLink) => {
    const linkType = link.type as string;
    return colors.links[linkType as keyof typeof colors.links] || colors.links.default;
  }, [colors.links]);
  
  // Link label accessor function
  const getLinkLabel = useCallback((link: GraphLink) => {
    return link.type as string;
  }, []);
  
  return {
    getLinkColor,
    getLinkLabel
  };
}
