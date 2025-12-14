import type { EventName } from "@lit/react";
import { MultiSelectComboBox as MultiSelectComboBoxElement, type MultiSelectComboBoxEventMap as _MultiSelectComboBoxEventMap } from "@vaadin/multi-select-combo-box/vaadin-multi-select-combo-box.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/multi-select-combo-box/vaadin-multi-select-combo-box.js";
export { MultiSelectComboBoxElement, };
export type MultiSelectComboBoxEventMap<T1> = Readonly<{
    onValidated: EventName<_MultiSelectComboBoxEventMap<T1>["validated"]>;
    onChange: EventName<_MultiSelectComboBoxEventMap<T1>["change"]>;
    onInput: EventName<_MultiSelectComboBoxEventMap<T1>["input"]>;
    onCustomValueSet: EventName<_MultiSelectComboBoxEventMap<T1>["custom-value-set"]>;
    onInvalidChanged: EventName<_MultiSelectComboBoxEventMap<T1>["invalid-changed"]>;
    onSelectedItemsChanged: EventName<_MultiSelectComboBoxEventMap<T1>["selected-items-changed"]>;
    onOpenedChanged: EventName<_MultiSelectComboBoxEventMap<T1>["opened-changed"]>;
    onFilterChanged: EventName<_MultiSelectComboBoxEventMap<T1>["filter-changed"]>;
}>;
export type MultiSelectComboBoxProps<T1> = WebComponentProps<MultiSelectComboBoxElement<T1>, MultiSelectComboBoxEventMap<T1>>;
export declare const MultiSelectComboBox: <T1>(props: MultiSelectComboBoxProps<T1> & React.RefAttributes<MultiSelectComboBoxElement<T1>>) => React.ReactElement | null;
//# sourceMappingURL=MultiSelectComboBox.d.ts.map