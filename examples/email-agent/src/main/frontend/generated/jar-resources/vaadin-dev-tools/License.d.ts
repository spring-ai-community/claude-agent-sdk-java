import { ServerMessage } from './vaadin-dev-tools';
export interface Product {
    name: string;
    version: string;
}
export interface PreTrial {
    trialName?: String;
    trialState: String;
    daysRemaining?: number;
    daysRemainingUntilRenewal?: number;
}
export interface ProductAndMessage {
    message: string;
    messageHtml?: string;
    product: Product;
    preTrial?: PreTrial;
}
export declare const findAll: (element: Element | ShadowRoot | Document, tags: string[]) => Element[];
export declare const licenseCheckOk: (data: Product) => void;
export declare const licenseCheckFailed: (data: ProductAndMessage) => void;
export declare const licenseCheckNoKey: (data: ProductAndMessage) => void;
export declare const handleLicenseMessage: (message: ServerMessage, bodyShadowRoot: ShadowRoot | null) => boolean;
export declare const startPreTrial: () => void;
export declare const tryAcquireLicense: () => void;
export declare const licenseInit: () => void;
