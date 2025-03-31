
import { useCallback, useMemo } from 'react';
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
  linkWidthRange = [1, 3],
  defaultLinkWidth = 1.5
}: UseLinkRendererProps = {}) {
  /**
   * Get link color based on type or default
   */
  const getLinkColor = useCallback((link: GraphLink): string => {
    const linkType = link.type || 'default';
    return linkColorMap[linkType] || defaultLinkColor;
  }, [linkColorMap, defaultLinkColor]);

  /**
   * Get link label for display
   */
  const getLinkLabel = useCallback((link: GraphLink): string => {
    const linkType = link.type || '';
    
    // Format link type for display
    if (typeof linkType === 'string') {
      return linkType.replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
    }
    
    return '';
  }, []);

  /**
   * Get link width based on weight or default
   */
  const getLinkWidth = useCallback((link: GraphLink): number => {
    const weight = typeof link.weight === 'number' ? link.weight : defaultLinkWidth;
    const [min, max] = linkWidthRange;
    
    if (weight <= 0) return min;
    if (weight >= 1) return max;
    
    // Linear interpolation between min and max
    return min + weight * (max - min);
  }, [linkWidthRange, defaultLinkWidth]);

  return useMemo(() => ({
    getLinkColor,
    getLinkLabel,
    getLinkWidth
  }), [getLinkColor, getLinkLabel, getLinkWidth]);
}
