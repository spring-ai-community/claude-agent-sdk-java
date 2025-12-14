import React, { type ReactNode } from 'react';
import { type TabProps } from './Tab.js';
import { type TabSheetElement, type TabSheetProps as _TabSheetProps } from './generated/TabSheet.js';
export * from './generated/TabSheet.js';
type TabSheetTabProps = Omit<TabProps, 'selected' | 'value'> & {
    /**
     * The label of the tab.
     */
    label?: ReactNode;
};
/**
 * `TabSheetTab` is a helper component designed for creating tabs within a `<TabSheet/>`.
 * Use this component as a direct child of the `<TabSheet/>` component.
 * It accepts a `label` property, which can be either a string or a React node.
 * The children of the component will be rendered as the content of the tab.
 *
 * ### Usage
 *
 * ```tsx
 * <TabSheet>
 *   <TabSheetTab label="Dashboard">
 *     <div>This is the Dashboard tab content</div>
 *   </TabSheetTab>
 *
 *   <TabSheetTab label={<i>Payment</i>}>
 *     <div>This is the Payment tab content</div>
 *   </TabSheetTab>
 * </TabSheet>
 * ```
 */
export declare const TabSheetTab: (_props: TabSheetTabProps) => null;
export type TabSheetProps = Partial<Omit<_TabSheetProps, 'items'>>;
declare const ForwardedTabSheet: React.ForwardRefExoticComponent<Partial<Omit<Partial<import("./utils/createComponent.js").ThemedWebComponentProps<TabSheetElement, Readonly<{
    onItemsChanged: import("@lit/react").EventName<import("@vaadin/tabsheet").TabSheetEventMap["items-changed"]>;
    onSelectedChanged: import("@lit/react").EventName<import("@vaadin/tabsheet").TabSheetEventMap["selected-changed"]>;
}>>>, "items">> & React.RefAttributes<TabSheetElement>>;
export { ForwardedTabSheet as TabSheet };
/**
 * A helper function that allows declaring the tab identifier on the children
 * of the `<TabSheet/>` component
 *
 * ### Usage
 *
 * ```tsx
 * <TabSheet>
 *   <Tabs slot="tabs">
 *     <Tab id="about">About</Tab>
 *     <Tab id="contuct">Contact us</Tab>
 *   </Tabs>
 *   <div {...tab('about')}>This tab is all about,..</div>
 *   <div {...tab('contact')}>Our website: ...</div>
 * </TabSheet>
 * ```
 *
 * @param tab The identifier of the correspoding tab.
 *
 * @returns object with HTML attribute values recognized on tab sheet children.
 * @deprecated Use `<TabSheetTab/>` instead.
 */
export declare function tab(tab: string): Record<string, string>;
//# sourceMappingURL=TabSheet.d.ts.map