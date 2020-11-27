import fs from 'fs';
import path from 'path';

export interface traversalDirConfig {
    source: string;
    exclude?: RegExp[];
    include?: RegExp[];
    callBack: (fileInfo: fileInfo) => void;
}
type fileInfo = {
    filePath: string;
}
export default function traversalDir(config: traversalDirConfig): void {
    const { source, callBack, exclude = [] } = config;
    const dirTree = fs.readdirSync(config.source);
    dirTree.forEach(dir => {
        const childPath = path.normalize(`${source}/${dir}`);
        const childPathStat = fs.statSync(childPath);
        const isExclude = !(exclude.filter(reg => reg.test(childPath)).length);

        if (childPathStat.isDirectory() && isExclude) {
            traversalDir({ ...config, source: childPath });
        } else {
            if (isExclude) {
                callBack({ filePath: childPath })
            }
        }
    });
}