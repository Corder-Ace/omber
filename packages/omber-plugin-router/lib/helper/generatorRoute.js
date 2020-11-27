"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var packageNameReg = /^(\/?\w+)\/pages/;
function generatorRoute(config) {
    var test = config.test, filePath = config.filePath, sourcePath = config.sourcePath, tabs = config.tabs, pages = config.pages, subPackages = config.subPackages;
    var regArr = Array.isArray(test) ? test : [test];
    var matchReg = regArr.find(function (reg) { return reg.test(filePath); });
    if (matchReg) {
        var pageFilePath_1 = filePath.replace(path_1.default.normalize(sourcePath + "/"), '').replace(matchReg, '');
        var regResult = pageFilePath_1.match(packageNameReg);
        if (regResult && regResult.length > 1) {
            var packageName_1 = regResult[1].replace(/^(\/|\\)/, '');
            var subPackage = subPackages.find(function (pck) { return pck.root === packageName_1; });
            var subPackagePath = pageFilePath_1.replace(path_1.default.normalize(packageName_1 + "/"), '');
            if (subPackage) {
                subPackage.pages.push(subPackagePath);
            }
            else {
                subPackages.push({
                    "root": packageName_1,
                    "pages": [subPackagePath]
                });
            }
        }
        else {
            var isTab = tabs.find(function (tabPath) { return pageFilePath_1.includes(tabPath); });
            if (!isTab) {
                pages.push(pageFilePath_1);
            }
        }
    }
}
exports.default = generatorRoute;
