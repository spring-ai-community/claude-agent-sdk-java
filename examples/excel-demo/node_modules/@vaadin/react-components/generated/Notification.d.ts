import type { EventName } from "@lit/react";
import { Notification as NotificationElement, type NotificationEventMap as _NotificationEventMap } from "@vaadin/notification/vaadin-notification.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/notification/vaadin-notification.js";
export { NotificationElement, };
export type NotificationEventMap = Readonly<{
    onClosed: EventName<_NotificationEventMap["closed"]>;
    onOpenedChanged: EventName<_NotificationEventMap["opened-changed"]>;
}>;
export type NotificationProps = WebComponentProps<NotificationElement, NotificationEventMap>;
export declare const Notification: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<NotificationElement, Readonly<{
    onClosed: EventName<_NotificationEventMap["closed"]>;
    onOpenedChanged: EventName<_NotificationEventMap["opened-changed"]>;
}>>> & React.RefAttributes<NotificationElement>) => React.ReactElement | null;
//# sourceMappingURL=Notification.d.ts.map