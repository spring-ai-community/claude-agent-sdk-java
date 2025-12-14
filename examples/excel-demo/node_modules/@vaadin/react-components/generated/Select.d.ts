import type { EventName } from "@lit/react";
import { Select as SelectElement, type SelectEventMap as _SelectEventMap } from "@vaadin/select/vaadin-select.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/select/vaadin-select.js";
export { SelectElement, };
export type SelectEventMap = Readonly<{
    onValidated: EventName<_SelectEventMap["validated"]>;
    onChange: EventName<_SelectEventMap["change"]>;
    onInvalidChanged: EventName<_SelectEventMap["invalid-changed"]>;
    onOpenedChanged: EventName<_SelectEventMap["opened-changed"]>;
    onValueChanged: EventName<_SelectEventMap["value-changed"]>;
}>;
export type SelectProps = WebComponentProps<SelectElement, SelectEventMap>;
export declare const Select: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<SelectElement, Readonly<{
    onValidated: EventName<_SelectEventMap["validated"]>;
    onChange: EventName<_SelectEventMap["change"]>;
    onInvalidChanged: EventName<_SelectEventMap["invalid-changed"]>;
    onOpenedChanged: EventName<_SelectEventMap["opened-changed"]>;
    onValueChanged: EventName<_SelectEventMap["value-changed"]>;
}>>> & React.RefAttributes<SelectElement>) => React.ReactElement | null;
//# sourceMappingURL=Select.d.ts.map