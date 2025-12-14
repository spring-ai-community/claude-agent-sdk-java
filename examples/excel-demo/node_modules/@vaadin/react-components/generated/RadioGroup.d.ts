import type { EventName } from "@lit/react";
import { RadioGroup as RadioGroupElement, type RadioGroupEventMap as _RadioGroupEventMap } from "@vaadin/radio-group/vaadin-radio-group.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/radio-group/vaadin-radio-group.js";
export { RadioGroupElement, };
export type RadioGroupEventMap = Readonly<{
    onValidated: EventName<_RadioGroupEventMap["validated"]>;
    onInvalidChanged: EventName<_RadioGroupEventMap["invalid-changed"]>;
    onValueChanged: EventName<_RadioGroupEventMap["value-changed"]>;
}>;
export type RadioGroupProps = WebComponentProps<RadioGroupElement, RadioGroupEventMap>;
export declare const RadioGroup: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<RadioGroupElement, Readonly<{
    onValidated: EventName<_RadioGroupEventMap["validated"]>;
    onInvalidChanged: EventName<_RadioGroupEventMap["invalid-changed"]>;
    onValueChanged: EventName<_RadioGroupEventMap["value-changed"]>;
}>>> & React.RefAttributes<RadioGroupElement>) => React.ReactElement | null;
//# sourceMappingURL=RadioGroup.d.ts.map