import { Iconset as IconsetElement } from "@vaadin/icon/vaadin-iconset.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/icon/vaadin-iconset.js";
export { IconsetElement, };
export type IconsetEventMap = Readonly<{}>;
export type IconsetProps = WebComponentProps<IconsetElement, IconsetEventMap>;
export declare const Iconset: (props: Partial<Omit<React.HTMLAttributes<IconsetElement>, "autofocus" | "name" | "size"> & {} & Partial<Omit<IconsetElement, keyof HTMLElement>> & {
    autofocus?: boolean;
}> & React.RefAttributes<IconsetElement>) => React.ReactElement | null;
//# sourceMappingURL=Iconset.d.ts.map