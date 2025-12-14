import type { EventName } from "@lit/react";
import { Checkbox as CheckboxElement, type CheckboxEventMap as _CheckboxEventMap } from "@vaadin/checkbox/vaadin-checkbox.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/checkbox/vaadin-checkbox.js";
export { CheckboxElement, };
export type CheckboxEventMap = Readonly<{
    onValidated: EventName<_CheckboxEventMap["validated"]>;
    onChange: EventName<_CheckboxEventMap["change"]>;
    onCheckedChanged: EventName<_CheckboxEventMap["checked-changed"]>;
    onInvalidChanged: EventName<_CheckboxEventMap["invalid-changed"]>;
    onIndeterminateChanged: EventName<_CheckboxEventMap["indeterminate-changed"]>;
}>;
export type CheckboxProps = WebComponentProps<CheckboxElement, CheckboxEventMap>;
export declare const Checkbox: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<CheckboxElement, Readonly<{
    onValidated: EventName<_CheckboxEventMap["validated"]>;
    onChange: EventName<_CheckboxEventMap["change"]>;
    onCheckedChanged: EventName<_CheckboxEventMap["checked-changed"]>;
    onInvalidChanged: EventName<_CheckboxEventMap["invalid-changed"]>;
    onIndeterminateChanged: EventName<_CheckboxEventMap["indeterminate-changed"]>;
}>>> & React.RefAttributes<CheckboxElement>) => React.ReactElement | null;
//# sourceMappingURL=Checkbox.d.ts.map