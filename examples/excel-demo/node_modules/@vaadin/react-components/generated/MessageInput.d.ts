import type { EventName } from "@lit/react";
import { MessageInput as MessageInputElement, type MessageInputEventMap as _MessageInputEventMap } from "@vaadin/message-input/vaadin-message-input.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/message-input/vaadin-message-input.js";
export { MessageInputElement, };
export type MessageInputEventMap = Readonly<{
    onSubmit: EventName<_MessageInputEventMap["submit"]>;
}>;
export type MessageInputProps = WebComponentProps<MessageInputElement, MessageInputEventMap>;
export declare const MessageInput: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<MessageInputElement, Readonly<{
    onSubmit: EventName<_MessageInputEventMap["submit"]>;
}>>> & React.RefAttributes<MessageInputElement>) => React.ReactElement | null;
//# sourceMappingURL=MessageInput.d.ts.map