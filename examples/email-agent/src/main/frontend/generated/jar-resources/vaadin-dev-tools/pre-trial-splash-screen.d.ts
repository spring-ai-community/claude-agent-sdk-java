import { ProductAndMessage } from './License';
export declare const showPreTrialSplashScreen: (shadowRoot: ShadowRoot | null, message: ProductAndMessage) => void;
export declare const preTrialStartFailed: (expired: boolean, shadowRoot: ShadowRoot | null) => void;
export declare const updateLicenseDownloadStatus: (action: "started" | "failed" | "completed", shadowRoot: ShadowRoot | null) => void;
