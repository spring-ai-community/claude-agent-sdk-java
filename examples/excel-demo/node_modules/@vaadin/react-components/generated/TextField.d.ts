import type { EventName } from "@lit/react";
import { TextField as TextFieldElement, type TextFieldEventMap as _TextFieldEventMap } from "@vaadin/text-field/vaadin-text-field.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/text-field/vaadin-text-field.js";
export { TextFieldElement, };
export type TextFieldEventMap = Readonly<{
    onValidated: EventName<_TextFieldEventMap["validated"]>;
    onChange: EventName<_TextFieldEventMap["change"]>;
    onInput: EventName<_TextFieldEventMap["input"]>;
    onInvalidChanged: EventName<_TextFieldEventMap["invalid-changed"]>;
    onValueChanged: EventName<_TextFieldEventMap["value-changed"]>;
}>;
export type TextFieldProps = WebComponentProps<TextFieldElement, TextFieldEventMap>;
export declare const TextField: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<TextFieldElement, Readonly<{
    onValidated: EventName<_TextFieldEventMap["validated"]>;
    onChange: EventName<_TextFieldEventMap["change"]>;
    onInput: EventName<_TextFieldEventMap["input"]>;
    onInvalidChanged: EventName<_TextFieldEventMap["invalid-changed"]>;
    onValueChanged: EventName<_TextFieldEventMap["value-changed"]>;
}>>> & React.RefAttributes<TextFieldElement>) => React.ReactElement | null;
//# sourceMappingURL=TextField.d.ts.map