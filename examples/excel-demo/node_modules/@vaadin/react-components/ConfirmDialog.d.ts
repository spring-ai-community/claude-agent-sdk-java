import type { HTMLAttributes, ReactElement, RefAttributes } from 'react';
import { ConfirmDialogElement, type ConfirmDialogProps as _ConfirmDialogProps } from './generated/ConfirmDialog.js';
export * from './generated/ConfirmDialog.js';
type OmittedConfirmDialogHTMLAttributes = Omit<HTMLAttributes<ConfirmDialogElement>, 'id' | 'className' | 'dangerouslySetInnerHTML' | 'slot' | 'children' | 'aria-label'>;
export type ConfirmDialogProps = Partial<Omit<_ConfirmDialogProps, keyof OmittedConfirmDialogHTMLAttributes>>;
export declare const ConfirmDialog: (props: ConfirmDialogProps & RefAttributes<ConfirmDialogElement>) => ReactElement | null;
//# sourceMappingURL=ConfirmDialog.d.ts.map