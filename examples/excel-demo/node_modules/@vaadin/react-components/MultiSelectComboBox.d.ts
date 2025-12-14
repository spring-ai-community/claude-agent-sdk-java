import type { ComboBoxDefaultItem } from '@vaadin/combo-box';
import { type ComponentType, type ReactElement, type RefAttributes } from 'react';
import { type MultiSelectComboBoxElement, type MultiSelectComboBoxProps as _MultiSelectComboBoxProps } from './generated/MultiSelectComboBox.js';
import type { MultiSelectComboBoxReactRendererProps } from './renderers/multiSelectCombobox.js';
export * from './generated/MultiSelectComboBox.js';
export type MultiSelectComboBoxProps<TItem> = Partial<Omit<_MultiSelectComboBoxProps<TItem>, 'renderer'>> & Readonly<{
    renderer?: ComponentType<MultiSelectComboBoxReactRendererProps<TItem>> | null;
}>;
declare const ForwardedMultiSelectComboBox: <TItem = ComboBoxDefaultItem>(props: MultiSelectComboBoxProps<TItem> & RefAttributes<MultiSelectComboBoxElement<TItem>>) => ReactElement | null;
export { ForwardedMultiSelectComboBox as MultiSelectComboBox };
//# sourceMappingURL=MultiSelectComboBox.d.ts.map