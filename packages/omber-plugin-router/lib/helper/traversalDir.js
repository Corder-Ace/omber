"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
function traversalDir(config) {
    var source = config.source, callBack = config.callBack, _a = config.exclude, exclude = _a === void 0 ? [] : _a;
    var dirTree = fs_1.default.readdirSync(config.source);
    dirTree.forEach(function (dir) {
        var childPath = path_1.default.normalize(source + "/" + dir);
        var childPathStat = fs_1.default.statSync(childPath);
        var isExclude = !(exclude.filter(function (reg) { return reg.test(childPath); }).length);
        if (childPathStat.isDirectory() && isExclude) {
            traversalDir(__assign(__assign({}, config), { source: childPath }));
        }
        else {
            if (isExclude) {
                callBack({ filePath: childPath });
            }
        }
    });
}
exports.default = traversalDir;
