import { IObservableValue } from 'mobx';
import { TemplateResult } from 'lit';
/**
 * Plugin API for the dev tools window.
 */
export interface CopilotInterface {
    send(command: string, data: any): void;
    addPanel(panel: PanelConfiguration): void;
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
     * The data for the command
     */
    data: any;
}
export type Framework = 'flow' | 'hilla-lit' | 'hilla-react';
export interface CopilotPlugin {
    /**
     * Called once to initialize the plugin.
     *
     * @param copilotInterface provides methods to interact with the dev tools
     */
    init(copilotInterface: CopilotInterface): void;
}
export declare enum MessageType {
    INFORMATION = "information",
    WARNING = "warning",
    ERROR = "error"
}
export interface Message {
    id: number;
    type: MessageType;
    message: string;
    timestamp: Date;
    details?: IObservableValue<TemplateResult> | string;
    link?: string;
    persistentId?: string;
    dontShowAgain: boolean;
    deleted: boolean;
}
export interface PanelConfiguration {
    header: string;
    expanded: boolean;
    expandable?: boolean;
    panel?: 'bottom' | 'left' | 'right';
    panelOrder: number;
    tag: string;
    actionsTag?: string;
    floating: boolean;
    height?: number;
    width?: number;
    floatingPosition?: FloatingPosition;
    showWhileDragging?: boolean;
    helpUrl?: string;
    /**
     * These panels can be visible regardless of copilot activation status
     */
    individual?: boolean;
    /**
     * A panel is rendered the first time when it is expanded unless eager is set to true, which causes it be always be rendered
     */
    eager?: boolean;
}
export interface FloatingPosition {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
}
