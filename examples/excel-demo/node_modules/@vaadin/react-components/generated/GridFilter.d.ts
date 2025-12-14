import type { EventName } from "@lit/react";
import { GridFilter as GridFilterElement, type GridFilterEventMap as _GridFilterEventMap } from "@vaadin/grid/vaadin-grid-filter.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/grid/vaadin-grid-filter.js";
export { GridFilterElement, };
export type GridFilterEventMap = Readonly<{
    onValueChanged: EventName<_GridFilterEventMap["value-changed"]>;
}>;
export type GridFilterProps = WebComponentProps<GridFilterElement, GridFilterEventMap>;
export declare const GridFilter: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<GridFilterElement, Readonly<{
    onValueChanged: EventName<_GridFilterEventMap["value-changed"]>;
}>>> & React.RefAttributes<GridFilterElement>) => React.ReactElement | null;
//# sourceMappingURL=GridFilter.d.ts.map