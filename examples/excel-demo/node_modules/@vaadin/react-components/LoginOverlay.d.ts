import type { HTMLAttributes, ReactElement, RefAttributes } from 'react';
import { LoginOverlayElement, type LoginOverlayProps as _LoginOverlayProps } from './generated/LoginOverlay.js';
export * from './generated/LoginOverlay.js';
type OmittedLoginOverlayHTMLAttributes = Omit<HTMLAttributes<LoginOverlayElement>, 'id' | 'className' | 'dangerouslySetInnerHTML' | 'slot' | 'children' | 'title'>;
export type LoginOverlayProps = Partial<Omit<_LoginOverlayProps, keyof OmittedLoginOverlayHTMLAttributes>>;
export declare const LoginOverlay: (props: LoginOverlayProps & RefAttributes<LoginOverlayElement>) => ReactElement | null;
//# sourceMappingURL=LoginOverlay.d.ts.map