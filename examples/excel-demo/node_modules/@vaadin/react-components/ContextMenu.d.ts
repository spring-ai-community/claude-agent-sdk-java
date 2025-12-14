import { type ComponentType, type ReactElement, type RefAttributes } from 'react';
import { type ContextMenuRendererContext, type ContextMenuElement, type ContextMenuProps as _ContextMenuProps, type ContextMenuItem as _ContextMenuItem } from './generated/ContextMenu.js';
import { type ReactContextRendererProps } from './renderers/useContextRenderer.js';
export * from './generated/ContextMenu.js';
export type ContextMenuReactRendererProps = ReactContextRendererProps<ContextMenuRendererContext, ContextMenuElement>;
export type ContextMenuItem<TItemData extends object = object> = Omit<_ContextMenuItem<TItemData>, 'component' | 'children'> & {
    component?: ReactElement | string;
    children?: Array<ContextMenuItem<TItemData>>;
};
export type ContextMenuItemSelectedEvent<TItem extends ContextMenuItem = ContextMenuItem> = CustomEvent<{
    value: ContextMenuItem<TItem>;
}>;
export type ContextMenuProps<TItem extends ContextMenuItem = ContextMenuItem> = Partial<Omit<_ContextMenuProps, 'opened' | 'renderer' | 'items' | 'onItemSelected'>> & Readonly<{
    renderer?: ComponentType<ContextMenuReactRendererProps> | null;
    items?: Array<TItem>;
    onItemSelected?: (event: ContextMenuItemSelectedEvent<TItem>) => void;
}>;
declare const ForwardedContextMenu: <TItem extends ContextMenuItem = ContextMenuItem>(props: ContextMenuProps<TItem> & RefAttributes<ContextMenuElement>) => ReactElement | null;
export { ForwardedContextMenu as ContextMenu };
//# sourceMappingURL=ContextMenu.d.ts.map