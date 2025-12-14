import type { EventName } from "@lit/react";
import { GridTreeToggle as GridTreeToggleElement, type GridTreeToggleEventMap as _GridTreeToggleEventMap } from "@vaadin/grid/vaadin-grid-tree-toggle.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/grid/vaadin-grid-tree-toggle.js";
export { GridTreeToggleElement, };
export type GridTreeToggleEventMap = Readonly<{
    onExpandedChanged: EventName<_GridTreeToggleEventMap["expanded-changed"]>;
}>;
export type GridTreeToggleProps = WebComponentProps<GridTreeToggleElement, GridTreeToggleEventMap>;
export declare const GridTreeToggle: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<GridTreeToggleElement, Readonly<{
    onExpandedChanged: EventName<_GridTreeToggleEventMap["expanded-changed"]>;
}>>> & React.RefAttributes<GridTreeToggleElement>) => React.ReactElement | null;
//# sourceMappingURL=GridTreeToggle.d.ts.map