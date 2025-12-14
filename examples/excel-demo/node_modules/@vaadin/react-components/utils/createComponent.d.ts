import { type EventName } from '@lit/react';
import type { ThemePropertyMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import type React from 'react';
import type { RefAttributes } from 'react';
declare global {
    interface VaadinRegistration {
        is: string;
        version: string;
    }
    interface Vaadin {
        registrations?: VaadinRegistration[];
    }
    interface Window {
        Vaadin?: Vaadin;
    }
}
export type EventNames = Record<string, EventName | string>;
type Constructor<T> = {
    new (): T;
    name: string;
};
type PolymerConstructor<T> = Constructor<T> & {
    _properties: Record<string, unknown>;
};
type Options<I extends HTMLElement, E extends EventNames = {}> = Readonly<{
    displayName?: string;
    elementClass: Constructor<I> | PolymerConstructor<I>;
    events?: E;
    react: typeof window.React;
    tagName: string;
}>;
type EventListeners<R extends EventNames> = {
    [K in keyof R]?: R[K] extends EventName ? (e: R[K]['__eventType']) => void : (e: Event) => void;
};
type ElementProps<I> = Partial<Omit<I, keyof HTMLElement>> & {
    autofocus?: boolean;
};
type ComponentProps<I, E extends EventNames = {}> = Omit<React.HTMLAttributes<I>, keyof E | keyof ElementProps<I>> & EventListeners<E> & ElementProps<I>;
export type ThemedWebComponentProps<I extends ThemePropertyMixinClass & HTMLElement, E extends EventNames = {}> = ComponentProps<I, E> & {
    /**
     * Attribute that can be used by the component to apply built-in style variants,
     * or to propagate its value to the sub-components in Shadow DOM.
     *
     * @see ThemePropertyMixinClass#_theme
     */
    theme?: string;
};
type AllWebComponentProps<I extends HTMLElement, E extends EventNames = {}> = I extends ThemePropertyMixinClass ? ThemedWebComponentProps<I, E> : ComponentProps<I, E>;
export type WebComponentProps<I extends HTMLElement, E extends EventNames = {}> = Partial<AllWebComponentProps<I, E>>;
export declare function createComponent<I extends HTMLElement, E extends EventNames = {}>(options: Options<I, E>): (props: WebComponentProps<I, E> & RefAttributes<I>) => React.ReactElement | null;
export {};
//# sourceMappingURL=createComponent.d.ts.map