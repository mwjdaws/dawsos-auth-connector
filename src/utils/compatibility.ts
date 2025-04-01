
/**
 * Utility functions for handling type compatibility issues
 */

// String type conversion
export function ensureString(value: any, defaultValue: string = ''): string {
  if (value === null || value === undefined) return defaultValue;
  return String(value);
}

// Number type conversion
export function ensureNumber(value: any, defaultValue: number = 0): number {
  if (value === null || value === undefined) return defaultValue;
  const parsed = typeof value === 'number' ? value : Number(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

// Boolean type conversion
export function ensureBoolean(value: any, defaultValue: boolean = false): boolean {
  if (value === null || value === undefined) return defaultValue;
  return Boolean(value);
}

// Handle nullable vs undefinable conflicts
export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

export function undefinedToNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}

// Graph data related utilities
export function ensureValidZoom(zoom: number | undefined): number {
  if (zoom === undefined || zoom === null || isNaN(zoom)) return 1;
  return Math.max(0.1, Math.min(3, zoom));
}

export function sanitizeGraphData(data: any): { nodes: any[]; links: any[] } {
  if (!data) return { nodes: [], links: [] };
  
  return {
    nodes: Array.isArray(data.nodes) ? data.nodes : [],
    links: Array.isArray(data.links) ? data.links : []
  };
}

export function ensureValidGraphData(data: any): { nodes: any[]; links: any[] } {
  const sanitized = sanitizeGraphData(data);
  
  return {
    nodes: sanitized.nodes.map(node => ({
      id: ensureString(node.id),
      name: ensureString(node.name || node.title),
      title: ensureString(node.title || node.name),
      color: ensureString(node.color, '#6366f1'),
      type: ensureString(node.type, 'default')
    })),
    links: sanitized.links.map(link => ({
      source: typeof link.source === 'object' ? ensureString(link.source.id) : ensureString(link.source),
      target: typeof link.target === 'object' ? ensureString(link.target.id) : ensureString(link.target),
      type: ensureString(link.type, 'default')
    }))
  };
}

// Create safe props for graph components
export function createSafeGraphProps(props: any) {
  const {
    width = 800,
    height = 600,
    zoom = 1,
    highlightedNodeId = null,
    onNodeClick,
    onLinkClick,
    ...rest
  } = props;
  
  // Create safe handlers that won't break if undefined
  const safeNodeClickHandler = onNodeClick ? 
    (nodeId: string) => onNodeClick(nodeId) : 
    (nodeId: string) => console.log(`Node clicked: ${nodeId}`);
    
  const safeLinkClickHandler = onLinkClick ? 
    (source: string, target: string) => onLinkClick(source, target) : 
    (source: string, target: string) => console.log(`Link clicked: ${source} -> ${target}`);
  
  return {
    width: ensureNumber(width),
    height: ensureNumber(height),
    zoom: ensureValidZoom(zoom),
    highlightedNodeId,
    onNodeClick: safeNodeClickHandler,
    onLinkClick: safeLinkClickHandler,
    ...rest
  };
}

// Error handling compatibility layer
export function convertErrorOptions(options: any = {}): any {
  const { 
    level, 
    context, 
    silent, 
    reportToAnalytics, 
    showToast,
    toastTitle, 
    technical, 
    category,
    ...rest 
  } = options;
  
  // Return compatible error options structure
  return {
    level: level || 'error',
    context: context || {},
    silent: silent === true,
    reportToAnalytics: reportToAnalytics !== false,
    showToast: showToast !== false,
    ...(toastTitle ? { toastTitle } : {}),
    ...rest
  };
}

// Ensure compatibility with use-toast hook
export type ToastActionElement = React.ReactElement<unknown, string | React.JSXElementConstructor<any>>;

export interface Toast {
  id: string;
  title?: string;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
}

export const compatibleToast = (props: Partial<Toast> & { id?: string }) => {
  return {
    id: props.id || String(Date.now()),
    title: props.title,
    description: props.description,
    action: props.action,
    variant: props.variant || "default"
  };
};
