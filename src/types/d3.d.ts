
/**
 * Type declarations for d3 modules that don't have proper TypeScript definitions
 */

declare module 'd3-force' {
  export function forceSimulation(): any;
  export function forceManyBody(): any;
  export function forceCenter(x?: number, y?: number): any;
  export function forceCollide(radius?: number): any;
  export function forceLink(links?: any[]): any;
  export function forceX(x?: number): any;
  export function forceY(y?: number): any;
}

declare module 'd3-zoom' {
  export function zoom(): any;
  export const zoomIdentity: any;
}

declare module 'd3-selection' {
  export function select(selector: string | Element): any;
  export function selectAll(selector: string): any;
  export function pointer(event: any, target?: any): [number, number];
}
