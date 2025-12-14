import type { EventName } from "@lit/react";
import { ListBox as ListBoxElement, type ListBoxEventMap as _ListBoxEventMap } from "@vaadin/list-box/vaadin-list-box.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/list-box/vaadin-list-box.js";
export { ListBoxElement, };
export type ListBoxEventMap = Readonly<{
    onSelectedChanged: EventName<_ListBoxEventMap["selected-changed"]>;
    onSelectedValuesChanged: EventName<_ListBoxEventMap["selected-values-changed"]>;
    onItemsChanged: EventName<_ListBoxEventMap["items-changed"]>;
}>;
export type ListBoxProps = WebComponentProps<ListBoxElement, ListBoxEventMap>;
export declare const ListBox: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<ListBoxElement, Readonly<{
    onSelectedChanged: EventName<_ListBoxEventMap["selected-changed"]>;
    onSelectedValuesChanged: EventName<_ListBoxEventMap["selected-values-changed"]>;
    onItemsChanged: EventName<_ListBoxEventMap["items-changed"]>;
}>>> & React.RefAttributes<ListBoxElement>) => React.ReactElement | null;
//# sourceMappingURL=ListBox.d.ts.map