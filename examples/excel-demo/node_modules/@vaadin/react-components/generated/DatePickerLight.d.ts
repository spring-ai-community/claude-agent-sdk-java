import type { EventName } from "@lit/react";
import { DatePickerLight as DatePickerLightElement, type DatePickerLightEventMap as _DatePickerLightEventMap } from "@vaadin/date-picker/vaadin-date-picker-light.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/date-picker/vaadin-date-picker-light.js";
export { DatePickerLightElement, };
export type DatePickerLightEventMap = Readonly<{
    onValidated: EventName<_DatePickerLightEventMap["validated"]>;
    onChange: EventName<_DatePickerLightEventMap["change"]>;
    onOpenedChanged: EventName<_DatePickerLightEventMap["opened-changed"]>;
    onValueChanged: EventName<_DatePickerLightEventMap["value-changed"]>;
    onInvalidChanged: EventName<_DatePickerLightEventMap["invalid-changed"]>;
}>;
export type DatePickerLightProps = WebComponentProps<DatePickerLightElement, DatePickerLightEventMap>;
export declare const DatePickerLight: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<DatePickerLightElement, Readonly<{
    onValidated: EventName<_DatePickerLightEventMap["validated"]>;
    onChange: EventName<_DatePickerLightEventMap["change"]>;
    onOpenedChanged: EventName<_DatePickerLightEventMap["opened-changed"]>;
    onValueChanged: EventName<_DatePickerLightEventMap["value-changed"]>;
    onInvalidChanged: EventName<_DatePickerLightEventMap["invalid-changed"]>;
}>>> & React.RefAttributes<DatePickerLightElement>) => React.ReactElement | null;
//# sourceMappingURL=DatePickerLight.d.ts.map