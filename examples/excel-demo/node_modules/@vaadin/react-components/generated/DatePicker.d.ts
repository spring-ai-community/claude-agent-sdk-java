import type { EventName } from "@lit/react";
import { DatePicker as DatePickerElement, type DatePickerEventMap as _DatePickerEventMap } from "@vaadin/date-picker/vaadin-date-picker.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/date-picker/vaadin-date-picker.js";
export { DatePickerElement, };
export type DatePickerEventMap = Readonly<{
    onValidated: EventName<_DatePickerEventMap["validated"]>;
    onChange: EventName<_DatePickerEventMap["change"]>;
    onInput: EventName<_DatePickerEventMap["input"]>;
    onOpenedChanged: EventName<_DatePickerEventMap["opened-changed"]>;
    onValueChanged: EventName<_DatePickerEventMap["value-changed"]>;
    onInvalidChanged: EventName<_DatePickerEventMap["invalid-changed"]>;
}>;
export type DatePickerProps = WebComponentProps<DatePickerElement, DatePickerEventMap>;
export declare const DatePicker: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<DatePickerElement, Readonly<{
    onValidated: EventName<_DatePickerEventMap["validated"]>;
    onChange: EventName<_DatePickerEventMap["change"]>;
    onInput: EventName<_DatePickerEventMap["input"]>;
    onOpenedChanged: EventName<_DatePickerEventMap["opened-changed"]>;
    onValueChanged: EventName<_DatePickerEventMap["value-changed"]>;
    onInvalidChanged: EventName<_DatePickerEventMap["invalid-changed"]>;
}>>> & React.RefAttributes<DatePickerElement>) => React.ReactElement | null;
//# sourceMappingURL=DatePicker.d.ts.map