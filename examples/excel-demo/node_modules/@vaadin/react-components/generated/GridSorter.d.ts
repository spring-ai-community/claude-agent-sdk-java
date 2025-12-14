import type { EventName } from "@lit/react";
import { GridSorter as GridSorterElement, type GridSorterEventMap as _GridSorterEventMap } from "@vaadin/grid/vaadin-grid-sorter.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/grid/vaadin-grid-sorter.js";
export { GridSorterElement, };
export type GridSorterEventMap = Readonly<{
    onDirectionChanged: EventName<_GridSorterEventMap["direction-changed"]>;
}>;
export type GridSorterProps = WebComponentProps<GridSorterElement, GridSorterEventMap>;
export declare const GridSorter: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<GridSorterElement, Readonly<{
    onDirectionChanged: EventName<_GridSorterEventMap["direction-changed"]>;
}>>> & React.RefAttributes<GridSorterElement>) => React.ReactElement | null;
//# sourceMappingURL=GridSorter.d.ts.map