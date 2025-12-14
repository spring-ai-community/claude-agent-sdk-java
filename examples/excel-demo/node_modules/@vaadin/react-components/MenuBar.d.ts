import { type ReactElement, type RefAttributes } from 'react';
import { type MenuBarElement, type MenuBarProps as _MenuBarProps, type MenuBarItem as _MenuBarItem, type SubMenuItem as _SubMenuItem } from './generated/MenuBar.js';
export * from './generated/MenuBar.js';
export type SubMenuItem<TItemData extends object = object> = Omit<_SubMenuItem<TItemData>, 'component' | 'children'> & {
    component?: ReactElement | string;
    children?: Array<SubMenuItem<TItemData>>;
};
export type MenuBarItem<TItemData extends object = object> = Omit<_MenuBarItem<TItemData>, 'component' | 'children'> & {
    component?: ReactElement | string;
    children?: Array<SubMenuItem<TItemData>>;
};
export type MenuBarItemSelectedEvent<TItem extends MenuBarItem = MenuBarItem> = CustomEvent<{
    value: MenuBarItem<TItem>;
}>;
export type MenuBarProps<TItem extends MenuBarItem = MenuBarItem> = Partial<Omit<_MenuBarProps, 'items' | 'onItemSelected'>> & Readonly<{
    items?: Array<TItem>;
    onItemSelected?: (event: MenuBarItemSelectedEvent<TItem>) => void;
}>;
declare const ForwardedMenuBar: <TItem extends MenuBarItem = MenuBarItem>(props: MenuBarProps<TItem> & RefAttributes<MenuBarElement>) => ReactElement | null;
export { ForwardedMenuBar as MenuBar };
//# sourceMappingURL=MenuBar.d.ts.map