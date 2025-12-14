import type { EventName } from "@lit/react";
import { LoginOverlay as LoginOverlayElement, type LoginOverlayEventMap as _LoginOverlayEventMap } from "@vaadin/login/vaadin-login-overlay.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/login/vaadin-login-overlay.js";
export { LoginOverlayElement, };
export type LoginOverlayEventMap = Readonly<{
    onForgotPassword: EventName<_LoginOverlayEventMap["forgot-password"]>;
    onLogin: EventName<_LoginOverlayEventMap["login"]>;
    onDisabledChanged: EventName<_LoginOverlayEventMap["disabled-changed"]>;
    onErrorChanged: EventName<_LoginOverlayEventMap["error-changed"]>;
    onDescriptionChanged: EventName<_LoginOverlayEventMap["description-changed"]>;
}>;
export type LoginOverlayProps = WebComponentProps<LoginOverlayElement, LoginOverlayEventMap>;
export declare const LoginOverlay: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<LoginOverlayElement, Readonly<{
    onForgotPassword: EventName<_LoginOverlayEventMap["forgot-password"]>;
    onLogin: EventName<_LoginOverlayEventMap["login"]>;
    onDisabledChanged: EventName<_LoginOverlayEventMap["disabled-changed"]>;
    onErrorChanged: EventName<_LoginOverlayEventMap["error-changed"]>;
    onDescriptionChanged: EventName<_LoginOverlayEventMap["description-changed"]>;
}>>> & React.RefAttributes<LoginOverlayElement>) => React.ReactElement | null;
//# sourceMappingURL=LoginOverlay.d.ts.map