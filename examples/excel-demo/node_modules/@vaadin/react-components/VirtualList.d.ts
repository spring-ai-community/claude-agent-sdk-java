import { type ComponentType, type ReactElement, type RefAttributes } from 'react';
import { type VirtualListDefaultItem, type VirtualListElement, type VirtualListItemModel, type VirtualListProps as _VirtualListProps } from './generated/VirtualList.js';
import { type ReactModelRendererProps } from './renderers/useModelRenderer.js';
export * from './generated/VirtualList.js';
export type VirtualListReactRendererProps<TItem> = ReactModelRendererProps<TItem, VirtualListItemModel<TItem>, VirtualListElement<TItem>>;
export type VirtualListProps<TItem> = Partial<Omit<_VirtualListProps<TItem>, 'children' | 'renderer'>> & Readonly<{
    children?: ComponentType<VirtualListReactRendererProps<TItem>> | null;
    renderer?: ComponentType<VirtualListReactRendererProps<TItem>> | null;
}>;
declare const ForwardedVirtualList: <TItem = VirtualListDefaultItem>(props: VirtualListProps<TItem> & RefAttributes<VirtualListElement<TItem>>) => ReactElement | null;
export { ForwardedVirtualList as VirtualList };
//# sourceMappingURL=VirtualList.d.ts.map