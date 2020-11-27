import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generator from '@babel/generator';
import * as t from '@babel/types';

export default function parseCode(code: string, pages: string[], subPackages: any[]): any {
    const pagesVisitor = {
        ObjectProperty: {
            enter(path: any) {
                if (path.node && path.node.key.name === "pages") {
                    path.remove();
                }
                if (path.node && path.node.key.name === "subPackages") {
                    path.remove();
                }
            }
        }
    };
    const configVisitor = {
        ObjectExpression: {
            enter(path: any, state: any) {
                const expr = path.parentPath.node;
                if (expr.key && expr.key.name === "config") {
                    path.traverse(pagesVisitor, state);
                    const pagesNode = t.objectProperty(t.identifier('pages'), t.valueToNode(pages));
                    const subPackagesNode = t.objectProperty(t.identifier('subPackages'), t.valueToNode(subPackages));
                    path.node.properties.unshift(subPackagesNode);
                    path.node.properties.unshift(pagesNode);
                }
            }
        }
    };
    const appAst = parse(code, {
        sourceType: "module",
        plugins: [
            "jsx",
            "typescript",
            "classProperties",
            "decorators-legacy"
        ]
    });
    traverse(appAst, configVisitor);
    return generator(appAst, {}, code).code;
}