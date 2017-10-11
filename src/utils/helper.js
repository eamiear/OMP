/**
 * Created by skz on 2017/10/10 18:03
 */
var _toString = Object.prototype.toString

export const Helper = {
  isUndef: function (v) {
    return v === undefined || v === null
  },
  isDef: function (v) {
    return v !== undefined && v !== null
  },
  isTrue: function (v) {
    return v === true
  },
  isFalse: function (v) {
    return v === false
  },
  /**
   * Check if value is primitive
   */
  isPrimitive: function (value) {
    return (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    )
  },
  /**
   * Quick object check - this is primarily used to tell
   * Objects from primitive values when we know the value
   * is a JSON-compliant type.
   */
  isObject: function (obj) {
    return obj !== null && typeof obj === 'object'
  },
  /**
   * Strict object type check. Only returns true
   * for plain JavaScript objects.
   */
  isPlainObject: function (obj) {
    return _toString.call(obj) === '[object Object]'
  },
  isArray: function (arr) {
    return _toString.call(arr) === '[object Array]'
  },
  isRegExp: function (v) {
    return _toString.call(v) === '[object RegExp]'
  },
  /**
   * Check if val is a valid array index.
   */
  isValidArrayIndex: function (val) {
    var n = parseFloat(val)
    return n >= 0 && Math.floor(n) === n && isFinite(val)
  },
  /**
   * Convert a value to a string that is actually rendered.
   */
  toString: function (val) {
    return val == null
      ? ''
      : typeof val === 'object'
        ? JSON.stringify(val, null, 2)
        : String(val)
  },
  /**
   * Convert a input value to a number for persistence.
   * If the conversion fails, return original string.
   */
  toNumber: function (val) {
    var n = parseFloat(val)
    return isNaN(n) ? val : n
  },
  /**
   * Make a map and return a function for checking if a key
   * is in that map.
   */
  makeMap: function (str, expectsLowerCase) {
    var map = Object.create(null)
    var list = str.split(',')
    for (var i = 0; i < list.length; i++) {
      map[list[i]] = true
    }
    return expectsLowerCase
      ? function (val) { return map[val.toLowerCase()] }
      : function (val) { return map[val] }
  },
  sort: function (val) {
    const keys = Object.keys(val).sort()
    let map = {}
    keys.forEach((key, index) => {
      map[key] = val[key]
    })
    return map
  },
  deepSort: function (params) {
    for (let k in params) {
      if (typeof (params[k]) === 'object' && params[k].length >= 0) { // 数组
        for (let i = 0; i < params[k].length; i++) {
          if (typeof (params[k][i]) === 'object') {
            params[k][i] = this.deepSort(params[k][i])
          }
        }
      } else if (typeof (params[k]) === 'object') { // JSON
        params[k] = this.deepSort(params[k])
      }
    }
    return this.sort(params)
  }
}

