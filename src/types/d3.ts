
/**
 * Custom D3 type definitions to fix TypeScript errors
 */

import * as d3 from 'd3';

// Properly define the ZoomTransform object properties based on D3.js v7
export interface D3ZoomTransform {
  k: number; // scale factor
  x: number; // x translation
  y: number; // y translation
  apply(point: [number, number]): [number, number];
  applyX(x: number): number;
  applyY(y: number): number;
  invert(point: [number, number]): [number, number];
  invertX(x: number): number;
  invertY(y: number): number;
  rescaleX<Range extends d3.ScaleContinuousNumeric<number, number>>(
    xScale: Range
  ): Range;
  rescaleY<Range extends d3.ScaleContinuousNumeric<number, number>>(
    yScale: Range
  ): Range;
  toString(): string;
}

// Define the ZoomBehavior interface
export interface D3ZoomBehavior<Element extends d3.BaseType, Datum> {
  (selection: d3.Selection<Element, Datum, null, undefined>): void;
  transform(
    selection: d3.Selection<Element, Datum, null, undefined>,
    transform: d3.ZoomTransform
  ): void;
  translateBy(
    selection: d3.Selection<Element, Datum, null, undefined>,
    x: number,
    y: number
  ): void;
  translateTo(
    selection: d3.Selection<Element, Datum, null, undefined>,
    x: number,
    y: number
  ): void;
  scaleBy(
    selection: d3.Selection<Element, Datum, null, undefined>,
    k: number
  ): void;
  scaleTo(
    selection: d3.Selection<Element, Datum, null, undefined>,
    k: number
  ): void;
  filter(filter: null | ((event: d3.D3ZoomEvent<Element, Datum>) => boolean)): this;
  touchable(touchable: null | boolean | ((this: Element, event: any, d: Datum) => boolean)): this;
  wheelDelta(delta: null | ((event: d3.D3ZoomEvent<Element, Datum>) => number)): this;
  extent(
    extent: null | [[number, number], [number, number]] | ((this: Element, datum: Datum) => [[number, number], [number, number]])
  ): this;
  scaleExtent(extent: [number, number]): this;
  translateExtent(extent: [[number, number], [number, number]]): this;
  clickDistance(distance: number): this;
  duration(duration: number): this;
  interpolate(interpolate: (a: number, b: number) => (t: number) => number): this;
  on(typenames: string, listener: null | ((event: d3.D3ZoomEvent<Element, Datum>, d: Datum) => void)): this;
}

// Extending the d3 namespace to support our custom types
declare module 'd3' {
  export interface ZoomTransform extends D3ZoomTransform {}
}
