import type { EventName } from "@lit/react";
import { TextArea as TextAreaElement, type TextAreaEventMap as _TextAreaEventMap } from "@vaadin/text-area/vaadin-text-area.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/text-area/vaadin-text-area.js";
export { TextAreaElement, };
export type TextAreaEventMap = Readonly<{
    onValidated: EventName<_TextAreaEventMap["validated"]>;
    onChange: EventName<_TextAreaEventMap["change"]>;
    onInput: EventName<_TextAreaEventMap["input"]>;
    onInvalidChanged: EventName<_TextAreaEventMap["invalid-changed"]>;
    onValueChanged: EventName<_TextAreaEventMap["value-changed"]>;
}>;
export type TextAreaProps = WebComponentProps<TextAreaElement, TextAreaEventMap>;
export declare const TextArea: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<TextAreaElement, Readonly<{
    onValidated: EventName<_TextAreaEventMap["validated"]>;
    onChange: EventName<_TextAreaEventMap["change"]>;
    onInput: EventName<_TextAreaEventMap["input"]>;
    onInvalidChanged: EventName<_TextAreaEventMap["invalid-changed"]>;
    onValueChanged: EventName<_TextAreaEventMap["value-changed"]>;
}>>> & React.RefAttributes<TextAreaElement>) => React.ReactElement | null;
//# sourceMappingURL=TextArea.d.ts.map