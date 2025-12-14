import type { EventName } from "@lit/react";
import { ComboBox as ComboBoxElement, type ComboBoxEventMap as _ComboBoxEventMap } from "@vaadin/combo-box/vaadin-combo-box.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/combo-box/vaadin-combo-box.js";
export { ComboBoxElement, };
export type ComboBoxEventMap<T1> = Readonly<{
    onValidated: EventName<_ComboBoxEventMap<T1>["validated"]>;
    onChange: EventName<_ComboBoxEventMap<T1>["change"]>;
    onInput: EventName<_ComboBoxEventMap<T1>["input"]>;
    onCustomValueSet: EventName<_ComboBoxEventMap<T1>["custom-value-set"]>;
    onSelectedItemChanged: EventName<_ComboBoxEventMap<T1>["selected-item-changed"]>;
    onValueChanged: EventName<_ComboBoxEventMap<T1>["value-changed"]>;
    onInvalidChanged: EventName<_ComboBoxEventMap<T1>["invalid-changed"]>;
    onOpenedChanged: EventName<_ComboBoxEventMap<T1>["opened-changed"]>;
    onFilterChanged: EventName<_ComboBoxEventMap<T1>["filter-changed"]>;
}>;
export type ComboBoxProps<T1> = WebComponentProps<ComboBoxElement<T1>, ComboBoxEventMap<T1>>;
export declare const ComboBox: <T1>(props: ComboBoxProps<T1> & React.RefAttributes<ComboBoxElement<T1>>) => React.ReactElement | null;
//# sourceMappingURL=ComboBox.d.ts.map