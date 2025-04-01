
import { useRef, useState, useEffect } from 'react';

/**
 * Hook that observes an element's size and reports changes
 * @returns [ref, dimensions] - A ref to attach to the observed element and the current dimensions
 */
export function useResizeObserver<T extends HTMLElement>(): [
  React.RefObject<T>,
  { width: number | null; height: number | null }
] {
  const ref = useRef<T>(null);
  const [dimensions, setDimensions] = useState<{ width: number | null; height: number | null }>({
    width: null,
    height: null,
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    // Initialize with current dimensions
    setDimensions({
      width: element.offsetWidth,
      height: element.offsetHeight,
    });

    // Create and configure the ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      if (!Array.isArray(entries) || !entries.length) {
        return;
      }

      const entry = entries[0];
      const { width, height } = entry.contentRect;

      setDimensions({
        width,
        height,
      });
    });

    // Start observing
    resizeObserver.observe(element);

    // Cleanup function
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return [ref, dimensions];
}

export default useResizeObserver;
