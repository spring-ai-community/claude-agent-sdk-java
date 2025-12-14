import type { EventName } from "@lit/react";
import { GridSelectionColumn as GridSelectionColumnElement, type GridSelectionColumnEventMap as _GridSelectionColumnEventMap } from "@vaadin/grid/vaadin-grid-selection-column.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/grid/vaadin-grid-selection-column.js";
export { GridSelectionColumnElement, };
export type GridSelectionColumnEventMap = Readonly<{
    onSelectAllChanged: EventName<_GridSelectionColumnEventMap["select-all-changed"]>;
}>;
export type GridSelectionColumnProps<T1> = WebComponentProps<GridSelectionColumnElement<T1>, GridSelectionColumnEventMap>;
export declare const GridSelectionColumn: <T1>(props: GridSelectionColumnProps<T1> & React.RefAttributes<GridSelectionColumnElement<T1>>) => React.ReactElement | null;
//# sourceMappingURL=GridSelectionColumn.d.ts.map