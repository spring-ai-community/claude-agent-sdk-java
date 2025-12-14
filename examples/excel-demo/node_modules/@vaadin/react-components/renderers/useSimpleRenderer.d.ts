import type { ComponentType } from 'react';
import { type RendererConfig, type UseRendererResult } from './useRenderer.js';
export type ReactSimpleRendererProps<O extends HTMLElement> = Readonly<{
    original: O;
}>;
export type WebComponentSimpleRenderer<O extends HTMLElement> = (root: HTMLElement, original: O) => void;
export declare function useSimpleRenderer<O extends HTMLElement>(reactRenderer?: ComponentType<ReactSimpleRendererProps<O>> | null, config?: RendererConfig<WebComponentSimpleRenderer<O>>): UseRendererResult<WebComponentSimpleRenderer<O>>;
//# sourceMappingURL=useSimpleRenderer.d.ts.map