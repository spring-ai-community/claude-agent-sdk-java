import type { EventName } from "@lit/react";
import { Details as DetailsElement, type DetailsEventMap as _DetailsEventMap } from "@vaadin/details/vaadin-details.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/details/vaadin-details.js";
export { DetailsElement, };
export type DetailsEventMap = Readonly<{
    onOpenedChanged: EventName<_DetailsEventMap["opened-changed"]>;
}>;
export type DetailsProps = WebComponentProps<DetailsElement, DetailsEventMap>;
export declare const Details: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<DetailsElement, Readonly<{
    onOpenedChanged: EventName<_DetailsEventMap["opened-changed"]>;
}>>> & React.RefAttributes<DetailsElement>) => React.ReactElement | null;
//# sourceMappingURL=Details.d.ts.map