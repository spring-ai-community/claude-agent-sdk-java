import { type ComponentType, type ReactElement, type RefAttributes } from 'react';
import { type GridDefaultItem, type GridElement, type GridProps as _GridProps } from './generated/Grid.js';
import type { GridRowDetailsReactRendererProps } from './renderers/grid.js';
export * from './generated/Grid.js';
export type GridProps<TItem> = Partial<Omit<_GridProps<TItem>, 'rowDetailsRenderer'>> & Readonly<{
    rowDetailsRenderer?: ComponentType<GridRowDetailsReactRendererProps<TItem>> | null;
}>;
declare const ForwardedGrid: <TItem = GridDefaultItem>(props: GridProps<TItem> & RefAttributes<GridElement<TItem>>) => ReactElement | null;
export { ForwardedGrid as Grid };
//# sourceMappingURL=Grid.d.ts.map