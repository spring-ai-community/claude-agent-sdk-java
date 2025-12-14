import type { EventName } from "@lit/react";
import { Tabs as TabsElement, type TabsEventMap as _TabsEventMap } from "@vaadin/tabs/vaadin-tabs.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/tabs/vaadin-tabs.js";
export { TabsElement, };
export type TabsEventMap = Readonly<{
    onSelectedChanged: EventName<_TabsEventMap["selected-changed"]>;
    onItemsChanged: EventName<_TabsEventMap["items-changed"]>;
}>;
export type TabsProps = WebComponentProps<TabsElement, TabsEventMap>;
export declare const Tabs: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<TabsElement, Readonly<{
    onSelectedChanged: EventName<_TabsEventMap["selected-changed"]>;
    onItemsChanged: EventName<_TabsEventMap["items-changed"]>;
}>>> & React.RefAttributes<TabsElement>) => React.ReactElement | null;
//# sourceMappingURL=Tabs.d.ts.map