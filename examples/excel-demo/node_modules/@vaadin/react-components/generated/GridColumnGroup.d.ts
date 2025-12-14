import { GridColumnGroup as GridColumnGroupElement } from "@vaadin/grid/vaadin-grid-column-group.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/grid/vaadin-grid-column-group.js";
export { GridColumnGroupElement, };
export type GridColumnGroupEventMap = Readonly<{}>;
export type GridColumnGroupProps = WebComponentProps<GridColumnGroupElement, GridColumnGroupEventMap>;
export declare const GridColumnGroup: (props: Partial<Omit<React.HTMLAttributes<GridColumnGroupElement<unknown>>, "autofocus" | "header" | "resizable" | "headerRenderer" | "footerRenderer" | "width" | "flexGrow" | "frozen" | "frozenToEnd" | "rowHeader" | "textAlign" | "headerPartName" | "footerPartName"> & {} & Partial<Omit<GridColumnGroupElement<unknown>, keyof HTMLElement>> & {
    autofocus?: boolean;
}> & React.RefAttributes<GridColumnGroupElement<unknown>>) => React.ReactElement | null;
//# sourceMappingURL=GridColumnGroup.d.ts.map