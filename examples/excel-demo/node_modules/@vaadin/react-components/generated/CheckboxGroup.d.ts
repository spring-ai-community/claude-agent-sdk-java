import type { EventName } from "@lit/react";
import { CheckboxGroup as CheckboxGroupElement, type CheckboxGroupEventMap as _CheckboxGroupEventMap } from "@vaadin/checkbox-group/vaadin-checkbox-group.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/checkbox-group/vaadin-checkbox-group.js";
export { CheckboxGroupElement, };
export type CheckboxGroupEventMap = Readonly<{
    onValidated: EventName<_CheckboxGroupEventMap["validated"]>;
    onInvalidChanged: EventName<_CheckboxGroupEventMap["invalid-changed"]>;
    onValueChanged: EventName<_CheckboxGroupEventMap["value-changed"]>;
}>;
export type CheckboxGroupProps = WebComponentProps<CheckboxGroupElement, CheckboxGroupEventMap>;
export declare const CheckboxGroup: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<CheckboxGroupElement, Readonly<{
    onValidated: EventName<_CheckboxGroupEventMap["validated"]>;
    onInvalidChanged: EventName<_CheckboxGroupEventMap["invalid-changed"]>;
    onValueChanged: EventName<_CheckboxGroupEventMap["value-changed"]>;
}>>> & React.RefAttributes<CheckboxGroupElement>) => React.ReactElement | null;
//# sourceMappingURL=CheckboxGroup.d.ts.map