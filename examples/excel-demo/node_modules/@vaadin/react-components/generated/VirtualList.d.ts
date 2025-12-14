import { VirtualList as VirtualListElement } from "@vaadin/virtual-list/vaadin-virtual-list.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/virtual-list/vaadin-virtual-list.js";
export { VirtualListElement, };
export type VirtualListEventMap = Readonly<{}>;
export type VirtualListProps<T1> = WebComponentProps<VirtualListElement<T1>, VirtualListEventMap>;
export declare const VirtualList: <T1>(props: VirtualListProps<T1> & React.RefAttributes<VirtualListElement<T1>>) => React.ReactElement | null;
//# sourceMappingURL=VirtualList.d.ts.map