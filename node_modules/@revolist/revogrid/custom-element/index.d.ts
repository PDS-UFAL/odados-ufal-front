/* RevoGrid custom elements bundle */

import type { Components, JSX } from "../dist/types/interfaces";

interface RevoGrid extends Components.RevoGrid, HTMLElement {}
export const RevoGrid: {
  prototype: RevoGrid;
  new (): RevoGrid;
};

interface RevogrClipboard extends Components.RevogrClipboard, HTMLElement {}
export const RevogrClipboard: {
  prototype: RevogrClipboard;
  new (): RevogrClipboard;
};

interface RevogrData extends Components.RevogrData, HTMLElement {}
export const RevogrData: {
  prototype: RevogrData;
  new (): RevogrData;
};

interface RevogrEdit extends Components.RevogrEdit, HTMLElement {}
export const RevogrEdit: {
  prototype: RevogrEdit;
  new (): RevogrEdit;
};

interface RevogrFilterPanel extends Components.RevogrFilterPanel, HTMLElement {}
export const RevogrFilterPanel: {
  prototype: RevogrFilterPanel;
  new (): RevogrFilterPanel;
};

interface RevogrFocus extends Components.RevogrFocus, HTMLElement {}
export const RevogrFocus: {
  prototype: RevogrFocus;
  new (): RevogrFocus;
};

interface RevogrHeader extends Components.RevogrHeader, HTMLElement {}
export const RevogrHeader: {
  prototype: RevogrHeader;
  new (): RevogrHeader;
};

interface RevogrOrderEditor extends Components.RevogrOrderEditor, HTMLElement {}
export const RevogrOrderEditor: {
  prototype: RevogrOrderEditor;
  new (): RevogrOrderEditor;
};

interface RevogrOverlaySelection extends Components.RevogrOverlaySelection, HTMLElement {}
export const RevogrOverlaySelection: {
  prototype: RevogrOverlaySelection;
  new (): RevogrOverlaySelection;
};

interface RevogrRowHeaders extends Components.RevogrRowHeaders, HTMLElement {}
export const RevogrRowHeaders: {
  prototype: RevogrRowHeaders;
  new (): RevogrRowHeaders;
};

interface RevogrScrollVirtual extends Components.RevogrScrollVirtual, HTMLElement {}
export const RevogrScrollVirtual: {
  prototype: RevogrScrollVirtual;
  new (): RevogrScrollVirtual;
};

interface RevogrTempRange extends Components.RevogrTempRange, HTMLElement {}
export const RevogrTempRange: {
  prototype: RevogrTempRange;
  new (): RevogrTempRange;
};

interface RevogrViewportScroll extends Components.RevogrViewportScroll, HTMLElement {}
export const RevogrViewportScroll: {
  prototype: RevogrViewportScroll;
  new (): RevogrViewportScroll;
};

/**
 * Utility to define all custom elements within this package using the tag name provided in the component's source. 
 * When defining each custom element, it will also check it's safe to define by:
 *
 * 1. Ensuring the "customElements" registry is available in the global context (window).
 * 2. The component tag name is not already defined.
 *
 * Use the standard [customElements.define()](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define) 
 * method instead to define custom elements individually, or to provide a different tag name.
 */
export declare const defineCustomElements: (opts?: any) => void;

/**
 * Used to manually set the base path where assets can be found.
 * If the script is used as "module", it's recommended to use "import.meta.url",
 * such as "setAssetPath(import.meta.url)". Other options include
 * "setAssetPath(document.currentScript.src)", or using a bundler's replace plugin to
 * dynamically set the path at build time, such as "setAssetPath(process.env.ASSET_PATH)".
 * But do note that this configuration depends on how your script is bundled, or lack of
 * bunding, and where your assets can be loaded from. Additionally custom bundling
 * will have to ensure the static assets are copied to its build directory.
 */
export declare const setAssetPath: (path: string) => void;

export interface SetPlatformOptions {
  raf?: (c: FrameRequestCallback) => number;
  ael?: (el: EventTarget, eventName: string, listener: EventListenerOrEventListenerObject, options: boolean | AddEventListenerOptions) => void;
  rel?: (el: EventTarget, eventName: string, listener: EventListenerOrEventListenerObject, options: boolean | AddEventListenerOptions) => void;
  ce?: (eventName: string, opts?: any) => CustomEvent;
}
export declare const setPlatformOptions: (opts: SetPlatformOptions) => void;

export type { Components, JSX };

export * from '../dist/types';
