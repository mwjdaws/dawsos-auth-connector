
import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  zoom, 
  zoomIdentity,
  type ZoomBehavior,
  type ZoomTransform,
  select,
  Selection
} from 'd3';

interface UseZoomPanProps {
  width: number;
  height: number;
  initialZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  onZoom?: (zoomLevel: number) => void;
}

interface UseZoomPanReturn {
  transform: ZoomTransform;
  isZooming: boolean;
  setupZoom: (svgElement: SVGSVGElement | null) => void;
  resetZoom: () => void;
  setZoom: (zoomLevel: number) => void;
  panTo: (x: number, y: number, scale?: number) => void;
  centerOnNode: (nodeId: string, nodeElements: SVGGElement[] | null) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  initZoom: () => void;
  zoomMethods: (nodes: any[]) => any;
}

export function useZoomPan({
  width,
  height,
  initialZoom = 1,
  minZoom = 0.25,
  maxZoom = 2,
  onZoom
}: UseZoomPanProps): UseZoomPanReturn {
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown>>();
  const selectionRef = useRef<Selection<SVGSVGElement, unknown, null, undefined>>();
  const [transform, setTransform] = useState<ZoomTransform>(zoomIdentity.scale(initialZoom));
  const [isZooming, setIsZooming] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Setup zoom behavior
  useEffect(() => {
    if (!width || !height) return;

    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([minZoom, maxZoom])
      .on('zoom', (event) => {
        setTransform(event.transform);
        if (onZoom) {
          onZoom(event.transform.k);
        }
      })
      .on('start', () => setIsZooming(true))
      .on('end', () => setIsZooming(false));

    zoomRef.current = zoomBehavior;

    return () => {
      if (selectionRef.current) {
        selectionRef.current.on('.zoom', null);
      }
    };
  }, [width, height, minZoom, maxZoom, onZoom]);

  // Initialize zoom
  const initZoom = useCallback(() => {
    if (!canvasRef.current || !zoomRef.current) return;
    
    // Use canvas for zoom instead of SVG
    const canvas = canvasRef.current;
    const selection = select(canvas as unknown as SVGSVGElement);
    selection.call(zoomRef.current);
    selectionRef.current = selection as unknown as Selection<SVGSVGElement, unknown, null, undefined>;
    
    // Initialize with the starting transform
    selection.call(
      zoomRef.current.transform, 
      zoomIdentity.scale(initialZoom)
    );
  }, [initialZoom]);

  // Setup SVG element selection
  const setupZoom = useCallback((svgElement: SVGSVGElement | null) => {
    if (!svgElement || !zoomRef.current) return;

    const selection = select<SVGSVGElement, unknown>(svgElement);
    selection.call(zoomRef.current);
    selectionRef.current = selection;

    // Initialize with the starting transform
    selection.call(
      zoomRef.current.transform, 
      zoomIdentity.scale(initialZoom)
    );
  }, [initialZoom]);

  // Reset zoom to initial level
  const resetZoom = useCallback(() => {
    if (!selectionRef.current || !zoomRef.current) return;

    selectionRef.current.transition().duration(500).call(
      zoomRef.current.transform,
      zoomIdentity.scale(initialZoom)
    );
  }, [initialZoom]);

  // Zoom to a specific factor
  const setZoom = useCallback((zoomLevel: number) => {
    if (!selectionRef.current || !zoomRef.current) return;

    selectionRef.current.transition().duration(250).call(
      zoomRef.current.transform,
      zoomIdentity.scale(zoomLevel)
    );
  }, []);

  // Pan to a specific point with optional zoom level
  const panTo = useCallback((x: number, y: number, scale?: number) => {
    if (!selectionRef.current || !zoomRef.current) return;

    const targetScale = scale !== undefined ? scale : transform.k;
    const targetX = -x * targetScale + width / 2;
    const targetY = -y * targetScale + height / 2;

    selectionRef.current.transition().duration(500).call(
      zoomRef.current.transform,
      zoomIdentity.translate(targetX, targetY).scale(targetScale)
    );
  }, [transform.k, width, height]);

  // Center the view on a node
  const centerOnNode = useCallback((nodeId: string, nodeElements: SVGGElement[] | null) => {
    if (!nodeElements) return;

    const nodeElement = nodeElements.find(el => el.dataset.id === nodeId);
    if (!nodeElement) return;

    const bbox = nodeElement.getBBox();
    const nodeX = bbox.x + bbox.width / 2;
    const nodeY = bbox.y + bbox.height / 2;

    panTo(nodeX, nodeY);
  }, [panTo]);

  // Expose methods for the component to use
  const zoomMethods = useCallback((nodes: any[]) => {
    return {
      zoomIn: () => {
        const newZoom = Math.min(transform.k * 1.2, maxZoom);
        setZoom(newZoom);
      },
      zoomOut: () => {
        const newZoom = Math.max(transform.k / 1.2, minZoom);
        setZoom(newZoom);
      },
      resetZoom: () => {
        resetZoom();
      },
      centerOnNode: (nodeId: string) => {
        const nodeElement = nodes.find(n => n.id === nodeId);
        if (nodeElement) {
          panTo(nodeElement.x, nodeElement.y);
        }
      }
    };
  }, [transform.k, maxZoom, minZoom, setZoom, resetZoom, panTo]);

  return {
    transform,
    isZooming,
    setupZoom,
    resetZoom,
    setZoom,
    panTo,
    centerOnNode,
    canvasRef,
    initZoom,
    zoomMethods
  };
}
