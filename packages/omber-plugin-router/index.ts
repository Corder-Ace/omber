import fs from 'fs';
import path from 'path';
import traversalDir from './helper/traversalDir';
import parseCode from './helper/parseCode';
import generatorRoute, {SubPackages} from './helper/generatorRoute';
import defaultConfig from './default';
import {IPluginContext} from '@tarojs/service'

export interface RoutePluginOpts {
    packages?: string[];
    include?: RegExp[];
    exclude?: RegExp[];
    tabs: string[];
    test: RegExp | RegExp[];
}

const pages: string[] = [];
const subPackages: SubPackages[] = [];
export default (ctx: IPluginContext, pluginOpts: RoutePluginOpts) => {
    const {appPath, sourcePath} = ctx.paths;
    const {packages, test, exclude, tabs} = pluginOpts;
    const rootPackagePath = path.join(sourcePath, '/pages');
    const fullPathPackages = [rootPackagePath];
    const mergeExclude = [...defaultConfig.exclude];
    const appInputPath = path.join(sourcePath, '/app.tsx');
    if (packages) {
        fullPathPackages.push(...packages.map(pck => path.join(sourcePath, `/${pck}`)));
    }
    if (exclude) {
        mergeExclude.push(...exclude);
    }
    ctx.onBuildStart(() => {
        fullPathPackages.forEach(packagePath => {
            traversalDir({
                source: packagePath,
                exclude: mergeExclude,
                callBack: ({filePath}) => generatorRoute({filePath, sourcePath, tabs, test, pages, subPackages})
            })
        });
        const appConfig = fs.readFileSync(
            appInputPath,
            "utf8"
        );
        const code = parseCode(appConfig, [...tabs, ...pages], subPackages);
        fs.writeFileSync(
            appInputPath,
            code,
            "utf8",
        );
        fs.writeFileSync(
            path.join(appPath, '/omber.router.json'),
            JSON.stringify({pages: [...tabs, ...pages], subPackages}),
            "utf8",
        );
        pages.length = 0;
        subPackages.length = 0;
    });
    ctx.modifyBuildTempFileContent(({tempFiles}: { tempFiles: any }) => {
        fullPathPackages.forEach(packagePath => {
            traversalDir({
                source: packagePath,
                exclude: mergeExclude,
                callBack: ({filePath}) => generatorRoute({filePath, sourcePath, tabs, test, pages, subPackages})
            })
        });
        const appPage = tempFiles[appInputPath];
        appPage.config.pages = [...tabs, ...pages];
        appPage.config.subPackages = [...subPackages];
        appPage.code = parseCode(appPage.code, [...tabs, ...pages], subPackages);
        pages.length = 0;
        subPackages.length = 0;
    });
};
