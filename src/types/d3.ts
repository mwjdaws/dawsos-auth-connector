
import * as d3 from 'd3';

// Define D3 zoom behavior interface
export interface D3ZoomBehavior<Element extends d3.BaseType, Datum> {
  transform: (selection: d3.Selection<Element, Datum, null, undefined>, transform: d3.ZoomTransform) => void;
  translateBy: (selection: d3.Selection<Element, Datum, null, undefined>, x: number, y: number) => void;
  translateTo: (selection: d3.Selection<Element, Datum, null, undefined>, x: number, y: number) => void;
  scaleBy: (selection: d3.Selection<Element, Datum, null, undefined>, k: number) => void;
  scaleTo: (selection: d3.Selection<Element, Datum, null, undefined>, k: number) => void;
  filter: (filter: (event: d3.D3Event) => boolean) => this;
  wheelDelta: (delta: (event: d3.D3Event, ...args: any[]) => number) => this;
  extent: (extent: [[number, number], [number, number]] | ((node: Element) => [[number, number], [number, number]])) => this;
  scaleExtent: (extent: [number, number]) => this;
  on(typenames: string, callback: null): this;
  on(typenames: string, callback: (event: d3.D3ZoomEvent<Element, Datum>) => void): this;
  // Add any other methods you need from d3.zoom
}

// D3 zoom transform type
export type D3ZoomTransform = d3.ZoomTransform;

// D3 zoom event type
export type D3ZoomEvent<Element extends d3.BaseType, Datum> = d3.D3ZoomEvent<Element, Datum>;

// D3 selection type
export type D3Selection<GElement extends d3.BaseType, Datum, PElement extends d3.BaseType, PDatum> = 
  d3.Selection<GElement, Datum, PElement, PDatum>;

// Type guard for checking if an object is a D3 zoom behavior
export function isD3ZoomBehavior(obj: any): obj is D3ZoomBehavior<any, any> {
  return obj && 
    typeof obj.transform === 'function' && 
    typeof obj.translateBy === 'function' &&
    typeof obj.scaleBy === 'function';
}
