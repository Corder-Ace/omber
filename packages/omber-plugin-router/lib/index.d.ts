import { IPluginContext } from '@tarojs/service';
export interface RoutePluginOpts {
    packages?: string[];
    include?: RegExp[];
    exclude?: RegExp[];
    tabs: string[];
    test: RegExp | RegExp[];
}
declare const _default: (ctx: IPluginContext, pluginOpts: RoutePluginOpts) => void;
export default _default;
