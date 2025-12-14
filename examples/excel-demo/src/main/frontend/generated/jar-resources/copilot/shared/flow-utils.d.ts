import { FiberNode, Source } from 'react-devtools-inline';
import { CopilotTreeNode } from './copilot-tree';
import { JavaSource } from '../show-in-ide';
export type FlowComponentReference = {
    nodeId: number;
    uiId: number;
};
export type FlowComponentInfo = FlowComponentReference & {
    element: HTMLElement;
    javaClass?: string;
    hiddenByServer: boolean;
    styles: Record<string, string>;
};
export type ComponentDefinitionProperties = Record<string, any[] | Record<string, any> | boolean | number | string | null>;
export type ComponentDefinition = {
    tag?: string;
    className?: string;
    props: ComponentDefinitionProperties;
    children: Array<ComponentDefinition | string>;
    reactImports?: Record<string, string>;
    javaClass?: string;
    metadata?: any;
};
export declare function isFlowComponentInfo(info: FlowComponentInfo | JavaSource | Source | undefined): info is FlowComponentInfo;
export declare function isFlowComponent(element: HTMLElement): boolean;
export declare function getJavaClassName(component: FlowComponentInfo): string | undefined;
export declare function getFlowComponent(element: HTMLElement): FlowComponentInfo | undefined;
export declare const fetchComponentDefinition: (flowComponent: FlowComponentInfo) => Promise<ComponentDefinition>;
export declare function getUIId(): string | undefined;
export declare function getFlowComponentId(flowComponent: FlowComponentInfo): FlowComponentReference;
export declare function isServerRouteContainer(fiber?: FiberNode): boolean;
export declare const isEditableComponentText: (node: CopilotTreeNode | undefined, propertyToCheck: string) => Promise<{
    canBeEdited: boolean;
    isTranslation: boolean;
}> | {
    canBeEdited: boolean;
    isTranslation: boolean;
};
export declare function isServerRouteContainerElement(element: HTMLElement): boolean;
export declare function getSimpleName(className: string): string;
export declare function getPackageName(className: string): string;
