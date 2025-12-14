import { GridTreeColumn as GridTreeColumnElement } from "@vaadin/grid/vaadin-grid-tree-column.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/grid/vaadin-grid-tree-column.js";
export { GridTreeColumnElement, };
export type GridTreeColumnEventMap = Readonly<{}>;
export type GridTreeColumnProps<T1> = WebComponentProps<GridTreeColumnElement<T1>, GridTreeColumnEventMap>;
export declare const GridTreeColumn: <T1>(props: GridTreeColumnProps<T1> & React.RefAttributes<GridTreeColumnElement<T1>>) => React.ReactElement | null;
//# sourceMappingURL=GridTreeColumn.d.ts.map