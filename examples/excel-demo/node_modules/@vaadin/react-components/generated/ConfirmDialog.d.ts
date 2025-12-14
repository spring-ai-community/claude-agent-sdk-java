import type { EventName } from "@lit/react";
import { ConfirmDialog as ConfirmDialogElement, type ConfirmDialogEventMap as _ConfirmDialogEventMap } from "@vaadin/confirm-dialog/vaadin-confirm-dialog.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/confirm-dialog/vaadin-confirm-dialog.js";
export { ConfirmDialogElement, };
export type ConfirmDialogEventMap = Readonly<{
    onClosed: EventName<_ConfirmDialogEventMap["closed"]>;
    onCancel: EventName<_ConfirmDialogEventMap["cancel"]>;
    onConfirm: EventName<_ConfirmDialogEventMap["confirm"]>;
    onReject: EventName<_ConfirmDialogEventMap["reject"]>;
    onOpenedChanged: EventName<_ConfirmDialogEventMap["opened-changed"]>;
}>;
export type ConfirmDialogProps = WebComponentProps<ConfirmDialogElement, ConfirmDialogEventMap>;
export declare const ConfirmDialog: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<ConfirmDialogElement, Readonly<{
    onClosed: EventName<_ConfirmDialogEventMap["closed"]>;
    onCancel: EventName<_ConfirmDialogEventMap["cancel"]>;
    onConfirm: EventName<_ConfirmDialogEventMap["confirm"]>;
    onReject: EventName<_ConfirmDialogEventMap["reject"]>;
    onOpenedChanged: EventName<_ConfirmDialogEventMap["opened-changed"]>;
}>>> & React.RefAttributes<ConfirmDialogElement>) => React.ReactElement | null;
//# sourceMappingURL=ConfirmDialog.d.ts.map