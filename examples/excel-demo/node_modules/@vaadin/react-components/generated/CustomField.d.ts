import type { EventName } from "@lit/react";
import { CustomField as CustomFieldElement, type CustomFieldEventMap as _CustomFieldEventMap } from "@vaadin/custom-field/vaadin-custom-field.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/custom-field/vaadin-custom-field.js";
export { CustomFieldElement, };
export type CustomFieldEventMap = Readonly<{
    onValidated: EventName<_CustomFieldEventMap["validated"]>;
    onChange: EventName<_CustomFieldEventMap["change"]>;
    onInvalidChanged: EventName<_CustomFieldEventMap["invalid-changed"]>;
    onValueChanged: EventName<_CustomFieldEventMap["value-changed"]>;
}>;
export type CustomFieldProps = WebComponentProps<CustomFieldElement, CustomFieldEventMap>;
export declare const CustomField: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<CustomFieldElement, Readonly<{
    onValidated: EventName<_CustomFieldEventMap["validated"]>;
    onChange: EventName<_CustomFieldEventMap["change"]>;
    onInvalidChanged: EventName<_CustomFieldEventMap["invalid-changed"]>;
    onValueChanged: EventName<_CustomFieldEventMap["value-changed"]>;
}>>> & React.RefAttributes<CustomFieldElement>) => React.ReactElement | null;
//# sourceMappingURL=CustomField.d.ts.map