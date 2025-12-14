import type { EventName } from "@lit/react";
import { TabSheet as TabSheetElement, type TabSheetEventMap as _TabSheetEventMap } from "@vaadin/tabsheet/vaadin-tabsheet.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/tabsheet/vaadin-tabsheet.js";
export { TabSheetElement, };
export type TabSheetEventMap = Readonly<{
    onItemsChanged: EventName<_TabSheetEventMap["items-changed"]>;
    onSelectedChanged: EventName<_TabSheetEventMap["selected-changed"]>;
}>;
export type TabSheetProps = WebComponentProps<TabSheetElement, TabSheetEventMap>;
export declare const TabSheet: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<TabSheetElement, Readonly<{
    onItemsChanged: EventName<_TabSheetEventMap["items-changed"]>;
    onSelectedChanged: EventName<_TabSheetEventMap["selected-changed"]>;
}>>> & React.RefAttributes<TabSheetElement>) => React.ReactElement | null;
//# sourceMappingURL=TabSheet.d.ts.map