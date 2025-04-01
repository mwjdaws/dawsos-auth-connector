
import { useRef, useState, useEffect, useCallback } from 'react';

/**
 * Hook for observing element size changes
 * 
 * @param defaultWidth Initial width value, defaults to 0
 * @param defaultHeight Initial height value, defaults to 0
 * @returns [ref, dimensions, reset]
 */
export function useResizeObserver<T extends HTMLElement>(
  defaultWidth: number = 0,
  defaultHeight: number = 0
): [React.RefObject<T>, { width: number; height: number }, () => void] {
  const [dimensions, setDimensions] = useState({ width: defaultWidth, height: defaultHeight });
  const resizeObserver = useRef<ResizeObserver | null>(null);
  const ref = useRef<T>(null);
  
  // Reset dimensions to defaults
  const reset = useCallback(() => {
    setDimensions({ width: defaultWidth, height: defaultHeight });
  }, [defaultWidth, defaultHeight]);

  useEffect(() => {
    // Create ResizeObserver instance
    const observer = new ResizeObserver(entries => {
      // Since we only observe one element, we can use entries[0]
      if (entries && entries[0]) {
        const entry = entries[0];
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });
    
    resizeObserver.current = observer;
    
    // Start observing the element if ref is available
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    // Cleanup on unmount
    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
    };
  }, []);

  return [ref, dimensions, reset];
}

export default useResizeObserver;
