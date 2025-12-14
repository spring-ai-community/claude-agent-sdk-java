import { GridColumn as GridColumnElement } from "@vaadin/grid/vaadin-grid-column.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/grid/vaadin-grid-column.js";
export { GridColumnElement, };
export type GridColumnEventMap = Readonly<{}>;
export type GridColumnProps<T1> = WebComponentProps<GridColumnElement<T1>, GridColumnEventMap>;
export declare const GridColumn: <T1>(props: GridColumnProps<T1> & React.RefAttributes<GridColumnElement<T1>>) => React.ReactElement | null;
//# sourceMappingURL=GridColumn.d.ts.map