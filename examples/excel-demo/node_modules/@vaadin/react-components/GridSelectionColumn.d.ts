import { type ComponentType, type ReactElement, type ReactNode, type RefAttributes } from 'react';
import type { GridDefaultItem } from './generated/Grid.js';
import { type GridSelectionColumnElement, type GridSelectionColumnProps as _GridSelectionColumnProps } from './generated/GridSelectionColumn.js';
import type { GridBodyReactRendererProps, GridEdgeReactRendererProps } from './renderers/grid.js';
import type { OmittedGridColumnHTMLAttributes } from './GridColumn.js';
export * from './generated/GridSelectionColumn.js';
export type GridSelectionColumnProps<TItem> = Partial<Omit<_GridSelectionColumnProps<TItem>, 'children' | 'footerRenderer' | 'headerRenderer' | 'renderer' | 'header' | keyof OmittedGridColumnHTMLAttributes<TItem>>> & Readonly<{
    children?: ComponentType<GridBodyReactRendererProps<TItem>> | null;
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
    renderer?: ComponentType<GridBodyReactRendererProps<TItem>> | null;
}>;
declare const ForwardedGridSelectionColumn: <TItem = GridDefaultItem>(props: GridSelectionColumnProps<TItem> & RefAttributes<GridSelectionColumnElement<TItem>>) => ReactElement | null;
export { ForwardedGridSelectionColumn as GridSelectionColumn };
//# sourceMappingURL=GridSelectionColumn.d.ts.map