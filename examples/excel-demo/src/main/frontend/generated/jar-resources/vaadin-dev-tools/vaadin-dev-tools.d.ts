import { LitElement } from 'lit';
import { Product } from './License';
import { ConnectionStatus } from './connection';
/**
 * Plugin API for the dev tools window.
 */
export interface DevToolsInterface {
    send(command: string, data: any): void;
}
export interface MessageHandler {
    handleMessage(message: ServerMessage): boolean;
}
export interface ServerMessage {
    /**
     * The command
     */
    command: string;
    /**
     * the data for the command
     */
    data: any;
}
/**
 * To create and register a plugin, use e.g.
 * @example
 * export class MyTab extends LitElement implements MessageHandler {
 *   render() {
 *     return html`<div>Here I am</div>`;
 *   }
 * }
 * customElements.define('my-tab', MyTab);
 *
 * const plugin: DevToolsPlugin = {
 *   init: function (devToolsInterface: DevToolsInterface): void {
 *     devToolsInterface.addTab('Tab title', 'my-tab')
 *   }
 * };
 *
 * (window as any).Vaadin.devToolsPlugins.push(plugin);
 */
export interface DevToolsPlugin {
    /**
     * Called once to initialize the plugin.
     *
     * @param devToolsInterface provides methods to interact with the dev tools
     */
    init(devToolsInterface: DevToolsInterface): void;
}
export declare enum MessageType {
    LOG = "log",
    INFORMATION = "information",
    WARNING = "warning",
    ERROR = "error"
}
type DevToolsConf = {
    enable: boolean;
    url: string;
    backend?: string;
    liveReloadPort: number;
    token?: string;
};
export declare class VaadinDevTools extends LitElement {
    unhandledMessages: ServerMessage[];
    conf: DevToolsConf;
    bodyShadowRoot: ShadowRoot | null;
    static get styles(): import("lit").CSSResult[];
    static DISMISSED_NOTIFICATIONS_IN_LOCAL_STORAGE: string;
    static ACTIVE_KEY_IN_SESSION_STORAGE: string;
    static TRIGGERED_KEY_IN_SESSION_STORAGE: string;
    static TRIGGERED_COUNT_KEY_IN_SESSION_STORAGE: string;
    static AUTO_DEMOTE_NOTIFICATION_DELAY: number;
    static HOTSWAP_AGENT: string;
    static JREBEL: string;
    static SPRING_BOOT_DEVTOOLS: string;
    static BACKEND_DISPLAY_NAME: Record<string, string>;
    static get isActive(): boolean;
    frontendStatus: ConnectionStatus;
    javaStatus: ConnectionStatus;
    private root;
    componentPickActive: boolean;
    private javaConnection?;
    private frontendConnection?;
    private nextMessageId;
    private transitionDuration;
    elementTelemetry(): void;
    openWebSocketConnection(): void;
    tabHandleMessage(tabElement: HTMLElement, message: ServerMessage): boolean;
    handleFrontendMessage(message: ServerMessage): void;
    handleHmrMessage(message: ServerMessage): boolean;
    getDedicatedWebSocketUrl(): string | undefined;
    getSpringBootWebSocketUrl(location: any): string;
    connectedCallback(): void;
    initPlugin(plugin: DevToolsPlugin): Promise<void>;
    format(o: any): string;
    checkLicense(productInfo: Product): void;
    startPreTrial(): void;
    downloadLicense(productInfo: Product): void;
    setActive(yes: boolean): void;
    render(): import("lit-html").TemplateResult<1>;
    setJavaLiveReloadActive(active: boolean): void;
}
export {};
