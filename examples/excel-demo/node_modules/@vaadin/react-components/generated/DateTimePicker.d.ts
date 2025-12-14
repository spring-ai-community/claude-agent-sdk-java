import type { EventName } from "@lit/react";
import { DateTimePicker as DateTimePickerElement, type DateTimePickerEventMap as _DateTimePickerEventMap } from "@vaadin/date-time-picker/vaadin-date-time-picker.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/date-time-picker/vaadin-date-time-picker.js";
export { DateTimePickerElement, };
export type DateTimePickerEventMap = Readonly<{
    onValidated: EventName<_DateTimePickerEventMap["validated"]>;
    onChange: EventName<_DateTimePickerEventMap["change"]>;
    onInvalidChanged: EventName<_DateTimePickerEventMap["invalid-changed"]>;
    onValueChanged: EventName<_DateTimePickerEventMap["value-changed"]>;
}>;
export type DateTimePickerProps = WebComponentProps<DateTimePickerElement, DateTimePickerEventMap>;
export declare const DateTimePicker: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<DateTimePickerElement, Readonly<{
    onValidated: EventName<_DateTimePickerEventMap["validated"]>;
    onChange: EventName<_DateTimePickerEventMap["change"]>;
    onInvalidChanged: EventName<_DateTimePickerEventMap["invalid-changed"]>;
    onValueChanged: EventName<_DateTimePickerEventMap["value-changed"]>;
}>>> & React.RefAttributes<DateTimePickerElement>) => React.ReactElement | null;
//# sourceMappingURL=DateTimePicker.d.ts.map