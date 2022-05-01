import Vue, { CreateElement } from 'vue';
declare type WatchFunction = (this: Vue, newVal: any, oldVal: any) => void;
declare type WatchResult = {
    [prop: string]: WatchFunction;
};
declare const _default: {
    name: string;
    props: string[];
    watch: WatchResult;
    render(this: Vue, h: CreateElement): JSX.Element;
};
export default _default;
