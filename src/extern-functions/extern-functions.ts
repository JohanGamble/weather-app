/**
* User input function
* @param {String} input
* @returns {String}
**/
export function isNullOrWhitespace(input: string): boolean {
    return !input || !input.trim();
}
/**
* User input function
* @param {String} str
* @param {String} find
* @param {String} replace
* @returns {String}
**/

export function replaceAll(str: string, find: string, replace: string): string {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}


/**
* User input function
* @param {String} str
* @returns {String}
**/
function escapeRegExp(str: string): string {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

/**
* Property extraction interface
* @param {IJSONProperties} container
* @param {String | Number} prop
**/

export interface IJSONProperties {
    container: [] | {},
    prop: string | number
}

/**
 * Property extraction parameters and return value
 * @param {Object | Array} container
 * @param {String | Number} prop
 * @param {IJSONProperties} jsp
 * @returns {String | Number}
 **/

export function extractProperty(jsp: IJSONProperties) {
    let _jsp: any;
    _jsp = jsp;
    for (let value in _jsp.container) {
        if (_jsp.container[value][_jsp.prop]) {
            return _jsp.container[value][_jsp.prop];
        }
        if (value == _jsp.prop) {
            return _jsp.container[value];
        }
        return "Item not found";
    }
}