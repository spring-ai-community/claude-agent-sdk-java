import type { EventName } from "@lit/react";
import { AccordionPanel as AccordionPanelElement, type AccordionPanelEventMap as _AccordionPanelEventMap } from "@vaadin/accordion/vaadin-accordion-panel.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/accordion/vaadin-accordion-panel.js";
export { AccordionPanelElement, };
export type AccordionPanelEventMap = Readonly<{
    onOpenedChanged: EventName<_AccordionPanelEventMap["opened-changed"]>;
}>;
export type AccordionPanelProps = WebComponentProps<AccordionPanelElement, AccordionPanelEventMap>;
export declare const AccordionPanel: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<AccordionPanelElement, Readonly<{
    onOpenedChanged: EventName<_AccordionPanelEventMap["opened-changed"]>;
}>>> & React.RefAttributes<AccordionPanelElement>) => React.ReactElement | null;
//# sourceMappingURL=AccordionPanel.d.ts.map