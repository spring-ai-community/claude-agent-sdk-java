import type { EventName } from "@lit/react";
import { SideNavItem as SideNavItemElement, type SideNavItemEventMap as _SideNavItemEventMap } from "@vaadin/side-nav/vaadin-side-nav-item.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/side-nav/vaadin-side-nav-item.js";
export { SideNavItemElement, };
export type SideNavItemEventMap = Readonly<{
    onExpandedChanged: EventName<_SideNavItemEventMap["expanded-changed"]>;
}>;
export type SideNavItemProps = WebComponentProps<SideNavItemElement, SideNavItemEventMap>;
export declare const SideNavItem: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<SideNavItemElement, Readonly<{
    onExpandedChanged: EventName<_SideNavItemEventMap["expanded-changed"]>;
}>>> & React.RefAttributes<SideNavItemElement>) => React.ReactElement | null;
//# sourceMappingURL=SideNavItem.d.ts.map