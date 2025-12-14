import type { EventName } from "@lit/react";
import { SideNav as SideNavElement, type SideNavEventMap as _SideNavEventMap } from "@vaadin/side-nav/vaadin-side-nav.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/side-nav/vaadin-side-nav.js";
export { SideNavElement, };
export type SideNavEventMap = Readonly<{
    onCollapsedChanged: EventName<_SideNavEventMap["collapsed-changed"]>;
}>;
export type SideNavProps = WebComponentProps<SideNavElement, SideNavEventMap>;
export declare const SideNav: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<SideNavElement, Readonly<{
    onCollapsedChanged: EventName<_SideNavEventMap["collapsed-changed"]>;
}>>> & React.RefAttributes<SideNavElement>) => React.ReactElement | null;
//# sourceMappingURL=SideNav.d.ts.map