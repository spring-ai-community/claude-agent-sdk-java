import type { EventName } from "@lit/react";
import { Accordion as AccordionElement, type AccordionEventMap as _AccordionEventMap } from "@vaadin/accordion/vaadin-accordion.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/accordion/vaadin-accordion.js";
export { AccordionElement, };
export type AccordionEventMap = Readonly<{
    onOpenedChanged: EventName<_AccordionEventMap["opened-changed"]>;
    onItemsChanged: EventName<_AccordionEventMap["items-changed"]>;
}>;
export type AccordionProps = WebComponentProps<AccordionElement, AccordionEventMap>;
export declare const Accordion: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<AccordionElement, Readonly<{
    onOpenedChanged: EventName<_AccordionEventMap["opened-changed"]>;
    onItemsChanged: EventName<_AccordionEventMap["items-changed"]>;
}>>> & React.RefAttributes<AccordionElement>) => React.ReactElement | null;
//# sourceMappingURL=Accordion.d.ts.map