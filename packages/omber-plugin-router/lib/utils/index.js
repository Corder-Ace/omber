"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forEach = exports.isArray = void 0;
function isArray(obj) {
    return Array.isArray(obj);
}
exports.isArray = isArray;
function forEach(obj, fn) {
    if (obj === null || typeof obj === 'undefined') {
        return;
    }
    if (typeof obj !== 'object') {
        obj = [obj];
    }
    if (isArray(obj)) {
        // tslint:disable-next-line:one-variable-per-declaration
        for (var i = 0, l = obj.length; i < l; i++) {
            fn && fn.call(null, obj[i], i, obj);
        }
    }
    else {
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                fn && fn.call(null, obj[key], key, obj);
            }
        }
    }
}
exports.forEach = forEach;
