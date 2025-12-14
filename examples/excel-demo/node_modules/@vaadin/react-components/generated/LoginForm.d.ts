import type { EventName } from "@lit/react";
import { LoginForm as LoginFormElement, type LoginFormEventMap as _LoginFormEventMap } from "@vaadin/login/vaadin-login-form.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/login/vaadin-login-form.js";
export { LoginFormElement, };
export type LoginFormEventMap = Readonly<{
    onForgotPassword: EventName<_LoginFormEventMap["forgot-password"]>;
    onLogin: EventName<_LoginFormEventMap["login"]>;
    onDisabledChanged: EventName<_LoginFormEventMap["disabled-changed"]>;
    onErrorChanged: EventName<_LoginFormEventMap["error-changed"]>;
}>;
export type LoginFormProps = WebComponentProps<LoginFormElement, LoginFormEventMap>;
export declare const LoginForm: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<LoginFormElement, Readonly<{
    onForgotPassword: EventName<_LoginFormEventMap["forgot-password"]>;
    onLogin: EventName<_LoginFormEventMap["login"]>;
    onDisabledChanged: EventName<_LoginFormEventMap["disabled-changed"]>;
    onErrorChanged: EventName<_LoginFormEventMap["error-changed"]>;
}>>> & React.RefAttributes<LoginFormElement>) => React.ReactElement | null;
//# sourceMappingURL=LoginForm.d.ts.map