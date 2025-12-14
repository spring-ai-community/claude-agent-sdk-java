import { type ComponentType, type ReactElement, type ReactNode, type RefAttributes } from 'react';
import { type GridColumnGroupElement, type GridColumnGroupProps as _GridColumnGroupProps } from './generated/GridColumnGroup.js';
import { type ReactSimpleRendererProps } from './renderers/useSimpleRenderer.js';
import type { OmittedGridColumnHTMLAttributes } from './GridColumn.js';
export * from './generated/GridColumnGroup.js';
export type GridColumnGroupProps = Partial<Omit<_GridColumnGroupProps, 'footerRenderer' | 'header' | 'headerRenderer' | keyof OmittedGridColumnHTMLAttributes<any>>> & Readonly<{
    footer?: ReactNode;
    /**
     * @deprecated Use `footer` instead.
     */
    footerRenderer?: ComponentType<ReactSimpleRendererProps<GridColumnGroupElement>> | null;
    header?: ReactNode;
    /**
     * @deprecated Use `header` instead.
     */
    headerRenderer?: ComponentType<ReactSimpleRendererProps<GridColumnGroupElement>> | null;
}>;
declare const ForwardedGridColumnGroup: (props: GridColumnGroupProps & RefAttributes<GridColumnGroupElement>) => ReactElement | null;
export { ForwardedGridColumnGroup as GridColumnGroup };
//# sourceMappingURL=GridColumnGroup.d.ts.map