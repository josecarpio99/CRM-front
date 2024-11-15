export function fillObject(object, data) {
    for (let i in object) {
        if (data.hasOwnProperty(i)) {
            object[i] = data[i];
        }
    }
    return object;
}

/**
 * Flatten a multidimensional object
 *
 * For example:
 *   flattenObject{ a: 1, b: { c: 2 } }
 * Returns:
 *   { a: 1, c: 2}
 */
export const flattenObjectAsArray = (arr, prop) => {
    var a = [];
    for (let i = 0; i < arr.length; i++) {
        let o = arr[i];
        if (o[prop]) {
            let c = flattenObjectAsArray(o[prop], prop);
            if (c) {
                a = a.concat(c);
            }
        }
        a.push(o)
    }
    return a;
}

/**
 * Clears object values
 * @param object
 */
export const clearObject = (object) => {
    for (let i in object) {
        object[i] = null;
    }
};

export const limitStr = (str, chars = 30) => {    
    return str.slice(0, chars) + (str.length > chars ? "..." : "");    
};

export const numberFormatter = Intl.NumberFormat('en', {notation: 'compact'});

export const removeEmpty = (object) => {
    return Object.fromEntries(Object.entries(object).filter(([_, v]) => (v != null && v != '') || typeof v == 'boolean' ));
};

/**
 * Reduce properties
 * @param data
 * @param properties
 * @param singleProperty
 * @returns {*}
 */
export const reduceProperties = (data, properties, singleProperty, removeEmpty = true) => {
    let obj = {};
    for (let i in data) {
        obj[i] = data[i];
    }
    if (!Array.isArray(properties)) {
        properties = [properties];
    }
    for (let i in properties) {
        if (obj.hasOwnProperty(properties[i])) {
            let value = obj[properties[i]];
            let newVal;
            if (Array.isArray(value)) {
                newVal = [];
                for (let j in value) {
                    newVal[j] = value[j] && value[j].hasOwnProperty(singleProperty) ? value[j][singleProperty] : newVal;
                }
            } else if (typeof value === 'object') {
                newVal = value && value.hasOwnProperty(singleProperty) ? value[singleProperty] : newVal;
            } else {
                newVal = value;
            }
            obj[properties[i]] = newVal;
        }
    }

    return removeEmpty ? 
        Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null))
        : obj;
};

export const getPropByString = (obj, propString) => {
    if (!propString)
      return obj;
  
    var prop, props = propString.split('.');
  
    for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
      prop = props[i];
        
      var candidate = obj[prop];
      if (candidate !== undefined) {
        obj = candidate;
      } else {
        break;
      }
    }
    
    return obj ? obj[props[i]] : null;
}

export function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }

  export function money_format(number, decimals = 2) {
    return number.toLocaleString('en-US', { maximumFractionDigits: decimals });
  }

  // create function to limitate the number of decimals
  export function limitDecimals(number, decimals = 2) {
    return number.toFixed(decimals);
  }