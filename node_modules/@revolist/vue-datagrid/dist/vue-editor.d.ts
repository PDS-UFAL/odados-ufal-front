import { RevoGrid } from '@revolist/revogrid/dist/types/interfaces';
import { VueConstructor } from 'vue/types/umd';
import VueEditorAdapter from './vue-editor-adapter';
declare const vueEditor: (vueConstructor: VueConstructor) => (column: RevoGrid.ColumnDataSchemaModel, save: Function, close: Function) => VueEditorAdapter;
export default vueEditor;
