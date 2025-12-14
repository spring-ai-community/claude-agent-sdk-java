import type { EventName } from "@lit/react";
import { AppLayout as AppLayoutElement, type AppLayoutEventMap as _AppLayoutEventMap } from "@vaadin/app-layout/vaadin-app-layout.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/app-layout/vaadin-app-layout.js";
export { AppLayoutElement, };
export type AppLayoutEventMap = Readonly<{
    onPrimarySectionChanged: EventName<_AppLayoutEventMap["primary-section-changed"]>;
    onDrawerOpenedChanged: EventName<_AppLayoutEventMap["drawer-opened-changed"]>;
    onOverlayChanged: EventName<_AppLayoutEventMap["overlay-changed"]>;
}>;
export type AppLayoutProps = WebComponentProps<AppLayoutElement, AppLayoutEventMap>;
export declare const AppLayout: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<AppLayoutElement, Readonly<{
    onPrimarySectionChanged: EventName<_AppLayoutEventMap["primary-section-changed"]>;
    onDrawerOpenedChanged: EventName<_AppLayoutEventMap["drawer-opened-changed"]>;
    onOverlayChanged: EventName<_AppLayoutEventMap["overlay-changed"]>;
}>>> & React.RefAttributes<AppLayoutElement>) => React.ReactElement | null;
//# sourceMappingURL=AppLayout.d.ts.map