import type { EventName } from "@lit/react";
import { TimePicker as TimePickerElement, type TimePickerEventMap as _TimePickerEventMap } from "@vaadin/time-picker/vaadin-time-picker.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/time-picker/vaadin-time-picker.js";
export { TimePickerElement, };
export type TimePickerEventMap = Readonly<{
    onValidated: EventName<_TimePickerEventMap["validated"]>;
    onChange: EventName<_TimePickerEventMap["change"]>;
    onInput: EventName<_TimePickerEventMap["input"]>;
    onInvalidChanged: EventName<_TimePickerEventMap["invalid-changed"]>;
    onValueChanged: EventName<_TimePickerEventMap["value-changed"]>;
    onOpenedChanged: EventName<_TimePickerEventMap["opened-changed"]>;
}>;
export type TimePickerProps = WebComponentProps<TimePickerElement, TimePickerEventMap>;
export declare const TimePicker: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<TimePickerElement, Readonly<{
    onValidated: EventName<_TimePickerEventMap["validated"]>;
    onChange: EventName<_TimePickerEventMap["change"]>;
    onInput: EventName<_TimePickerEventMap["input"]>;
    onInvalidChanged: EventName<_TimePickerEventMap["invalid-changed"]>;
    onValueChanged: EventName<_TimePickerEventMap["value-changed"]>;
    onOpenedChanged: EventName<_TimePickerEventMap["opened-changed"]>;
}>>> & React.RefAttributes<TimePickerElement>) => React.ReactElement | null;
//# sourceMappingURL=TimePicker.d.ts.map