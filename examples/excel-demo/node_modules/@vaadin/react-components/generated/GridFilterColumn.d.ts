import { GridFilterColumn as GridFilterColumnElement } from "@vaadin/grid/vaadin-grid-filter-column.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/grid/vaadin-grid-filter-column.js";
export { GridFilterColumnElement, };
export type GridFilterColumnEventMap = Readonly<{}>;
export type GridFilterColumnProps<T1> = WebComponentProps<GridFilterColumnElement<T1>, GridFilterColumnEventMap>;
export declare const GridFilterColumn: <T1>(props: GridFilterColumnProps<T1> & React.RefAttributes<GridFilterColumnElement<T1>>) => React.ReactElement | null;
//# sourceMappingURL=GridFilterColumn.d.ts.map