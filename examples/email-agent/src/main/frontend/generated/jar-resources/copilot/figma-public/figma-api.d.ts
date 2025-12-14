import { NodeType, StackAlign, StackCounterAlign, StackJustify, StackMode, StackSize } from 'fig-kiwi/fig-kiwi';
import { ComponentDefinition } from '../shared/flow-utils';
export type SwappedInstance = {
    name: string | undefined;
    symbolDescription: string | undefined;
};
export type PropertyValue = SwappedInstance | boolean | number | string;
export type FigmaNode = {
    type: NodeType | undefined;
    name: string | undefined;
    symbolDescription: string | undefined;
    parent: FigmaNode | undefined;
    children: FigmaNode[];
    htmlTag: string;
    reactTag: string;
    vaadinComponent: boolean;
    vaadinLayout: boolean;
    width: number | undefined;
    height: number | undefined;
    x: number | undefined;
    y: number | undefined;
    classNames: string[];
    styles: Record<string, string>;
    properties: Record<string, PropertyValue>;
    relativePosition: boolean;
    stackMode: StackMode | undefined;
    stackSpacing: number | undefined;
    stackPrimaryAlignItems: StackJustify | undefined;
    stackCounterAlignItems: StackAlign | undefined;
    stackPrimarySizing: StackSize | undefined;
    stackCounterSizing: StackSize | undefined;
    stackChildAlignSelf: StackCounterAlign | undefined;
    stackChildPrimaryGrow: number | undefined;
    stackHorizontalPadding: number | undefined;
    stackVerticalPadding: number | undefined;
    stackPadding: number | undefined;
    stackPaddingBottom: number | undefined;
    stackPaddingRight: number | undefined;
    _innerHTML: string | undefined;
};
export type Importer = (node: FigmaNode, metadata: ImportMetadata) => ComponentDefinition | undefined;
export type ImportMetadata = {
    target: 'java' | 'react';
};
/**
 * Registers a custom importer function that can be used to convert Figma nodes into Vaadin components.
 * <p>
 *   For example if you have a figma component called "AcmeCard" with a marker property `type=AcmeCard` and with two properties for customizing it: title and content,
 *   you can register an importer like this:
 *
 * ```typescript
 * import type { ComponentDefinition, FigmaNode } from 'Frontend/generated/jar-resources/copilot.js';
 * import { _registerImporter } from 'Frontend/generated/jar-resources/copilot.js';
 *
 * function acmeCardImporter(node: FigmaNode): ComponentDefinition | undefined {
 *   if (node.properties.type === 'AcmeCard') {
 *     return {
 *       tag: 'AcmeCard',
 *       props: {
 *         cardTitle: node.properties.title,
 *         cardText: node.properties.content,
 *       },
 *       children: [],
 *       javaClass: 'my.project.components.AcmeCard',
 *       reactImports: {
 *         AcmeCard: 'Frontend/components/AcmeCard',
 *       },
 *     };
 *   }
 * }
 *
 * _registerImporter(acmeCardImporter);
 * ```
 * If you only want to support either Java or React, you can omit the `javaClass` or `reactImports` property respectively.
 *
 * The above content should be placed in a file that is imported only in development mode, for example in `src/main/frontend/figma-importer.ts`.
 * In `index.tsx` you can then place
 * ```typescript
 * // @ts-ignore
 * if (import.meta.env.DEV) {
 *   import('./figma-importer');
 * }
 * ```
 *
 * Registered importers will be used before the built in importers, so you can override the built-in importers if needed.
 *
 * This method is experimental and may change in the future.
 *
 * @param importer the importer to register
 */
export declare function _registerImporter(importer: Importer): void;
export declare function _registerInternalImporter(importer: Importer): void;
export declare function _getImporters(): Importer[];
export declare function _getIcon(node: FigmaNode, enablerKey: string, iconKey: string, slot?: string | undefined): ComponentDefinition | undefined;
export declare function renderNodesAs(htmlTag: string, nodes: Array<FigmaNode | undefined>, metadata: ImportMetadata): ComponentDefinition[];
export declare function renderNodeAs(htmlTag: string, node: FigmaNode, metadata: ImportMetadata, customProperties?: Record<string, string>): ComponentDefinition | undefined;
export declare function renderNodes(childNodes: FigmaNode[], metadata: ImportMetadata): ComponentDefinition[];
export declare function renderNode(node: FigmaNode, metadata: ImportMetadata, customProperties?: Record<string, string>): ComponentDefinition | undefined;
export declare function findChild(node: FigmaNode, matcher: (node: FigmaNode) => boolean): FigmaNode | undefined;
export declare function findFirstChild(node: FigmaNode, name: string): FigmaNode | undefined;
export declare function findAllChildren(node: FigmaNode, matcher: (node: FigmaNode) => boolean): FigmaNode[];
export declare function _createChildrenDefinitions(node: FigmaNode, metadata: ImportMetadata, matcher: (n: FigmaNode) => boolean): ComponentDefinition[];
