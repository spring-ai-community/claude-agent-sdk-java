import { type ReactElement, type ReactPortal } from 'react';
type ItemWithReactElementComponent<T> = T & {
    component?: ReactElement | string;
    children?: Array<ItemWithReactElementComponent<T>>;
};
type ItemWithHTMLElementComponent<T> = T & {
    component?: HTMLElement | string;
    children?: Array<ItemWithHTMLElementComponent<T>>;
    __item?: ItemWithReactElementComponent<unknown>;
};
/**
 * This function transforms a hierarchical list of items, where each item may contain a React component,
 * into a list of items where each React component is replaced with an HTMLElement.
 *
 * The React components are not simply removed, but are instead rendered into portals.
 * The HTMLElements created for the portals have the given tag name.
 */
export declare function mapItemsWithComponents<T>(items?: Array<ItemWithReactElementComponent<T>>, wrapperTagName?: string): [Array<ReactPortal>, Array<ItemWithHTMLElementComponent<Omit<T, 'children' | 'component'>>> | undefined];
/**
 * Returns the original item related to the given mapped item.
 */
export declare function getOriginalItem<T>(mappedItem: ItemWithHTMLElementComponent<T>): {
    component?: ReactElement | string;
    children?: /*elided*/ any[] | undefined;
} | undefined;
export {};
//# sourceMappingURL=mapItemsWithComponents.d.ts.map