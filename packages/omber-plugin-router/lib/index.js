"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var traversalDir_1 = __importDefault(require("./helper/traversalDir"));
var parseCode_1 = __importDefault(require("./helper/parseCode"));
var generatorRoute_1 = __importDefault(require("./helper/generatorRoute"));
var default_1 = __importDefault(require("./default"));
var pages = [];
var subPackages = [];
exports.default = (function (ctx, pluginOpts) {
    var _a = ctx.paths, appPath = _a.appPath, sourcePath = _a.sourcePath;
    var packages = pluginOpts.packages, test = pluginOpts.test, exclude = pluginOpts.exclude, tabs = pluginOpts.tabs;
    var rootPackagePath = path_1.default.join(sourcePath, '/pages');
    var fullPathPackages = [rootPackagePath];
    var mergeExclude = __spreadArrays(default_1.default.exclude);
    var appInputPath = path_1.default.join(sourcePath, '/app.tsx');
    if (packages) {
        fullPathPackages.push.apply(fullPathPackages, packages.map(function (pck) { return path_1.default.join(sourcePath, "/" + pck); }));
    }
    if (exclude) {
        mergeExclude.push.apply(mergeExclude, exclude);
    }
    ctx.onBuildStart(function () {
        fullPathPackages.forEach(function (packagePath) {
            traversalDir_1.default({
                source: packagePath,
                exclude: mergeExclude,
                callBack: function (_a) {
                    var filePath = _a.filePath;
                    return generatorRoute_1.default({ filePath: filePath, sourcePath: sourcePath, tabs: tabs, test: test, pages: pages, subPackages: subPackages });
                }
            });
        });
        var appConfig = fs_1.default.readFileSync(appInputPath, "utf8");
        var code = parseCode_1.default(appConfig, __spreadArrays(tabs, pages), subPackages);
        fs_1.default.writeFileSync(appInputPath, code, "utf8");
        fs_1.default.writeFileSync(path_1.default.join(appPath, '/omber.router.json'), JSON.stringify({ pages: __spreadArrays(tabs, pages), subPackages: subPackages }), "utf8");
        pages.length = 0;
        subPackages.length = 0;
    });
    ctx.modifyBuildTempFileContent(function (_a) {
        var tempFiles = _a.tempFiles;
        fullPathPackages.forEach(function (packagePath) {
            traversalDir_1.default({
                source: packagePath,
                exclude: mergeExclude,
                callBack: function (_a) {
                    var filePath = _a.filePath;
                    return generatorRoute_1.default({ filePath: filePath, sourcePath: sourcePath, tabs: tabs, test: test, pages: pages, subPackages: subPackages });
                }
            });
        });
        var appPage = tempFiles[appInputPath];
        appPage.config.pages = __spreadArrays(tabs, pages);
        appPage.config.subPackages = __spreadArrays(subPackages);
        appPage.code = parseCode_1.default(appPage.code, __spreadArrays(tabs, pages), subPackages);
        pages.length = 0;
        subPackages.length = 0;
    });
});
