import type { EventName } from "@lit/react";
import { IntegerField as IntegerFieldElement, type IntegerFieldEventMap as _IntegerFieldEventMap } from "@vaadin/integer-field/vaadin-integer-field.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/integer-field/vaadin-integer-field.js";
export { IntegerFieldElement, };
export type IntegerFieldEventMap = Readonly<{
    onValidated: EventName<_IntegerFieldEventMap["validated"]>;
    onChange: EventName<_IntegerFieldEventMap["change"]>;
    onInput: EventName<_IntegerFieldEventMap["input"]>;
    onInvalidChanged: EventName<_IntegerFieldEventMap["invalid-changed"]>;
    onValueChanged: EventName<_IntegerFieldEventMap["value-changed"]>;
}>;
export type IntegerFieldProps = WebComponentProps<IntegerFieldElement, IntegerFieldEventMap>;
export declare const IntegerField: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<IntegerFieldElement, Readonly<{
    onValidated: EventName<_IntegerFieldEventMap["validated"]>;
    onChange: EventName<_IntegerFieldEventMap["change"]>;
    onInput: EventName<_IntegerFieldEventMap["input"]>;
    onInvalidChanged: EventName<_IntegerFieldEventMap["invalid-changed"]>;
    onValueChanged: EventName<_IntegerFieldEventMap["value-changed"]>;
}>>> & React.RefAttributes<IntegerFieldElement>) => React.ReactElement | null;
//# sourceMappingURL=IntegerField.d.ts.map