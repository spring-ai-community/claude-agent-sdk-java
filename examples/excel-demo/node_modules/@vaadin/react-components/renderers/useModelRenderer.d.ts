import type { ComponentType } from 'react';
import type { Slice } from './renderer.js';
import { type RendererConfig, type UseRendererResult } from './useRenderer.js';
export type Model<I> = Readonly<{
    item: I;
}>;
export type ReactModelRendererProps<I, M extends Model<I>, O extends HTMLElement> = Readonly<{
    item: I;
    model: M;
    original: O;
}>;
export type WebComponentModelRenderer<I, M extends Model<I>, O extends HTMLElement> = (root: HTMLElement, original: O, model: M) => void;
export declare function convertModelRendererArgs<I, M extends Model<I>, O extends HTMLElement>([original, model]: Slice<Parameters<WebComponentModelRenderer<I, M, O>>, 1>): ReactModelRendererProps<I, M, O>;
export declare function useModelRenderer<I, M extends Model<I>, O extends HTMLElement>(reactRenderer?: ComponentType<ReactModelRendererProps<I, M, O>> | null, config?: RendererConfig<WebComponentModelRenderer<I, M, O>>): UseRendererResult<WebComponentModelRenderer<I, M, O>>;
//# sourceMappingURL=useModelRenderer.d.ts.map