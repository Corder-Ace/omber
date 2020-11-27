"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("@babel/parser");
var traverse_1 = __importDefault(require("@babel/traverse"));
var generator_1 = __importDefault(require("@babel/generator"));
var t = __importStar(require("@babel/types"));
function parseCode(code, pages, subPackages) {
    var pagesVisitor = {
        ObjectProperty: {
            enter: function (path) {
                if (path.node && path.node.key.name === "pages") {
                    path.remove();
                }
                if (path.node && path.node.key.name === "subPackages") {
                    path.remove();
                }
            }
        }
    };
    var configVisitor = {
        ObjectExpression: {
            enter: function (path, state) {
                var expr = path.parentPath.node;
                if (expr.key && expr.key.name === "config") {
                    path.traverse(pagesVisitor, state);
                    var pagesNode = t.objectProperty(t.identifier('pages'), t.valueToNode(pages));
                    var subPackagesNode = t.objectProperty(t.identifier('subPackages'), t.valueToNode(subPackages));
                    path.node.properties.unshift(subPackagesNode);
                    path.node.properties.unshift(pagesNode);
                }
            }
        }
    };
    var appAst = parser_1.parse(code, {
        sourceType: "module",
        plugins: [
            "jsx",
            "typescript",
            "classProperties",
            "decorators-legacy"
        ]
    });
    traverse_1.default(appAst, configVisitor);
    return generator_1.default(appAst, {}, code).code;
}
exports.default = parseCode;
