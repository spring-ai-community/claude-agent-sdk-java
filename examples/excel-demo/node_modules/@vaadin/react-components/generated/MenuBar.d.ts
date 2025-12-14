import type { EventName } from "@lit/react";
import { MenuBar as MenuBarElement, type MenuBarEventMap as _MenuBarEventMap } from "@vaadin/menu-bar/vaadin-menu-bar.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/menu-bar/vaadin-menu-bar.js";
export { MenuBarElement, };
export type MenuBarEventMap = Readonly<{
    onItemSelected: EventName<_MenuBarEventMap["item-selected"]>;
}>;
export type MenuBarProps = WebComponentProps<MenuBarElement, MenuBarEventMap>;
export declare const MenuBar: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<MenuBarElement<import("@vaadin/menu-bar/vaadin-menu-bar.js").MenuBarItem>, Readonly<{
    onItemSelected: EventName<_MenuBarEventMap["item-selected"]>;
}>>> & React.RefAttributes<MenuBarElement<import("@vaadin/menu-bar/vaadin-menu-bar.js").MenuBarItem>>) => React.ReactElement | null;
//# sourceMappingURL=MenuBar.d.ts.map