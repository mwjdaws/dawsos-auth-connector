
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

  export type ForceLink<NodeDatum extends SimulationNodeDatum, 
                      LinkDatum extends SimulationLinkDatum<NodeDatum>> = 
    (alpha: number) => void;

  export type ForceCenter<NodeDatum extends SimulationNodeDatum> = 
    (alpha: number) => void;

  export type ForceCharge<NodeDatum extends SimulationNodeDatum> = 
    (alpha: number) => void;

  export type ForceCollide<NodeDatum extends SimulationNodeDatum> = 
    (alpha: number) => void;

  export type ForceMany<NodeDatum extends SimulationNodeDatum> = 
    (alpha: number) => void;

  export type ForceX<NodeDatum extends SimulationNodeDatum> = 
    (alpha: number) => void;

  export type ForceY<NodeDatum extends SimulationNodeDatum> = 
    (alpha: number) => void;

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
    force(name: string): Force<NodeDatum, LinkDatum> | undefined;
    force(name: string, force: Force<NodeDatum, LinkDatum> | null): this;
    find(x: number, y: number, radius?: number): NodeDatum | undefined;
    on(typenames: string, listener: (event: Event) => void): this;
  }

  export interface Force<NodeDatum extends SimulationNodeDatum,
                        LinkDatum extends SimulationLinkDatum<NodeDatum>> {
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
