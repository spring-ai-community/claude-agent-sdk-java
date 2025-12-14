import type { EventName } from "@lit/react";
import { Popover as PopoverElement, type PopoverEventMap as _PopoverEventMap } from "@vaadin/popover/vaadin-popover.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/popover/vaadin-popover.js";
export { PopoverElement, };
export type PopoverEventMap = Readonly<{
    onClosed: EventName<_PopoverEventMap["closed"]>;
    onOpenedChanged: EventName<_PopoverEventMap["opened-changed"]>;
}>;
export type PopoverProps = WebComponentProps<PopoverElement, PopoverEventMap>;
export declare const Popover: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<PopoverElement, Readonly<{
    onClosed: EventName<_PopoverEventMap["closed"]>;
    onOpenedChanged: EventName<_PopoverEventMap["opened-changed"]>;
}>>> & React.RefAttributes<PopoverElement>) => React.ReactElement | null;
//# sourceMappingURL=Popover.d.ts.map