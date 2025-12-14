import type { ComboBoxDefaultItem } from '@vaadin/combo-box';
import { type ComponentType, type ReactElement, type RefAttributes } from 'react';
import { type ComboBoxElement, type ComboBoxProps as _ComboBoxProps } from './generated/ComboBox.js';
import type { ComboBoxReactRendererProps } from './renderers/combobox.js';
export * from './generated/ComboBox.js';
export type ComboBoxProps<TItem> = Partial<Omit<_ComboBoxProps<TItem>, 'renderer'>> & Readonly<{
    renderer?: ComponentType<ComboBoxReactRendererProps<TItem>> | null;
}>;
declare const ForwardedComboBox: <TItem = ComboBoxDefaultItem>(props: ComboBoxProps<TItem> & RefAttributes<ComboBoxElement<TItem>>) => ReactElement | null;
export { ForwardedComboBox as ComboBox };
//# sourceMappingURL=ComboBox.d.ts.map