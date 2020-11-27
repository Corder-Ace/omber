export function isArray(obj: any): boolean {
    return Array.isArray(obj);
}

export function forEach(obj: any, fn: Function) {
    if (obj === null || typeof obj === 'undefined') {
        return
    }

    if (typeof obj !== 'object') {
        obj = [obj]
    }

    if (isArray(obj)) {
        // tslint:disable-next-line:one-variable-per-declaration
        for (let i = 0, l = obj.length; i < l; i++) {
            fn && fn.call(null, obj[i], i, obj)
        }
    } else {
        for (let key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                fn && fn.call(null, obj[key], key, obj)
            }
        }
    }
}