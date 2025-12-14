import type { ComboBoxDefaultItem } from '@vaadin/combo-box';
import { type ComponentType, type ReactElement, type RefAttributes } from 'react';
import { type ComboBoxLightElement, type ComboBoxLightProps as _ComboBoxLightProps } from './generated/ComboBoxLight.js';
import type { ComboBoxReactRendererProps } from './renderers/combobox.js';
export * from './generated/ComboBoxLight.js';
export type ComboBoxLightProps<TItem> = Partial<Omit<_ComboBoxLightProps<TItem>, 'renderer'>> & Readonly<{
    renderer?: ComponentType<ComboBoxReactRendererProps<TItem>> | null;
}>;
declare const ForwardedComboBoxLight: <TItem = ComboBoxDefaultItem>(props: ComboBoxLightProps<TItem> & RefAttributes<ComboBoxLightElement<TItem>>) => ReactElement | null;
export { ForwardedComboBoxLight as ComboBoxLight };
//# sourceMappingURL=ComboBoxLight.d.ts.map