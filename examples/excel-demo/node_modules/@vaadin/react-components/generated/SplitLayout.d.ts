import type { EventName } from "@lit/react";
import { SplitLayout as SplitLayoutElement, type SplitLayoutEventMap as _SplitLayoutEventMap } from "@vaadin/split-layout/vaadin-split-layout.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/split-layout/vaadin-split-layout.js";
export { SplitLayoutElement, };
export type SplitLayoutEventMap = Readonly<{
    onSplitterDragend: EventName<_SplitLayoutEventMap["splitter-dragend"]>;
}>;
export type SplitLayoutProps = WebComponentProps<SplitLayoutElement, SplitLayoutEventMap>;
export declare const SplitLayout: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<SplitLayoutElement, Readonly<{
    onSplitterDragend: EventName<_SplitLayoutEventMap["splitter-dragend"]>;
}>>> & React.RefAttributes<SplitLayoutElement>) => React.ReactElement | null;
//# sourceMappingURL=SplitLayout.d.ts.map