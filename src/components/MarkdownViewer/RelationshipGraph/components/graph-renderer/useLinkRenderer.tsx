
/**
 * useLinkRenderer Hook
 * 
 * Custom hook for rendering links in the graph visualization.
 * Encapsulates the link appearance and labeling logic based on link types.
 * 
 * @returns {Object} Methods for getting link colors and labels
 */
import { useCallback, useMemo } from 'react';
import { GraphLink } from '../../types';

export function useLinkRenderer() {
  // Memoize link colors to prevent recalculations on re-renders
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
  
  /**
   * Get the appropriate color for a link based on its type
   * 
   * @param {GraphLink} link - The link object
   * @returns {string} The color to use for the link
   */
  const getLinkColor = useCallback((link: GraphLink) => {
    if (!link.type) return colors.links.default;
    return colors.links[link.type as keyof typeof colors.links] || colors.links.default;
  }, [colors.links]);
  
  /**
   * Get the label text for a link
   * 
   * @param {GraphLink} link - The link object
   * @returns {string} The label to display for the link
   */
  const getLinkLabel = useCallback((link: GraphLink) => {
    return link.type || '';
  }, []);
  
  return {
    getLinkColor,
    getLinkLabel
  };
}
