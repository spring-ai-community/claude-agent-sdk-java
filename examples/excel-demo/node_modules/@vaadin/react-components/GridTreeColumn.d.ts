import { type ComponentType, type ReactElement, type ReactNode, type RefAttributes } from 'react';
import type { GridDefaultItem } from './generated/Grid.js';
import { GridTreeColumnElement, type GridTreeColumnProps as _GridTreeColumnProps } from './generated/GridTreeColumn.js';
import type { GridEdgeReactRendererProps } from './renderers/grid.js';
import type { OmittedGridColumnHTMLAttributes } from './GridColumn.js';
export * from './generated/GridTreeColumn.js';
export type GridTreeColumnProps<TItem> = Partial<Omit<_GridTreeColumnProps<TItem>, 'children' | 'footerRenderer' | 'header' | 'headerRenderer' | 'renderer' | keyof OmittedGridColumnHTMLAttributes<TItem>>> & Readonly<{
    footer?: ReactNode;
    /**
     * @deprecated Use `footer` instead.
     */
    footerRenderer?: ComponentType<GridEdgeReactRendererProps<TItem>> | null;
    header?: ReactNode;
    /**
     * @deprecated Use `header` instead.
     */
    headerRenderer?: ComponentType<GridEdgeReactRendererProps<TItem>> | null;
}>;
declare const ForwardedGridTreeColumn: <TItem = GridDefaultItem>(props: GridTreeColumnProps<TItem> & RefAttributes<GridTreeColumnElement<TItem>>) => ReactElement | null;
export { ForwardedGridTreeColumn as GridTreeColumn };
//# sourceMappingURL=GridTreeColumn.d.ts.map