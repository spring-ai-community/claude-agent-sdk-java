import { type ComponentType, type PropsWithChildren, type ReactElement, type ReactNode } from 'react';
import type { Slice, WebComponentRenderer } from './renderer.js';
export type UseRendererResult<W extends WebComponentRenderer> = readonly [
    portals?: ReadonlyArray<ReactElement | null>,
    renderer?: W
];
export type RendererConfig<W extends WebComponentRenderer> = {
    renderMode?: 'default' | 'sync' | 'microtask';
    shouldRenderPortal?(root: HTMLElement, ...args: Slice<Parameters<W>, 1>): boolean;
};
export declare function useRenderer<P extends {}, W extends WebComponentRenderer>(node: ReactNode, convert?: (props: Slice<Parameters<W>, 1>) => PropsWithChildren<P>, config?: RendererConfig<W>): UseRendererResult<W>;
export declare function useRenderer<P extends {}, W extends WebComponentRenderer>(reactRenderer: ComponentType<P> | null | undefined, convert: (props: Slice<Parameters<W>, 1>) => PropsWithChildren<P>, config?: RendererConfig<W>): UseRendererResult<W>;
//# sourceMappingURL=useRenderer.d.ts.map