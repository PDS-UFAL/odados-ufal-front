import { Edition, RevoGrid } from '@revolist/revogrid/dist/types/interfaces';
import { VNode } from '@revolist/revogrid/dist/types/stencil-public-runtime';
import { VueConstructor } from 'vue/types/umd';
export default class VueEditorAdapter {
    private VueEditorConstructor;
    column: RevoGrid.ColumnDataSchemaModel;
    private save;
    private close;
    element: Element | null;
    editCell: Edition.EditCell | null;
    private vueEl;
    constructor(VueEditorConstructor: VueConstructor, column: RevoGrid.ColumnDataSchemaModel, save: Function, close: Function);
    componentDidRender(): void;
    disconnectedCallback(): void;
    render(h: RevoGrid.HyperFunc<VNode>): JSX.Element;
    private renderAdapter;
}
