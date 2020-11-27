export interface traversalDirConfig {
    source: string;
    exclude?: RegExp[];
    include?: RegExp[];
    callBack: (fileInfo: fileInfo) => void;
}
declare type fileInfo = {
    filePath: string;
};
export default function traversalDir(config: traversalDirConfig): void;
export {};
