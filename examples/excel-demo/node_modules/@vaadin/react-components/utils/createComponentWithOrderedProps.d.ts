import { type ForwardedRef, type FC } from 'react';
export default function createComponentWithOrderedProps<P extends {}, E extends HTMLElement>(component: FC<P>, ...names: ReadonlyArray<keyof P>): (props: P, ref: ForwardedRef<E>) => import("react").FunctionComponentElement<P>;
//# sourceMappingURL=createComponentWithOrderedProps.d.ts.map