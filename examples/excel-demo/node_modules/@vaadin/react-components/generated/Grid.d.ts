import type { EventName } from "@lit/react";
import { Grid as GridElement, type GridEventMap as _GridEventMap } from "@vaadin/grid/vaadin-grid.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/grid/vaadin-grid.js";
export { GridElement, };
export type GridEventMap<T1> = Readonly<{
    onActiveItemChanged: EventName<_GridEventMap<T1>["active-item-changed"]>;
    onCellActivate: EventName<_GridEventMap<T1>["cell-activate"]>;
    onColumnResize: EventName<_GridEventMap<T1>["column-resize"]>;
    onExpandedItemsChanged: EventName<_GridEventMap<T1>["expanded-items-changed"]>;
    onLoadingChanged: EventName<_GridEventMap<T1>["loading-changed"]>;
    onItemToggle: EventName<_GridEventMap<T1>["item-toggle"]>;
    onSelectedItemsChanged: EventName<_GridEventMap<T1>["selected-items-changed"]>;
    onCellFocus: EventName<_GridEventMap<T1>["cell-focus"]>;
    onColumnReorder: EventName<_GridEventMap<T1>["column-reorder"]>;
    onGridDragend: EventName<_GridEventMap<T1>["grid-dragend"]>;
    onGridDragstart: EventName<_GridEventMap<T1>["grid-dragstart"]>;
    onGridDrop: EventName<_GridEventMap<T1>["grid-drop"]>;
    onSizeChanged: EventName<CustomEvent<unknown>>;
    onDataProviderChanged: EventName<CustomEvent<unknown>>;
}>;
export type GridProps<T1> = WebComponentProps<GridElement<T1>, GridEventMap<T1>>;
export declare const Grid: <T1>(props: GridProps<T1> & React.RefAttributes<GridElement<T1>>) => React.ReactElement | null;
//# sourceMappingURL=Grid.d.ts.map