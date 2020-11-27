import path from 'path';

export interface Config {
    test: RegExp | RegExp[];
    filePath: string;
    sourcePath: string;
    tabs: string[];
    pages: string[];
    subPackages: SubPackages[];
}
export type SubPackages = {
    root: string;
    pages: string[];
}

const packageNameReg = /^(\/?\w+)\/pages/;
export default function generatorRoute(config: Config): void {
    const { test, filePath, sourcePath, tabs, pages, subPackages } = config;
    const regArr = Array.isArray(test) ? test : [test];
    const matchReg = regArr.find(reg => reg.test(filePath));
    if (matchReg) {
        const pageFilePath = filePath.replace(path.normalize(`${sourcePath}/`), '').replace(matchReg, '');
        const regResult = pageFilePath.match(packageNameReg);
        if (regResult && regResult.length > 1) {
            const packageName = regResult[1].replace(/^(\/|\\)/, '');
            const subPackage = subPackages.find(pck => pck.root === packageName);
            const subPackagePath = pageFilePath.replace(path.normalize(`${packageName}/`), '');
            if (subPackage) {
                subPackage.pages.push(subPackagePath);
            } else {
                subPackages.push({
                    "root": packageName,
                    "pages": [subPackagePath]
                });
            }
        } else {
            const isTab = tabs.find(tabPath => pageFilePath.includes(tabPath));
            if (!isTab) {
                pages.push(pageFilePath);
            }
        }
    }
}