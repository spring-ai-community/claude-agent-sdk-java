import type { EventName } from "@lit/react";
import { NumberField as NumberFieldElement, type NumberFieldEventMap as _NumberFieldEventMap } from "@vaadin/number-field/vaadin-number-field.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/number-field/vaadin-number-field.js";
export { NumberFieldElement, };
export type NumberFieldEventMap = Readonly<{
    onValidated: EventName<_NumberFieldEventMap["validated"]>;
    onChange: EventName<_NumberFieldEventMap["change"]>;
    onInput: EventName<_NumberFieldEventMap["input"]>;
    onInvalidChanged: EventName<_NumberFieldEventMap["invalid-changed"]>;
    onValueChanged: EventName<_NumberFieldEventMap["value-changed"]>;
}>;
export type NumberFieldProps = WebComponentProps<NumberFieldElement, NumberFieldEventMap>;
export declare const NumberField: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<NumberFieldElement, Readonly<{
    onValidated: EventName<_NumberFieldEventMap["validated"]>;
    onChange: EventName<_NumberFieldEventMap["change"]>;
    onInput: EventName<_NumberFieldEventMap["input"]>;
    onInvalidChanged: EventName<_NumberFieldEventMap["invalid-changed"]>;
    onValueChanged: EventName<_NumberFieldEventMap["value-changed"]>;
}>>> & React.RefAttributes<NumberFieldElement>) => React.ReactElement | null;
//# sourceMappingURL=NumberField.d.ts.map