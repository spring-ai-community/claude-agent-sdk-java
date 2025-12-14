import type { EventName } from "@lit/react";
import { ComboBoxLight as ComboBoxLightElement, type ComboBoxLightEventMap as _ComboBoxLightEventMap } from "@vaadin/combo-box/vaadin-combo-box-light.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/combo-box/vaadin-combo-box-light.js";
export { ComboBoxLightElement, };
export type ComboBoxLightEventMap<T1> = Readonly<{
    onValidated: EventName<_ComboBoxLightEventMap<T1>["validated"]>;
    onChange: EventName<_ComboBoxLightEventMap<T1>["change"]>;
    onCustomValueSet: EventName<_ComboBoxLightEventMap<T1>["custom-value-set"]>;
    onSelectedItemChanged: EventName<_ComboBoxLightEventMap<T1>["selected-item-changed"]>;
    onValueChanged: EventName<_ComboBoxLightEventMap<T1>["value-changed"]>;
    onInvalidChanged: EventName<_ComboBoxLightEventMap<T1>["invalid-changed"]>;
    onOpenedChanged: EventName<_ComboBoxLightEventMap<T1>["opened-changed"]>;
    onFilterChanged: EventName<_ComboBoxLightEventMap<T1>["filter-changed"]>;
}>;
export type ComboBoxLightProps<T1> = WebComponentProps<ComboBoxLightElement<T1>, ComboBoxLightEventMap<T1>>;
export declare const ComboBoxLight: <T1>(props: ComboBoxLightProps<T1> & React.RefAttributes<ComboBoxLightElement<T1>>) => React.ReactElement | null;
//# sourceMappingURL=ComboBoxLight.d.ts.map