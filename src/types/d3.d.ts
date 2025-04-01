
// Type definitions for D3 visualization libraries

declare module 'd3-force' {
  export interface SimulationNodeDatum {
    index?: number;
    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
    fx?: number | null;
    fy?: number | null;
  }

  export interface SimulationLinkDatum<NodeDatum extends SimulationNodeDatum> {
    source: NodeDatum | string | number;
    target: NodeDatum | string | number;
    index?: number;
  }

  export interface ForceLink<NodeDatum extends SimulationNodeDatum, 
                          LinkDatum extends SimulationLinkDatum<NodeDatum>> {
    (alpha: number): void;
    id(id: (node: NodeDatum) => string): this;
    strength(strength: number | ((link: LinkDatum) => number)): this;
    distance(distance: number | ((link: LinkDatum) => number)): this;
    links(): LinkDatum[];
    links(links: LinkDatum[]): this;
    iterations(iterations: number): this;
  }

  export interface ForceCenter<NodeDatum extends SimulationNodeDatum> {
    (alpha: number): void;
    x(x: number): this;
    y(y: number): this;
  }

  export interface ForceMany<NodeDatum extends SimulationNodeDatum> {
    (alpha: number): void;
    strength(strength: number | ((node: NodeDatum, i: number) => number)): this;
    distanceMin(min: number): this;
    distanceMax(max: number): this;
    theta(theta: number): this;
  }

  export interface ForceCollide<NodeDatum extends SimulationNodeDatum> {
    (alpha: number): void;
    radius(radius: number | ((node: NodeDatum) => number)): this;
    strength(strength: number): this;
    iterations(iterations: number): this;
  }

  export interface ForceX<NodeDatum extends SimulationNodeDatum> {
    (alpha: number): void;
    strength(strength: number | ((node: NodeDatum) => number)): this;
    x(x: number | ((node: NodeDatum) => number)): this;
  }

  export interface ForceY<NodeDatum extends SimulationNodeDatum> {
    (alpha: number): void;
    strength(strength: number | ((node: NodeDatum) => number)): this;
    y(y: number | ((node: NodeDatum) => number)): this;
  }

  export interface Simulation<NodeDatum extends SimulationNodeDatum,
                            LinkDatum extends SimulationLinkDatum<NodeDatum>> {
    restart(): this;
    stop(): this;
    tick(iterations?: number): this;
    nodes(): NodeDatum[];
    nodes(nodes: NodeDatum[]): this;
    alpha(): number;
    alpha(alpha: number): this;
    alphaMin(): number;
    alphaMin(min: number): this;
    alphaDecay(): number;
    alphaDecay(decay: number): this;
    alphaTarget(): number;
    alphaTarget(target: number): this;
    velocityDecay(): number;
    velocityDecay(decay: number): this;
    force<T extends Force<NodeDatum, LinkDatum>>(name: string): T | undefined;
    force<T extends Force<NodeDatum, LinkDatum>>(name: string, force: T | null): this;
    find(x: number, y: number, radius?: number): NodeDatum | undefined;
    on(typenames: string, listener: (event: any) => void): this;
  }

  export type Force<NodeDatum extends SimulationNodeDatum,
                   LinkDatum extends SimulationLinkDatum<NodeDatum>> = {
    (alpha: number): void;
    initialize?(nodes: NodeDatum[]): void;
  }

  export function forceSimulation<NodeDatum extends SimulationNodeDatum = SimulationNodeDatum>(
    nodes?: NodeDatum[]
  ): Simulation<NodeDatum, SimulationLinkDatum<NodeDatum>>;

  export function forceCenter<NodeDatum extends SimulationNodeDatum>(
    x?: number,
    y?: number
  ): ForceCenter<NodeDatum>;

  export function forceCollide<NodeDatum extends SimulationNodeDatum>(
    radius?: number | ((d: NodeDatum) => number)
  ): ForceCollide<NodeDatum>;

  export function forceLink<NodeDatum extends SimulationNodeDatum,
                          LinkDatum extends SimulationLinkDatum<NodeDatum>>(
    links?: LinkDatum[]
  ): ForceLink<NodeDatum, LinkDatum>;

  export function forceManyBody<NodeDatum extends SimulationNodeDatum>(): ForceMany<NodeDatum>;

  export function forceX<NodeDatum extends SimulationNodeDatum>(
    x?: number | ((d: NodeDatum) => number)
  ): ForceX<NodeDatum>;

  export function forceY<NodeDatum extends SimulationNodeDatum>(
    y?: number | ((d: NodeDatum) => number)
  ): ForceY<NodeDatum>;
}

declare module 'd3-zoom' {
  import { Selection } from 'd3-selection';

  export interface ZoomedElementBaseType extends Element {
    __zoom?: ZoomTransform;
  }

  export interface ZoomTransform {
    x: number;
    y: number;
    k: number;
    apply(point: [number, number]): [number, number];
    applyX(x: number): number;
    applyY(y: number): number;
    invert(point: [number, number]): [number, number];
    invertX(x: number): number;
    invertY(y: number): number;
    rescaleX<Range>(x: Range): Range;
    rescaleY<Range>(y: Range): Range;
    toString(): string;
  }

  export interface D3ZoomEvent<GElement extends ZoomedElementBaseType, Datum> {
    type: string;
    target: Zoom<GElement, Datum>;
    transform: ZoomTransform;
    sourceEvent: any;
  }

  export interface Zoom<GElement extends ZoomedElementBaseType, Datum> {
    (selection: Selection<GElement, Datum, any, any>): void;
    transform(selection: Selection<GElement, Datum, any, any>, transform: ZoomTransform): void;
    translateBy(selection: Selection<GElement, Datum, any, any>, x: number, y: number): void;
    translateTo(selection: Selection<GElement, Datum, any, any>, x: number, y: number): void;
    scaleBy(selection: Selection<GElement, Datum, any, any>, k: number): void;
    scaleTo(selection: Selection<GElement, Datum, any, any>, k: number): void;
    filter(filter: (event: any, d: Datum) => boolean): this;
    extent(extent: [[number, number], [number, number]]): this;
    scaleExtent(extent: [number, number]): this;
    translateExtent(extent: [[number, number], [number, number]]): this;
    clickDistance(distance: number): this;
    duration(duration: number): this;
    interpolate(interpolate: (a: number, b: number) => (t: number) => number): this;
    on(typenames: string, listener: (event: D3ZoomEvent<GElement, Datum>, d: Datum) => void): this;
  }

  export function zoom<GElement extends ZoomedElementBaseType, Datum>(): Zoom<GElement, Datum>;

  export var zoomIdentity: ZoomTransform;
}

declare module 'd3-selection' {
  export interface Selection<GElement extends Element, Datum, PElement extends Element | null, PDatum> {
    select<DescElement extends Element>(selector: string): Selection<DescElement, Datum, PElement, PDatum>;
    selectAll<DescElement extends Element, NewDatum>(selector: string): Selection<DescElement, NewDatum, GElement, Datum>;
    attr(name: string, value: any): this;
    classed(names: string, value: boolean): this;
    style(name: string, value: any, priority?: string): this;
    property(name: string, value: any): this;
    text(value: any): this;
    html(value: any): this;
    call<T extends Selection<GElement, Datum, PElement, PDatum>>(callback: (selection: T, ...args: any[]) => void, ...args: any[]): this;
    on(typenames: string, listener: (event: any, d: Datum) => void): this;
    transition(): any; // Simplified definition for transition
  }

  export function select<GElement extends Element>(selector: string | GElement): Selection<GElement, any, null, undefined>;
}
