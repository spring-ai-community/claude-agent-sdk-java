import type { ComponentType, ReactNode } from 'react';
import type { RendererConfig, UseRendererResult } from './useRenderer.js';
import { type ReactSimpleRendererProps, type WebComponentSimpleRenderer } from './useSimpleRenderer.js';
export declare function useSimpleOrChildrenRenderer<O extends HTMLElement>(fnRenderer?: ComponentType<ReactSimpleRendererProps<O>> | null, children?: ReactNode | ComponentType<ReactSimpleRendererProps<O>>, config?: RendererConfig<WebComponentSimpleRenderer<O>>): UseRendererResult<WebComponentSimpleRenderer<O>>;
//# sourceMappingURL=useSimpleOrChildrenRenderer.d.ts.map