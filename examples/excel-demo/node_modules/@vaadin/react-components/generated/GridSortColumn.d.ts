import type { EventName } from "@lit/react";
import { GridSortColumn as GridSortColumnElement, type GridSortColumnEventMap as _GridSortColumnEventMap } from "@vaadin/grid/vaadin-grid-sort-column.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/grid/vaadin-grid-sort-column.js";
export { GridSortColumnElement, };
export type GridSortColumnEventMap = Readonly<{
    onDirectionChanged: EventName<_GridSortColumnEventMap["direction-changed"]>;
}>;
export type GridSortColumnProps<T1> = WebComponentProps<GridSortColumnElement<T1>, GridSortColumnEventMap>;
export declare const GridSortColumn: <T1>(props: GridSortColumnProps<T1> & React.RefAttributes<GridSortColumnElement<T1>>) => React.ReactElement | null;
//# sourceMappingURL=GridSortColumn.d.ts.map