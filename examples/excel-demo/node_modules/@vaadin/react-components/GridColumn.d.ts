import { type ComponentType, type ReactElement, type ReactNode, type RefAttributes } from 'react';
import type { GridDefaultItem } from './generated/Grid.js';
import { type GridColumnElement, type GridColumnProps as _GridColumnProps } from './generated/GridColumn.js';
import type { GridBodyReactRendererProps, GridEdgeReactRendererProps } from './renderers/grid.js';
export * from './generated/GridColumn.js';
export type OmittedGridColumnHTMLAttributes<TItem> = Omit<React.HTMLAttributes<GridColumnElement<TItem>>, 'hidden' | 'id' | 'className' | 'dangerouslySetInnerHTML' | 'slot' | 'children' | 'title'>;
export type GridColumnProps<TItem> = Partial<Omit<_GridColumnProps<TItem>, 'children' | 'footerRenderer' | 'header' | 'headerRenderer' | 'renderer' | keyof OmittedGridColumnHTMLAttributes<TItem>>> & Readonly<{
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
declare const ForwardedGridColumn: <TItem = GridDefaultItem>(props: GridColumnProps<TItem> & RefAttributes<GridColumnElement<TItem>>) => ReactElement | null;
export { ForwardedGridColumn as GridColumn };
//# sourceMappingURL=GridColumn.d.ts.map