import type { EventName } from "@lit/react";
import { EmailField as EmailFieldElement, type EmailFieldEventMap as _EmailFieldEventMap } from "@vaadin/email-field/vaadin-email-field.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/email-field/vaadin-email-field.js";
export { EmailFieldElement, };
export type EmailFieldEventMap = Readonly<{
    onValidated: EventName<_EmailFieldEventMap["validated"]>;
    onChange: EventName<_EmailFieldEventMap["change"]>;
    onInput: EventName<_EmailFieldEventMap["input"]>;
    onInvalidChanged: EventName<_EmailFieldEventMap["invalid-changed"]>;
    onValueChanged: EventName<_EmailFieldEventMap["value-changed"]>;
}>;
export type EmailFieldProps = WebComponentProps<EmailFieldElement, EmailFieldEventMap>;
export declare const EmailField: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<EmailFieldElement, Readonly<{
    onValidated: EventName<_EmailFieldEventMap["validated"]>;
    onChange: EventName<_EmailFieldEventMap["change"]>;
    onInput: EventName<_EmailFieldEventMap["input"]>;
    onInvalidChanged: EventName<_EmailFieldEventMap["invalid-changed"]>;
    onValueChanged: EventName<_EmailFieldEventMap["value-changed"]>;
}>>> & React.RefAttributes<EmailFieldElement>) => React.ReactElement | null;
//# sourceMappingURL=EmailField.d.ts.map