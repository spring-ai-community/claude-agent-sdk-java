import { type ComponentType, type ReactElement, type ReactNode, type RefAttributes } from 'react';
import type { GridDefaultItem } from './generated/Grid.js';
import { type GridFilterColumnElement, type GridFilterColumnProps as _GridFilterColumnProps } from './generated/GridFilterColumn.js';
import type { GridBodyReactRendererProps, GridEdgeReactRendererProps } from './renderers/grid.js';
import type { OmittedGridColumnHTMLAttributes } from './GridColumn.js';
export * from './generated/GridFilterColumn.js';
export type GridFilterColumnProps<TItem> = Partial<Omit<_GridFilterColumnProps<TItem>, 'children' | 'footerRenderer' | 'headerRenderer' | 'renderer' | keyof OmittedGridColumnHTMLAttributes<TItem>>> & Readonly<{
    children?: ComponentType<GridBodyReactRendererProps<TItem>> | null;
    footer?: ReactNode;
    /**
     * @deprecated Use `footer` instead.
     */
    footerRenderer?: ComponentType<GridEdgeReactRendererProps<TItem>> | null;
    renderer?: ComponentType<GridBodyReactRendererProps<TItem>> | null;
}>;
declare const ForwardedGridFilterColumn: <TItem = GridDefaultItem>(props: GridFilterColumnProps<TItem> & RefAttributes<GridFilterColumnElement<TItem>>) => ReactElement | null;
export { ForwardedGridFilterColumn as GridFilterColumn };
//# sourceMappingURL=GridFilterColumn.d.ts.map