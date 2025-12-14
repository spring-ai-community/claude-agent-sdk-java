import type { EventName } from "@lit/react";
import { RadioButton as RadioButtonElement, type RadioButtonEventMap as _RadioButtonEventMap } from "@vaadin/radio-group/vaadin-radio-button.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/radio-group/vaadin-radio-button.js";
export { RadioButtonElement, };
export type RadioButtonEventMap = Readonly<{
    onCheckedChanged: EventName<_RadioButtonEventMap["checked-changed"]>;
}>;
export type RadioButtonProps = WebComponentProps<RadioButtonElement, RadioButtonEventMap>;
export declare const RadioButton: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<RadioButtonElement, Readonly<{
    onCheckedChanged: EventName<_RadioButtonEventMap["checked-changed"]>;
}>>> & React.RefAttributes<RadioButtonElement>) => React.ReactElement | null;
//# sourceMappingURL=RadioButton.d.ts.map