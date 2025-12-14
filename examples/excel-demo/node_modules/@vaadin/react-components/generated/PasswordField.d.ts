import type { EventName } from "@lit/react";
import { PasswordField as PasswordFieldElement, type PasswordFieldEventMap as _PasswordFieldEventMap } from "@vaadin/password-field/vaadin-password-field.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/password-field/vaadin-password-field.js";
export { PasswordFieldElement, };
export type PasswordFieldEventMap = Readonly<{
    onValidated: EventName<_PasswordFieldEventMap["validated"]>;
    onChange: EventName<_PasswordFieldEventMap["change"]>;
    onInput: EventName<_PasswordFieldEventMap["input"]>;
    onInvalidChanged: EventName<_PasswordFieldEventMap["invalid-changed"]>;
    onValueChanged: EventName<_PasswordFieldEventMap["value-changed"]>;
}>;
export type PasswordFieldProps = WebComponentProps<PasswordFieldElement, PasswordFieldEventMap>;
export declare const PasswordField: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<PasswordFieldElement, Readonly<{
    onValidated: EventName<_PasswordFieldEventMap["validated"]>;
    onChange: EventName<_PasswordFieldEventMap["change"]>;
    onInput: EventName<_PasswordFieldEventMap["input"]>;
    onInvalidChanged: EventName<_PasswordFieldEventMap["invalid-changed"]>;
    onValueChanged: EventName<_PasswordFieldEventMap["value-changed"]>;
}>>> & React.RefAttributes<PasswordFieldElement>) => React.ReactElement | null;
//# sourceMappingURL=PasswordField.d.ts.map