import type { EventName } from "@lit/react";
import { ContextMenu as ContextMenuElement, type ContextMenuEventMap as _ContextMenuEventMap } from "@vaadin/context-menu/vaadin-context-menu.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/context-menu/vaadin-context-menu.js";
export { ContextMenuElement, };
export type ContextMenuEventMap = Readonly<{
    onItemSelected: EventName<_ContextMenuEventMap["item-selected"]>;
    onOpenedChanged: EventName<_ContextMenuEventMap["opened-changed"]>;
}>;
export type ContextMenuProps = WebComponentProps<ContextMenuElement, ContextMenuEventMap>;
export declare const ContextMenu: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<ContextMenuElement<import("@vaadin/context-menu/vaadin-context-menu.js").ContextMenuItem>, Readonly<{
    onItemSelected: EventName<_ContextMenuEventMap["item-selected"]>;
    onOpenedChanged: EventName<_ContextMenuEventMap["opened-changed"]>;
}>>> & React.RefAttributes<ContextMenuElement<import("@vaadin/context-menu/vaadin-context-menu.js").ContextMenuItem>>) => React.ReactElement | null;
//# sourceMappingURL=ContextMenu.d.ts.map