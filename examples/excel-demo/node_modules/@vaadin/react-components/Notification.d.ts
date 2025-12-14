import { type ComponentType, type ForwardRefExoticComponent, type HTMLAttributes, type ReactNode, type RefAttributes } from 'react';
import { NotificationElement, type NotificationProps as _NotificationProps, type ShowOptions } from './generated/Notification.js';
import type { ReactSimpleRendererProps } from './renderers/useSimpleRenderer.js';
export * from './generated/Notification.js';
export type NotificationReactRendererProps = ReactSimpleRendererProps<NotificationElement>;
type OmittedNotificationHTMLAttributes = Omit<HTMLAttributes<NotificationElement>, 'id' | 'className' | 'dangerouslySetInnerHTML' | 'slot'>;
export type NotificationProps = Partial<Omit<_NotificationProps, 'children' | 'renderer' | keyof OmittedNotificationHTMLAttributes>> & Readonly<{
    children?: ReactNode | ComponentType<NotificationReactRendererProps>;
    renderer?: ComponentType<NotificationReactRendererProps>;
}>;
export type NotificationFunction = ForwardRefExoticComponent<NotificationProps & RefAttributes<NotificationElement>> & {
    show(contents: string, options?: ShowOptions): NotificationElement;
};
declare const ForwardedNotification: NotificationFunction;
export { ForwardedNotification as Notification };
//# sourceMappingURL=Notification.d.ts.map