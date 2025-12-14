import { type ComponentType, type ReactElement, type ReactNode, type RefAttributes } from 'react';
import type { GridDefaultItem } from './generated/Grid.js';
import { type GridSortColumnElement, type GridSortColumnProps as _GridSortColumnProps } from './generated/GridSortColumn.js';
import type { GridBodyReactRendererProps, GridEdgeReactRendererProps } from './renderers/grid.js';
import type { OmittedGridColumnHTMLAttributes } from './GridColumn.js';
export * from './generated/GridSortColumn.js';
export type GridSortColumnProps<TItem> = Partial<Omit<_GridSortColumnProps<TItem>, 'children' | 'footerRenderer' | 'headerRenderer' | 'renderer' | keyof OmittedGridColumnHTMLAttributes<TItem>>> & Readonly<{
    children?: ComponentType<GridBodyReactRendererProps<TItem>> | null;
    footer?: ReactNode;
    /**
     * @deprecated Use `footer` instead.
     */
    footerRenderer?: ComponentType<GridEdgeReactRendererProps<TItem>> | null;
    renderer?: ComponentType<GridBodyReactRendererProps<TItem>> | null;
}>;
declare const ForwardedGridSortColumn: <TItem = GridDefaultItem>(props: GridSortColumnProps<TItem> & RefAttributes<GridSortColumnElement<TItem>>) => ReactElement | null;
export { ForwardedGridSortColumn as GridSortColumn };
//# sourceMappingURL=GridSortColumn.d.ts.map