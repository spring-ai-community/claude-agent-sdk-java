import type { EventName } from "@lit/react";
import { Dialog as DialogElement, type DialogEventMap as _DialogEventMap } from "@vaadin/dialog/vaadin-dialog.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/dialog/vaadin-dialog.js";
export { DialogElement, };
export type DialogEventMap = Readonly<{
    onClosed: EventName<_DialogEventMap["closed"]>;
    onDragged: EventName<_DialogEventMap["dragged"]>;
    onResize: EventName<_DialogEventMap["resize"]>;
    onOpenedChanged: EventName<_DialogEventMap["opened-changed"]>;
}>;
export type DialogProps = WebComponentProps<DialogElement, DialogEventMap>;
export declare const Dialog: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<DialogElement, Readonly<{
    onClosed: EventName<_DialogEventMap["closed"]>;
    onDragged: EventName<_DialogEventMap["dragged"]>;
    onResize: EventName<_DialogEventMap["resize"]>;
    onOpenedChanged: EventName<_DialogEventMap["opened-changed"]>;
}>>> & React.RefAttributes<DialogElement>) => React.ReactElement | null;
//# sourceMappingURL=Dialog.d.ts.map