export interface Config {
    test: RegExp | RegExp[];
    filePath: string;
    sourcePath: string;
    tabs: string[];
    pages: string[];
    subPackages: SubPackages[];
}
export declare type SubPackages = {
    root: string;
    pages: string[];
};
export default function generatorRoute(config: Config): void;
