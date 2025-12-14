import { type ComponentType, type ReactNode } from 'react';
import { type SelectElement, type SelectProps as _SelectProps } from './generated/Select.js';
import type { ReactSimpleRendererProps } from './renderers/useSimpleRenderer.js';
export * from './generated/Select.js';
export type SelectReactRendererProps = ReactSimpleRendererProps<SelectElement>;
type SelectRenderer = ComponentType<SelectReactRendererProps>;
export type SelectProps = Partial<Omit<_SelectProps, 'children' | 'renderer'>> & Readonly<{
    children?: ReactNode | SelectRenderer | Array<ReactNode | SelectRenderer>;
    renderer?: SelectRenderer | null;
}>;
declare const ForwardedSelect: import("react").ForwardRefExoticComponent<Partial<Omit<Partial<import("./utils/createComponent.js").ThemedWebComponentProps<SelectElement, Readonly<{
    onValidated: import("@lit/react").EventName<import("@vaadin/select").SelectEventMap["validated"]>;
    onChange: import("@lit/react").EventName<import("@vaadin/select").SelectEventMap["change"]>;
    onInvalidChanged: import("@lit/react").EventName<import("@vaadin/select").SelectEventMap["invalid-changed"]>;
    onOpenedChanged: import("@lit/react").EventName<import("@vaadin/select").SelectEventMap["opened-changed"]>;
    onValueChanged: import("@lit/react").EventName<import("@vaadin/select").SelectEventMap["value-changed"]>;
}>>>, "children" | "renderer">> & Readonly<{
    children?: ReactNode | SelectRenderer | Array<ReactNode | SelectRenderer>;
    renderer?: SelectRenderer | null;
}> & import("react").RefAttributes<SelectElement>>;
export { ForwardedSelect as Select };
//# sourceMappingURL=Select.d.ts.map