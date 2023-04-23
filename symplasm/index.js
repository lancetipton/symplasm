var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/validate-23297ec2.js
var require_validate_23297ec2 = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/validate-23297ec2.js"(exports) {
    "use strict";
    var OPTIONS = {
      SHOULD_LOG: true,
      SHOULD_THROW: false,
      LOG_PREFIX: null
    };
    var defaultValidator = () => true;
    var validate = (argObj, validators = {}, options = {}) => {
      const {
        logs = OPTIONS.SHOULD_LOG,
        throws = OPTIONS.SHOULD_THROW,
        prefix = OPTIONS.LOG_PREFIX
      } = options;
      const validationCaseEntries = Object.entries(argObj);
      const validationResults = validationCaseEntries.map(([argName, argValue]) => validateArgument(argName, argValue, validators[argName] || validators.$default || defaultValidator));
      const reduceCases = (total, next) => validationReducer(total, next, {
        logs,
        throws,
        prefix
      });
      const {
        success,
        cases
      } = validationResults.reduce(reduceCases, {
        success: true,
        cases: {}
      });
      return [success, cases];
    };
    validate.setOptions = ({
      logs,
      throws,
      prefix
    }) => {
      if (logs !== void 0) {
        OPTIONS.SHOULD_LOG = logs;
      }
      if (throws !== void 0) {
        OPTIONS.SHOULD_THROW = throws;
      }
      if (prefix !== void 0) {
        OPTIONS.LOG_PREFIX = prefix;
      }
    };
    validate.resetOptions = () => {
      OPTIONS.SHOULD_LOG = true;
      OPTIONS.SHOULD_THROW = false;
      OPTIONS.LOG_PREFIX = null;
    };
    var validateArgument = (key, value, validator) => {
      const success = validator(value);
      const shouldStringifyValidator = !validator.name || validator.name === key || validator.name === "$default";
      const validatorString = shouldStringifyValidator ? validator.toString() : validator.name;
      const reason = success ? null : [`Argument "${key}" with value `, value, ` failed validator: ${validatorString}.`];
      return {
        success,
        key,
        value,
        validator,
        reason
      };
    };
    var validationReducer = (finalResult, nextValidation, {
      logs,
      throws,
      prefix
    }) => {
      !nextValidation.success && handleFailure(nextValidation, logs, throws, prefix);
      return {
        success: finalResult.success && nextValidation.success,
        cases: {
          ...finalResult.cases,
          [nextValidation.key]: nextValidation
        }
      };
    };
    var handleFailure = (validation, shouldLog, shouldThrow, prefix) => {
      const reason = prefix ? [prefix, ...validation.reason] : validation.reason;
      if (shouldThrow)
        throw new Error(reason.join());
      if (shouldLog)
        console.error(...reason);
    };
    exports.validate = validate;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/isArr-39234014.js
var require_isArr_39234014 = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/isArr-39234014.js"(exports) {
    "use strict";
    var isArr = (value) => Array.isArray(value);
    exports.isArr = isArr;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/isObj-6b3aa807.js
var require_isObj_6b3aa807 = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/isObj-6b3aa807.js"(exports) {
    "use strict";
    var isObj = (obj) => typeof obj === "object" && !Array.isArray(obj) && obj !== null;
    exports.isObj = isObj;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/isFunc-f93803cb.js
var require_isFunc_f93803cb = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/isFunc-f93803cb.js"(exports) {
    "use strict";
    var isFunc = (func) => typeof func === "function";
    exports.isFunc = isFunc;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/isStr-8a57710e.js
var require_isStr_8a57710e = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/isStr-8a57710e.js"(exports) {
    "use strict";
    var isStr = (str) => typeof str === "string";
    exports.isStr = isStr;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/isNum-c7164b50.js
var require_isNum_c7164b50 = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/isNum-c7164b50.js"(exports) {
    "use strict";
    var equalsNaN = (val) => typeof val === "number" && val != val;
    var isNum = (val) => typeof val === "number" && !equalsNaN(val);
    exports.equalsNaN = equalsNaN;
    exports.isNum = isNum;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/isValidDate-813b9419.js
var require_isValidDate_813b9419 = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/isValidDate-813b9419.js"(exports) {
    "use strict";
    var isObj = require_isObj_6b3aa807();
    var isArr = require_isArr_39234014();
    var isStr = require_isStr_8a57710e();
    var isNum = require_isNum_c7164b50();
    var typeOf = (val) => Object.prototype.toString.call(val).slice(8, -1);
    var isEmpty = (val) => isObj.isObj(val) ? Object.keys(val).length === 0 : isArr.isArr(val) ? val.length === 0 : isStr.isStr(val) ? val.trim().length === 0 : isNum.isNum(val) ? val < 1 : false;
    var isSame = (val1, val2) => val1 === val2 ? val1 !== 0 || 1 / val1 === 1 / val2 : val1 !== val1 && val2 !== val2;
    var isValidDate = (date) => !isNaN((date instanceof Date && date || new Date(date)).getTime());
    exports.isEmpty = isEmpty;
    exports.isSame = isSame;
    exports.isValidDate = isValidDate;
    exports.typeOf = typeOf;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/isBool-aa6af74e.js
var require_isBool_aa6af74e = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/isBool-aa6af74e.js"(exports) {
    "use strict";
    var isBool = (val) => typeof val === "boolean";
    exports.isBool = isBool;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/toStr-8e499966.js
var require_toStr_8e499966 = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/toStr-8e499966.js"(exports) {
    "use strict";
    var isStr = require_isStr_8a57710e();
    var toStr2 = (val) => val === null || val === void 0 ? "" : isStr.isStr(val) ? val : JSON.stringify(val);
    exports.toStr = toStr2;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/toBool-deb350e4.js
var require_toBool_deb350e4 = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/toBool-deb350e4.js"(exports) {
    "use strict";
    var toStr2 = require_toStr_8e499966();
    var isBool = require_isBool_aa6af74e();
    var isStrBool = (val) => val === "false" || val === "true";
    var convertToStrBool = (val) => isBool.isBool(val) ? toStr2.toStr(val) : !val || val === "false" || val === "0" ? "false" : "true";
    var toBool = (val) => isStrBool(val) ? val === "true" : convertToStrBool(val) === "true";
    exports.convertToStrBool = convertToStrBool;
    exports.isStrBool = isStrBool;
    exports.toBool = toBool;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/isColl-5757310a.js
var require_isColl_5757310a = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/isColl-5757310a.js"(exports) {
    "use strict";
    var isColl = (val) => typeof val === "object" && val !== null;
    exports.isColl = isColl;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/deepEqual-adba847a.js
var require_deepEqual_adba847a = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/deepEqual-adba847a.js"(exports) {
    "use strict";
    var isColl = require_isColl_5757310a();
    var isArr = require_isArr_39234014();
    var isEmptyColl = (obj) => isArr.isArr(obj) ? obj.length === 0 : isColl.isColl(obj) && Object.getOwnPropertyNames(obj).length === 0;
    var isArray = Array.isArray;
    var keyList = Object.keys;
    var hasProp = Object.prototype.hasOwnProperty;
    var deepEqual = (a, b) => {
      if (a === b)
        return true;
      if (!a || !b || typeof a != "object" || typeof b != "object")
        return a !== a && b !== b;
      const arrA = isArray(a);
      const arrB = isArray(b);
      let i;
      let length;
      let key;
      if (arrA && arrB) {
        length = a.length;
        if (length != b.length)
          return false;
        for (i = length; i-- !== 0; )
          if (!deepEqual(a[i], b[i]))
            return false;
        return true;
      }
      if (arrA != arrB)
        return false;
      const dateA = a instanceof Date;
      const dateB = b instanceof Date;
      if (dateA != dateB)
        return false;
      if (dateA && dateB)
        return a.getTime() == b.getTime();
      const regexpA = a instanceof RegExp;
      const regexpB = b instanceof RegExp;
      if (regexpA != regexpB)
        return false;
      if (regexpA && regexpB)
        return a.toString() == b.toString();
      const keys = keyList(a);
      length = keys.length;
      if (length !== keyList(b).length)
        return false;
      for (i = length; i-- !== 0; )
        if (!hasProp.call(b, keys[i]))
          return false;
      for (i = length; i-- !== 0; ) {
        key = keys[i];
        if (!deepEqual(a[key], b[key]))
          return false;
      }
      return true;
    };
    exports.deepEqual = deepEqual;
    exports.isEmptyColl = isEmptyColl;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/exists-c79204b1.js
var require_exists_c79204b1 = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/exists-c79204b1.js"(exports) {
    "use strict";
    var exists = (value) => value === value && value !== void 0 && value !== null;
    exports.exists = exists;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/isInt-94ce4199.js
var require_isInt_94ce4199 = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/isInt-94ce4199.js"(exports) {
    "use strict";
    var isNum = require_isNum_c7164b50();
    var isNegative = (x) => isNum.isNum(x) && x < 0;
    var isPositive = (x) => isNum.isNum(x) && x > 0;
    var isFloat = (val) => isNum.isNum(val) && val % 1 !== 0;
    var isInt = (val) => isNum.isNum(val) && val % 1 === 0;
    exports.isFloat = isFloat;
    exports.isInt = isInt;
    exports.isNegative = isNegative;
    exports.isPositive = isPositive;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/jsonEqual-7e69ef6a.js
var require_jsonEqual_7e69ef6a = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/jsonEqual-7e69ef6a.js"(exports) {
    "use strict";
    var isStr = require_isStr_8a57710e();
    var isNum = require_isNum_c7164b50();
    var isArr = require_isArr_39234014();
    var isObj = require_isObj_6b3aa807();
    var toBool = require_toBool_deb350e4();
    var hasOwn = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
    var isEntry = (maybeEntry) => isArr.isArr(maybeEntry) && maybeEntry.length === 2 && (isNum.isNum(maybeEntry[0]) || isStr.isStr(maybeEntry[0]));
    var isArrMap = (obj) => {
      if (!isObj.isObj(obj))
        return false;
      const values = Object.values(obj);
      return toBool.toBool(values.length && values.every(isArr.isArr));
    };
    var jsonEqual = (one, two) => {
      try {
        return JSON.stringify(one) === JSON.stringify(two);
      } catch (e) {
        return false;
      }
    };
    exports.hasOwn = hasOwn;
    exports.isArrMap = isArrMap;
    exports.isEntry = isEntry;
    exports.jsonEqual = jsonEqual;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/isQuoted-eb6994da.js
var require_isQuoted_eb6994da = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/isQuoted-eb6994da.js"(exports) {
    "use strict";
    var isStr = require_isStr_8a57710e();
    var isLowerCase = (str) => str === str.toLowerCase();
    var isUpperCase = (str) => str === str.toUpperCase();
    var isEmail = (str) => {
      if (!str || !isStr.isStr(str))
        return false;
      const regex2 = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      return Boolean(regex2.test(str));
    };
    var regex = {
      ipv4: /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/,
      ipv6: /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i
    };
    var isIp = (str) => {
      if (!str || !isStr.isStr(str))
        return false;
      const isIp42 = Boolean(regex.ipv4.test(str));
      return isIp42 || Boolean(regex.ipv6.test(str));
    };
    var isIp4 = (str) => {
      if (!str || !isStr.isStr(str))
        return false;
      return Boolean(regex.ipv4.test(str));
    };
    var isIp6 = (str) => {
      if (!str || !isStr.isStr(str))
        return false;
      return Boolean(regex.ipv6.test(str));
    };
    var isPhone = (str) => {
      if (!str || !isStr.isStr(str))
        return false;
      const regex2 = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
      return Boolean(regex2.test(str)) && str.replace(/\D/g, "").length < 11;
    };
    var isUrl = (str) => {
      const regex2 = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
      return Boolean(regex2.test(str));
    };
    var isUuid = (str) => {
      if (!str || !isStr.isStr(str))
        return false;
      const regex2 = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
      return Boolean(regex2.test(str));
    };
    var quoteSymbols = ['"', "'"];
    var isQuoted = (str, quotes = quoteSymbols) => {
      return isStr.isStr(str) && quotes.some((quote) => str.startsWith(quote) && str.endsWith(quote));
    };
    exports.isEmail = isEmail;
    exports.isIp = isIp;
    exports.isIp4 = isIp4;
    exports.isIp6 = isIp6;
    exports.isLowerCase = isLowerCase;
    exports.isPhone = isPhone;
    exports.isQuoted = isQuoted;
    exports.isUpperCase = isUpperCase;
    exports.isUrl = isUrl;
    exports.isUuid = isUuid;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/isValidUrl-a77135f0.js
var require_isValidUrl_a77135f0 = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/isValidUrl-a77135f0.js"(exports) {
    "use strict";
    var isValidUrl = (str) => {
      var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
      return regexp.test(str);
    };
    exports.isValidUrl = isValidUrl;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/not-16fa9c85.js
var require_not_16fa9c85 = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/not-16fa9c85.js"(exports) {
    "use strict";
    var isArr = require_isArr_39234014();
    var isValidDate = require_isValidDate_813b9419();
    var isFunc = require_isFunc_f93803cb();
    var isBool = require_isBool_aa6af74e();
    var toBool = require_toBool_deb350e4();
    var isColl = require_isColl_5757310a();
    var deepEqual = require_deepEqual_adba847a();
    var exists = require_exists_c79204b1();
    var isStr = require_isStr_8a57710e();
    var isNum = require_isNum_c7164b50();
    var isInt = require_isInt_94ce4199();
    var jsonEqual = require_jsonEqual_7e69ef6a();
    var isObj = require_isObj_6b3aa807();
    var isQuoted = require_isQuoted_eb6994da();
    var isValidUrl = require_isValidUrl_a77135f0();
    var isOrderable = (x) => isStr.isStr(x) || isNum.isNum(x) || isBool.isBool(x);
    var identity = (x) => x;
    var match = (matchArg, ...args) => {
      if (!args.length)
        return null;
      for (let entry of args) {
        if (!isArr.isArr(entry)) {
          console.error(`Matching case must be an entry (a 2-element array). Found: ${isValidDate.typeOf(entry)}`, entry);
          break;
        }
        const [caseValueOrPredicate, valueOnMatch] = entry;
        if (isFunc.isFunc(caseValueOrPredicate) && caseValueOrPredicate(matchArg))
          return valueOnMatch;
        if (caseValueOrPredicate === matchArg)
          return valueOnMatch;
      }
      return null;
    };
    match.default = () => true;
    var hasDomAccess = () => {
      try {
        return !!(typeof window !== "undefined" && window.document && window.document.createElement);
      } catch (error) {
        return false;
      }
    };
    var isRegex = (val) => Boolean(val && val instanceof RegExp);
    var not = (func) => {
      return (...args) => !func.apply(null, args);
    };
    not.bool = not(isBool.isBool);
    not.strBool = not(toBool.isStrBool);
    not.coll = not(isColl.isColl);
    not.deepEqual = not(deepEqual.deepEqual);
    not.emptyColl = not(deepEqual.isEmptyColl);
    not.dom = not(hasDomAccess);
    not.exists = not(exists.exists);
    not.empty = not(isValidDate.isEmpty);
    not.same = not(isValidDate.isSame);
    not.validDate = not(isValidDate.isValidDate);
    not.func = not(isFunc.isFunc);
    not.identity = not(identity);
    not.orderable = not(isOrderable);
    not.equalsNaN = not(isNum.equalsNaN);
    not.float = not(isInt.isFloat);
    not.int = not(isInt.isInt);
    not.num = not(isNum.isNum);
    not.negative = not(isInt.isNegative);
    not.positive = not(isInt.isPositive);
    not.hasOwn = not(jsonEqual.hasOwn);
    not.entry = not(jsonEqual.isEntry);
    not.arrMap = not(jsonEqual.isArrMap);
    not.obj = not(isObj.isObj);
    not.jsonEqual = not(jsonEqual.jsonEqual);
    not.regex = not(isRegex);
    not.email = not(isQuoted.isEmail);
    not.ip = not(isQuoted.isIp);
    not.lowerCase = not(isQuoted.isLowerCase);
    not.phone = not(isQuoted.isPhone);
    not.quoted = not(isQuoted.isQuoted);
    not.str = not(isStr.isStr);
    not.upperCase = not(isQuoted.isUpperCase);
    not.url = not(isQuoted.isUrl);
    not.uuid = not(isQuoted.isUuid);
    not.validUrl = not(isValidUrl.isValidUrl);
    exports.hasDomAccess = hasDomAccess;
    exports.identity = identity;
    exports.isOrderable = isOrderable;
    exports.isRegex = isRegex;
    exports.match = match;
    exports.not = not;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/compareTo-d69e4abf.js
var require_compareTo_d69e4abf = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/compareTo-d69e4abf.js"(exports) {
    "use strict";
    var isStr = require_isStr_8a57710e();
    var not = require_not_16fa9c85();
    var validate = require_validate_23297ec2();
    var compareTo = (x, y) => {
      const [valid] = validate.validate({
        x,
        y
      }, {
        $default: not.isOrderable
      });
      if (!valid)
        return null;
      return isStr.isStr(x) ? x.localeCompare(y) : x - y;
    };
    exports.compareTo = compareTo;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/noOps-b5f3c7e4.js
var require_noOps_b5f3c7e4 = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/noOps-b5f3c7e4.js"(exports) {
    "use strict";
    var isFunc = require_isFunc_f93803cb();
    var deepFreeze = (obj) => {
      Object.freeze(obj);
      Object.getOwnPropertyNames(obj).map((prop) => {
        obj.hasOwnProperty(prop) && obj[prop] !== null && (typeof obj[prop] === "object" || isFunc.isFunc(obj[prop])) && !Object.isFrozen(obj[prop]) && deepFreeze(obj[prop]);
      });
      return obj;
    };
    var noOpObj = Object.freeze({});
    var emptyObj2 = noOpObj;
    var noPropObj = deepFreeze({
      content: {}
    });
    var noPropArr = deepFreeze([]);
    var noOpArr = noPropArr;
    var emptyArr = noPropArr;
    exports.deepFreeze = deepFreeze;
    exports.emptyArr = emptyArr;
    exports.emptyObj = emptyObj2;
    exports.noOpArr = noOpArr;
    exports.noOpObj = noOpObj;
    exports.noPropArr = noPropArr;
    exports.noPropObj = noPropObj;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/isNonNegative-9959647c.js
var require_isNonNegative_9959647c = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/isNonNegative-9959647c.js"(exports) {
    "use strict";
    var isNum = require_isNum_c7164b50();
    var isNonNegative = (val) => isNum.isNum(val) && val >= 0;
    exports.isNonNegative = isNonNegative;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/intersect-6fe7b944.js
var require_intersect_6fe7b944 = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/intersect-6fe7b944.js"(exports) {
    "use strict";
    var validate = require_validate_23297ec2();
    var isArr = require_isArr_39234014();
    var isObj = require_isObj_6b3aa807();
    var isFunc = require_isFunc_f93803cb();
    var compareTo = require_compareTo_d69e4abf();
    var not = require_not_16fa9c85();
    var noOps = require_noOps_b5f3c7e4();
    var isNonNegative = require_isNonNegative_9959647c();
    var exists = require_exists_c79204b1();
    var buildElementCountMap = (arr) => {
      const counts = /* @__PURE__ */ new Map();
      for (let i = 0; i < arr.length; i++) {
        var _counts$get;
        const element = arr[i];
        const count = (_counts$get = counts.get(element)) !== null && _counts$get !== void 0 ? _counts$get : 0;
        counts.set(element, count + 1);
      }
      return counts;
    };
    var areCountMapsEqual = (mapA, mapB) => {
      if (mapA.size !== mapB.size)
        return false;
      for (let [key, count] of mapA) {
        const otherCount = mapB.get(key);
        if (otherCount !== count)
          return false;
      }
      return true;
    };
    var areFrequencyEqual = (arr, otherArr) => {
      const [valid] = validate.validate({
        arr,
        otherArr
      }, {
        $default: isArr.isArr
      });
      if (!valid)
        return null;
      if (arr === otherArr)
        return true;
      if (arr.length !== otherArr.length)
        return false;
      const arrCounts = buildElementCountMap(arr);
      const otherCounts = buildElementCountMap(otherArr);
      return areCountMapsEqual(arrCounts, otherCounts);
    };
    var areSetEqual = (arr, otherArr) => {
      const [valid] = validate.validate({
        arr,
        otherArr
      }, {
        $default: isArr.isArr
      });
      if (!valid)
        return null;
      if (arr === otherArr)
        return true;
      const [longest, shortest] = arr.length > otherArr.length ? [arr, otherArr] : [otherArr, arr];
      const arrSet = new Set(shortest);
      for (let i = 0; i < longest.length; i++) {
        const element = longest[i];
        if (!arrSet.has(element))
          return false;
      }
      return true;
    };
    var cloneArr = (arr) => Array.from([
      ...isArr.isArr(arr) && arr || isObj.isObj(arr) && Object.entries(arr) || []
    ]);
    var eitherArr = (a, b) => isArr.isArr(a) ? a : b;
    var flatten = (arr, result, opts3) => {
      for (let i = 0; i < arr.length; i++) {
        const value = arr[i];
        isArr.isArr(value) ? flatten(value, result, opts3) : opts3.exists && !exists.exists(value) || opts3.truthy && !value ? result : result.push(value);
      }
      if (!opts3.mutate)
        return result;
      Object.assign(arr, result).splice(result.length);
      return arr;
    };
    var flatArr = (arr, opts3) => flatten(arr, [], isObj.isObj(opts3) ? opts3 : noOps.noOpObj);
    var flatMap = (arr, mapFn) => {
      const [inputIsValid] = validate.validate({
        arr,
        mapFn
      }, {
        arr: isArr.isArr,
        mapFn: isFunc.isFunc
      });
      if (!inputIsValid)
        return arr;
      return arr.reduce((finalArr, current) => {
        const result = mapFn(current);
        isArr.isArr(result) ? result.map((el) => finalArr.push(el)) : finalArr.push(result);
        return finalArr;
      }, []);
    };
    var findExtrema = (arr, comparator) => {
      const [valid] = validate.validate({
        arr,
        comparator
      }, {
        arr: isArr.isArr,
        $default: isFunc.isFunc
      });
      if (!valid)
        return null;
      return arr.length ? arr.reduce((extremaSoFar, next) => comparator(extremaSoFar, next) > 0 ? extremaSoFar : next) : null;
    };
    var findMax = (arr = [], propSelector = not.identity) => findExtrema(arr, (x, y) => compareTo.compareTo(propSelector(x), propSelector(y)));
    var findMin = (arr = [], propSelector = not.identity) => findExtrema(arr, (x, y) => compareTo.compareTo(propSelector(y), propSelector(x)));
    var omitRange = (arr, startIndex, count) => {
      const [inputIsValid] = validate.validate({
        arr,
        startIndex,
        count
      }, {
        arr: isArr.isArr,
        $default: isNonNegative.isNonNegative
      });
      if (!inputIsValid)
        return arr;
      const nextArr = [...arr];
      nextArr.splice(startIndex, count);
      return nextArr;
    };
    var randomArr = (arr, amount) => {
      if (!isArr.isArr(arr))
        return arr;
      const useAmount = amount || 1;
      const randoms = [];
      for (let i = 0; i < useAmount; i++) {
        randoms.push(arr[Math.floor(Math.random() * arr.length)]);
      }
      return !amount ? randoms[0] : randoms;
    };
    var randomizeArr = (arr) => !isArr.isArr(arr) && arr || arr.sort(() => 0.5 - Math.random());
    var uniqArrByReference = (arr) => {
      return !isArr.isArr(arr) ? arr : arr.filter((e, i, arr2) => arr2.indexOf(e) == i);
    };
    var uniqArr = (arr, selector) => {
      if (!selector)
        return uniqArrByReference(arr);
      const {
        unique
      } = arr.reduce((data, element, index) => {
        const id = selector(element, index);
        !data.set.has(id) && data.unique.push(element);
        data.set.add(id);
        return data;
      }, {
        unique: [],
        set: /* @__PURE__ */ new Set()
      });
      return unique;
    };
    var flatUnion = (...args) => {
      const last = args.pop();
      const opts3 = {
        exists: true
      };
      const compare = isFunc.isFunc(last) ? last : args.push(last) && void 0;
      return args.reduce((merged, arr) => {
        if (!isArr.isArr(arr))
          return merged;
        return uniqArr(flatArr([...merged, ...arr], opts3), compare);
      }, []);
    };
    var intersect = (arrA, arrB) => {
      if (!isArr.isArr(arrA) || !isArr.isArr(arrB))
        return [];
      const setB = new Set(arrB);
      return [...new Set(arrA)].filter((x) => setB.has(x));
    };
    exports.areCountMapsEqual = areCountMapsEqual;
    exports.areFrequencyEqual = areFrequencyEqual;
    exports.areSetEqual = areSetEqual;
    exports.buildElementCountMap = buildElementCountMap;
    exports.cloneArr = cloneArr;
    exports.eitherArr = eitherArr;
    exports.findExtrema = findExtrema;
    exports.findMax = findMax;
    exports.findMin = findMin;
    exports.flatArr = flatArr;
    exports.flatMap = flatMap;
    exports.flatUnion = flatUnion;
    exports.intersect = intersect;
    exports.omitRange = omitRange;
    exports.randomArr = randomArr;
    exports.randomizeArr = randomizeArr;
    exports.uniqArr = uniqArr;
    exports.uniqArrByReference = uniqArrByReference;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/ensureArr-ae68c041.js
var require_ensureArr_ae68c041 = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/ensureArr-ae68c041.js"(exports) {
    "use strict";
    var isArr = require_isArr_39234014();
    var ensureArr = (val) => isArr.isArr(val) ? val : [val];
    exports.ensureArr = ensureArr;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/softFalsy-3d7ead1c.js
var require_softFalsy_3d7ead1c = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/softFalsy-3d7ead1c.js"(exports) {
    "use strict";
    var softFalsy = (val) => Boolean(val || val === "" || val === 0);
    exports.softFalsy = softFalsy;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/set-c0a98b21.js
var require_set_c0a98b21 = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/set-c0a98b21.js"(exports) {
    "use strict";
    var isFunc = require_isFunc_f93803cb();
    var isArr = require_isArr_39234014();
    var isColl = require_isColl_5757310a();
    var updateColl = (obj, path, type, val) => {
      const org = obj;
      if (!isColl.isColl(obj) || !obj || !path)
        return type !== "set" && val || void 0;
      const parts = isArr.isArr(path) ? Array.from(path) : path.split(".");
      const key = parts.pop();
      let prop;
      let breakPath;
      while (prop = parts.shift()) {
        const next = obj[prop];
        isColl.isColl(next) || isFunc.isFunc(next) ? obj = next : (() => {
          if (type === "set")
            obj[prop] = {};
          else
            breakPath = true;
          obj = obj[prop];
        })();
        if (breakPath)
          return val;
      }
      return type === "get" ? key in obj ? obj[key] : val : type === "unset" ? delete obj[key] : (obj[key] = val) && org || org;
    };
    var set = (obj, path, val) => {
      updateColl(obj, path, "set", val);
      return obj;
    };
    exports.set = set;
    exports.updateColl = updateColl;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/get-00626335.js
var require_get_00626335 = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/get-00626335.js"(exports) {
    "use strict";
    var exists = require_exists_c79204b1();
    var isArr = require_isArr_39234014();
    var isStr = require_isStr_8a57710e();
    var get = (obj, path, fallback) => {
      const isPathArr = isArr.isArr(path);
      if (!isStr.isStr(path) && !isPathArr)
        return exists.exists(fallback) ? fallback : void 0;
      const parts = isPathArr ? path : path.split(".");
      const result = parts.reduce((obj2, prop) => {
        const type = typeof obj2;
        if (!exists.exists(obj2) || type !== "object" && type !== "function")
          return void 0;
        prop = prop.startsWith("[") ? prop.replace(/\D/g, "") : prop;
        return obj2[prop];
      }, obj);
      return exists.exists(result) ? result : fallback;
    };
    exports.get = get;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/deepClone-ae664a21.js
var require_deepClone_ae664a21 = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/deepClone-ae664a21.js"(exports) {
    "use strict";
    var isFunc = require_isFunc_f93803cb();
    var get = require_get_00626335();
    var isArr = require_isArr_39234014();
    var cloneFunc = (func) => {
      const funcClone = function(...args) {
        return func instanceof funcClone ? (() => {
          return new func(...args);
        })() : get.get(func.prototype, "constructor.name") ? new func(...args) : func.apply(func, args);
      };
      for (let key in func)
        func.hasOwnProperty(key) && (funcClone[key] = func[key]);
      Object.defineProperty(funcClone, "name", {
        value: func.name,
        configurable: true
      });
      funcClone.toString = () => func.toString();
      return funcClone;
    };
    var deepClone = (obj, hash = /* @__PURE__ */ new WeakMap()) => {
      if (Object(obj) !== obj)
        return obj;
      if (obj instanceof Set)
        return new Set(obj);
      if (hash.has(obj))
        return hash.get(obj);
      if (isArr.isArr(obj))
        return obj.map((x) => deepClone(x));
      if (isFunc.isFunc(obj))
        return cloneFunc(obj);
      const result = obj instanceof Date ? new Date(obj) : obj instanceof RegExp ? new RegExp(obj.source, obj.flags) : !obj.constructor ? /* @__PURE__ */ Object.create(null) : null;
      if (result === null)
        return cloneObjWithPrototypeAndProperties(obj);
      hash.set(obj, result);
      if (obj instanceof Map)
        return Array.from(obj, ([key, val]) => result.set(key, deepClone(val, hash)));
      return Object.assign(result, ...Object.keys(obj).map((key) => ({
        [key]: deepClone(obj[key], hash)
      })));
    };
    var cloneObjWithPrototypeAndProperties = (objectWithPrototype) => {
      if (!objectWithPrototype)
        return objectWithPrototype;
      const prototype = Object.getPrototypeOf(objectWithPrototype);
      const sourceDescriptors = Object.getOwnPropertyDescriptors(objectWithPrototype);
      for (const [key, descriptor] of Object.entries(sourceDescriptors)) {
        descriptor.value && (sourceDescriptors[key].value = deepClone(descriptor.value));
      }
      const clone = Object.create(prototype, sourceDescriptors);
      if (Object.isFrozen(objectWithPrototype))
        Object.freeze(clone);
      if (Object.isSealed(objectWithPrototype))
        Object.seal(clone);
      return clone;
    };
    exports.cloneFunc = cloneFunc;
    exports.cloneObjWithPrototypeAndProperties = cloneObjWithPrototypeAndProperties;
    exports.deepClone = deepClone;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/shallowEqual-eaf2262d.js
var require_shallowEqual_eaf2262d = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/shallowEqual-eaf2262d.js"(exports) {
    "use strict";
    var isObj = require_isObj_6b3aa807();
    var isColl = require_isColl_5757310a();
    var isFunc = require_isFunc_f93803cb();
    var isArr = require_isArr_39234014();
    var exists = require_exists_c79204b1();
    var validate = require_validate_23297ec2();
    var set = require_set_c0a98b21();
    var deepClone = require_deepClone_ae664a21();
    var isNum = require_isNum_c7164b50();
    var get = require_get_00626335();
    var isStr = require_isStr_8a57710e();
    var cleanColl = (coll, recursive = true) => {
      return isColl.isColl(coll) ? Object.keys(coll).reduce((cleaned, key) => {
        const value = coll[key];
        if (value === null || value === void 0)
          return cleaned;
        cleaned[key] = recursive && isColl.isColl(value) ? cleanColl(value) : value;
        return cleaned;
      }, isObj.isObj(coll) && {} || []) : console.error(`cleanColl requires a collection as the first argument`) || coll;
    };
    var mapColl = (coll, cb) => isFunc.isFunc(cb) && isColl.isColl(coll) ? Object.keys(coll).map((key) => cb(key, coll[key], coll)) : isArr.isArr(coll) ? [] : {};
    var mapFindArr = (arr, mapper, testFunc) => {
      for (let i = 0; i < arr.length; i++) {
        const mappedValue = mapper(arr[i], i, i);
        if (testFunc(mappedValue, i, i))
          return mappedValue;
      }
      return null;
    };
    var mapFindObj = (obj, mapper, testFunc) => {
      let idx = 0;
      for (let key in obj) {
        if (!obj.hasOwnProperty(key))
          continue;
        const value = obj[key];
        const mappedValue = mapper(value, key, idx);
        if (testFunc(mappedValue, key, idx))
          return mappedValue;
        idx++;
      }
      return null;
    };
    var mapFind = (coll, mapper, testFunc = exists.exists) => {
      const [valid] = validate.validate({
        coll,
        mapper,
        testFunc
      }, {
        coll: isColl.isColl,
        $default: isFunc.isFunc
      });
      if (!valid)
        return void 0;
      return isObj.isObj(coll) ? mapFindObj(coll, mapper, testFunc) : mapFindArr(coll, mapper, testFunc);
    };
    var reduceColl = (coll, cb, reduce) => isFunc.isFunc(cb) && isColl.isColl(coll) ? Object.keys(coll).reduce((data, key) => cb(key, coll[key], coll, data), reduce) : isArr.isArr(coll) ? [] : {};
    var unset = (obj, path) => {
      set.updateColl(obj, path, "unset");
      return obj;
    };
    var repeat = (element, times, cloneDeep = false) => {
      if (!times || times <= 0)
        return [];
      if (!isNum.isNum(times)) {
        console.error("Times argument must be a number");
        return [];
      }
      const arr = [];
      for (let i = 0; i < times; i++) {
        const value = isFunc.isFunc(element) ? element() : cloneDeep ? deepClone.deepClone(element) : element;
        arr.push(value);
      }
      return arr;
    };
    var shallowEqual = (col1, col2, path) => {
      if (path && (isArr.isArr(path) || isStr.isStr(path))) {
        col1 = get.get(col1, path);
        col2 = get.get(col2, path);
      }
      if (col1 === col2)
        return true;
      if (!col1 || !isColl.isColl(col1) || !col2 || !isColl.isColl(col2))
        return false;
      if (Object.keys(col1).length !== Object.keys(col2).length)
        return false;
      for (const key in col1)
        if (col1[key] !== col2[key])
          return false;
      return true;
    };
    exports.cleanColl = cleanColl;
    exports.mapColl = mapColl;
    exports.mapFind = mapFind;
    exports.reduceColl = reduceColl;
    exports.repeat = repeat;
    exports.shallowEqual = shallowEqual;
    exports.unset = unset;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/either-81805472.js
var require_either_81805472 = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/either-81805472.js"(exports) {
    "use strict";
    var softFalsy = require_softFalsy_3d7ead1c();
    var isFunc = require_isFunc_f93803cb();
    var either = (val1, val2, check) => !isFunc.isFunc(check) ? softFalsy.softFalsy(val1) && val1 || val2 : check(val1, val2) && val1 || val2;
    exports.either = either;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/toNum-eeb2e51e.js
var require_toNum_eeb2e51e = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/toNum-eeb2e51e.js"(exports) {
    "use strict";
    var isNum = require_isNum_c7164b50();
    var toStr2 = require_toStr_8e499966();
    var getNums = (val) => toStr2.toStr(val).replace(/([^.\d])/gm, "");
    var toNum = (val) => isNum.isNum(val) ? val : val && !isNum.equalsNaN(val) && Number(getNums(val)) || 0;
    exports.getNums = getNums;
    exports.toNum = toNum;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/strToType-00c4481f.js
var require_strToType_00c4481f = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/strToType-00c4481f.js"(exports) {
    "use strict";
    var isStr = require_isStr_8a57710e();
    var isNum = require_isNum_c7164b50();
    var toNum = require_toNum_eeb2e51e();
    var toBool = require_toBool_deb350e4();
    var strToType = (val) => {
      return !val || !isStr.isStr(val) ? val : toBool.isStrBool(val) ? toBool.toBool(val) : isNum.isNum(val) ? toNum.toNum(val) : (() => {
        try {
          return JSON.parse(val);
        } catch (e) {
          return val;
        }
      })();
    };
    exports.strToType = strToType;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/log-37bbfac6.js
var require_log_37bbfac6 = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/log-37bbfac6.js"(exports) {
    "use strict";
    var SHOW_LOGS;
    var METH_DEF = "dir";
    var PREFIX = "type";
    var LOG_TYPES = ["error", "info", "log", "dir", "warn"];
    var setLogs = (log, methDef, prefix) => {
      SHOW_LOGS = log;
      METH_DEF = methDef || METH_DEF || "log";
      PREFIX = prefix || PREFIX || "type";
    };
    var resetLogs = () => {
      SHOW_LOGS = void 0;
      METH_DEF = "log";
      PREFIX = "type";
    };
    var logData = (...args) => {
      if (!args.length)
        return;
      let type = args.length === 1 ? METH_DEF : args.pop();
      if (!SHOW_LOGS && type !== "error")
        return;
      else if (typeof args[0] === "string") {
        if (PREFIX === "type")
          args[0] = `[ ${type.toUpperCase()} ] ${args[0]}`;
        else if (PREFIX)
          args[0] = `${PREFIX} ${args[0]}`;
      }
      LOG_TYPES.indexOf(type) !== -1 ? console[type](...args) : console[METH_DEF](...args, type);
    };
    exports.logData = logData;
    exports.resetLogs = resetLogs;
    exports.setLogs = setLogs;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/pipeline-e65bdaae.js
var require_pipeline_e65bdaae = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/pipeline-e65bdaae.js"(exports) {
    "use strict";
    var isArr = require_isArr_39234014();
    var isFunc = require_isFunc_f93803cb();
    var applyToFunc = (item, expression) => {
      if (isArr.isArr(expression)) {
        const [func, ...args] = expression;
        return func(item, ...args);
      } else if (isFunc.isFunc(expression)) {
        return expression(item);
      } else {
        console.error(`Pipeline expected either a function or an array (for function expressions). Found ${typeof expression}`);
        return item;
      }
    };
    var pipeline = (item, ...functions) => {
      return functions.reduce((result, fn) => applyToFunc(result, fn), item);
    };
    exports.applyToFunc = applyToFunc;
    exports.pipeline = pipeline;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/stackTracePaths-a7780a09.js
var require_stackTracePaths_a7780a09 = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/stackTracePaths-a7780a09.js"(exports) {
    "use strict";
    var isFunc = require_isFunc_f93803cb();
    var validate = require_validate_23297ec2();
    var isNum = require_isNum_c7164b50();
    var jsonEqual = require_jsonEqual_7e69ef6a();
    var isArr = require_isArr_39234014();
    var deepClone = require_deepClone_ae664a21();
    var noOps = require_noOps_b5f3c7e4();
    var isStr = require_isStr_8a57710e();
    var isObj = require_isObj_6b3aa807();
    var isValidDate = require_isValidDate_813b9419();
    var checkCall = (method, ...params) => {
      return isFunc.isFunc(method) ? method(...params) : void 0;
    };
    var complement = (predicate) => {
      const [valid] = validate.validate({
        predicate
      }, {
        predicate: isFunc.isFunc
      });
      return valid ? (...args) => !predicate(...args) : null;
    };
    var eitherFunc = (func1, func2) => isFunc.isFunc(func1) && func1 || func2;
    var debounce = (func, wait = 250, immediate = false) => {
      let timeout;
      function wrapFunc(...args) {
        if (!isFunc.isFunc(func))
          return null;
        const context = this;
        const later = () => {
          timeout = null;
          !immediate && func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow)
          return isFunc.isFunc(func) && func.apply(context, args);
      }
      return wrapFunc;
    };
    var doIt = (...args) => {
      const params = args.slice();
      const num = params.shift();
      const bindTo = params.shift();
      const cb = params.pop();
      if (!isNum.isNum(num) || !isFunc.isFunc(cb))
        return [];
      const doItAmount = new Array(num);
      const responses = [];
      for (let i = 0; i < doItAmount.length; i++) {
        const data = cb.call(bindTo, i, ...params);
        if (data === false)
          break;
        responses.push(data);
      }
      return responses;
    };
    var memorize = (func, getCacheKey, limit = 1) => {
      if (!isFunc.isFunc(func) || getCacheKey && !isFunc.isFunc(getCacheKey))
        return console.error("Error: Expected a function", func, getCacheKey);
      let memorized = function() {
        const cache = memorized.cache;
        const key = getCacheKey ? getCacheKey.apply(this, arguments) : arguments[0];
        if (jsonEqual.hasOwn(cache, key))
          return cache[key];
        const result = func.apply(this, arguments);
        isNum.isNum(limit) && Object.keys(cache).length < limit ? cache[key] = result : memorized.cache = {
          [key]: result
        };
        return result;
      };
      memorized.cache = {};
      memorized.destroy = () => {
        getCacheKey = void 0;
        memorized.cache = void 0;
        memorized.destroy = void 0;
        memorized = void 0;
      };
      return memorized;
    };
    var runSeq = async (asyncFns = [], options = {}) => {
      const [valid] = validate.validate({
        asyncFns
      }, {
        asyncFns: isArr.isArr
      });
      if (!valid)
        return [];
      const {
        cloneResults = false,
        returnOriginal = true
      } = options;
      const results = [];
      for (const fn of asyncFns) {
        const result = isFunc.isFunc(fn) ? await fn(results.length, cloneResults ? deepClone.deepClone(results) : results) : returnOriginal ? fn : void 0;
        results.push(result);
      }
      return results;
    };
    var timedRun = async (fn, ...args) => {
      const [valid] = validate.validate({
        fn
      }, {
        fn: isFunc.isFunc
      });
      if (!valid)
        return [void 0, -1];
      const startTime = /* @__PURE__ */ new Date();
      const result = await fn(...args);
      return [result, /* @__PURE__ */ new Date() - startTime];
    };
    var throttle = (func, wait = 100) => {
      let waiting = false;
      return function(...args) {
        if (waiting)
          return;
        waiting = true;
        func.apply(this, args);
        return setTimeout(() => {
          waiting = false;
        }, wait);
      };
    };
    var throttleLast = (func, cb, wait = 100) => {
      let throttleTimeout;
      if (isNum.isNum(cb)) {
        wait = cb;
        cb = void 0;
      }
      return function(...args) {
        if (throttleTimeout)
          clearTimeout(throttleTimeout);
        throttleTimeout = setTimeout(() => {
          func.apply(this, args);
          clearTimeout(throttleTimeout);
        }, wait);
        typeof cb === "function" && cb();
      };
    };
    var limbo = (promise, asObject = false) => {
      return !promise || !isFunc.isFunc(promise.then) ? [new Error(`A promise or thenable is required as the first argument!`), asObject ? noOps.emptyObj : void 0] : promise.then((data) => [null, data]).catch((err) => [err, asObject ? noOps.emptyObj : void 0]);
    };
    var limboify = (cb, ...args) => {
      return limbo(new Promise((res, rej) => cb(...args, (err, success) => err ? rej(err) : res(success || true))));
    };
    var uuid = (a) => a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);
    var noOp = () => {
    };
    var parseErrorMessage = (exception) => {
      return isStr.isStr(exception) && !isValidDate.isEmpty(exception) ? exception : isObj.isObj(exception) ? exception.message : null;
    };
    var defFilters = [`node:internal`, `node_modules/jest`];
    var stackTracePaths = (filter = defFilters) => {
      const orgPreStackTrace = Error.prepareStackTrace;
      Error.prepareStackTrace = (_, stack2) => stack2;
      const stack = new Error().stack.slice(1);
      Error.prepareStackTrace = orgPreStackTrace;
      return stack.reduce((acc, cs) => {
        const loc = cs.getFileName();
        if (!loc)
          return acc;
        const ignore = isFunc.isFunc(filter) ? filter(loc, cs, stack) : Boolean(filter.length && filter.find((filterLoc) => loc.includes(filterLoc)));
        !ignore && acc.push(loc);
        return acc;
      }, []);
    };
    exports.checkCall = checkCall;
    exports.complement = complement;
    exports.debounce = debounce;
    exports.doIt = doIt;
    exports.eitherFunc = eitherFunc;
    exports.limbo = limbo;
    exports.limboify = limboify;
    exports.memorize = memorize;
    exports.noOp = noOp;
    exports.parseErrorMessage = parseErrorMessage;
    exports.runSeq = runSeq;
    exports.stackTracePaths = stackTracePaths;
    exports.throttle = throttle;
    exports.throttleLast = throttleLast;
    exports.timedRun = timedRun;
    exports.uuid = uuid;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/mod-31dfe732.js
var require_mod_31dfe732 = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/mod-31dfe732.js"(exports) {
    "use strict";
    var isNum = require_isNum_c7164b50();
    var toNum = require_toNum_eeb2e51e();
    var nth = (num) => {
      if (!isNum.isNum(num)) {
        num = toNum.getNums(num);
        if (!num)
          return "";
        num = toNum.toNum(num);
        if (isNum.equalsNaN(num))
          return "";
      }
      const mod2 = num % 100;
      if (mod2 >= 10 && mod2 <= 20)
        return "th";
      switch (num % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };
    var toFloat = (val) => val && !isNum.equalsNaN(val) && parseFloat(isNum.isNum(val) && val || toNum.getNums(val)) || 0;
    var toInt = (val) => val && !isNum.equalsNaN(val) && parseInt(isNum.isNum(val) && val || toNum.getNums(val)) || 0;
    var mod = (num, divisor) => {
      return (num % divisor + divisor) % divisor;
    };
    exports.mod = mod;
    exports.nth = nth;
    exports.toFloat = toFloat;
    exports.toInt = toInt;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/reduceObj-f41cbf8d.js
var require_reduceObj_f41cbf8d = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/reduceObj-f41cbf8d.js"(exports) {
    "use strict";
    var isFunc = require_isFunc_f93803cb();
    var isObj = require_isObj_6b3aa807();
    var reduceObj = (obj, cb, start = {}) => isObj.isObj(obj) && isFunc.isFunc(cb) && Object.entries(obj).reduce((data, [key, value]) => cb(key, value, data), start) || start;
    exports.reduceObj = reduceObj;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/sanitize-0a18302d.js
var require_sanitize_0a18302d = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/sanitize-0a18302d.js"(exports) {
    "use strict";
    var isStr = require_isStr_8a57710e();
    var sanitize = (str) => isStr.isStr(str) && str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") || str;
    exports.sanitize = sanitize;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/transformKeys-574f796c.js
var require_transformKeys_574f796c = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/transformKeys-574f796c.js"(exports) {
    "use strict";
    var log = require_log_37bbfac6();
    var isObj = require_isObj_6b3aa807();
    var isFunc = require_isFunc_f93803cb();
    var deepClone = require_deepClone_ae664a21();
    var isArr = require_isArr_39234014();
    var isColl = require_isColl_5757310a();
    var set = require_set_c0a98b21();
    var jsonEqual = require_jsonEqual_7e69ef6a();
    var reduceObj = require_reduceObj_f41cbf8d();
    var sanitize = require_sanitize_0a18302d();
    var isStr = require_isStr_8a57710e();
    var strToType = require_strToType_00c4481f();
    var pipeline = require_pipeline_e65bdaae();
    var exists = require_exists_c79204b1();
    var toStr2 = require_toStr_8e499966();
    var ensureArr = require_ensureArr_ae68c041();
    var noOps = require_noOps_b5f3c7e4();
    var cloneJson = (obj) => {
      try {
        return JSON.parse(JSON.stringify(obj));
      } catch (e) {
        log.logData(e.message, "error");
        return null;
      }
    };
    var clearObj = (obj, filter) => {
      obj && Object.entries(obj).map(([key, value]) => {
        if (filter && filter.indexOf(key) !== -1)
          return;
        if (typeof value === "object")
          clearObj(value);
        obj[key] = void 0;
        delete obj[key];
      });
    };
    var eitherObj = (obj1, obj2) => isObj.isObj(obj1) && obj1 || obj2;
    var deepMerge3 = (...sources) => {
      return sources.reduce((merged, source) => {
        const srcCopy = deepClone.deepClone(source);
        return isArr.isArr(srcCopy) ? [...isArr.isArr(merged) && merged || [], ...srcCopy] : isObj.isObj(srcCopy) ? Object.entries(srcCopy).reduce((joined, [key, value]) => ({
          ...joined,
          [key]: isFunc.isFunc(value) ? deepClone.cloneFunc(value) : isColl.isColl(value) && key in joined ? deepMerge3(joined[key], value) : deepClone.deepClone(value)
        }), merged) : merged;
      }, isArr.isArr(sources[0]) && [] || {});
    };
    var applyToCloneOf = (obj, mutatorCb) => {
      let error;
      if (!obj)
        error = "object (Argument 1) in applyToCloneOf, must be defined!";
      if (!isObj.isObj(obj))
        error = "object (Argument 1) in applyToCloneOf, must be an object!";
      if (!mutatorCb)
        error = "mutator (Argument 2) in applyToCloneOf, must be defined!";
      if (!isFunc.isFunc(mutatorCb))
        error = "mutator (Argument 2) arg in applyToCloneOf, must be a function!";
      if (error) {
        console.warn(error);
        return obj;
      }
      const clone = deepClone.deepClone(obj);
      mutatorCb(clone);
      return clone;
    };
    var mapEntries = (obj, cb) => {
      if (!isArr.isArr(obj) && !isObj.isObj(obj)) {
        console.error(obj, `Expected array or object for obj. Found ${typeof obj}`);
        return obj;
      }
      if (!isFunc.isFunc(cb)) {
        console.error(`Expected function for cb. Found ${typeof cb}`);
        return obj;
      }
      const entries = Object.entries(obj);
      const initialValue = isArr.isArr(obj) ? [] : {};
      return entries.reduce((obj2, [key, value]) => {
        const result = cb(key, value);
        if (!jsonEqual.isEntry(result)) {
          console.error(`Callback function must return entry. Found: ${result}. Using current entry instead.`);
          return set.set(obj2, key, value);
        }
        return set.set(obj2, result[0], result[1]);
      }, initialValue);
    };
    var mapKeys = (obj, keyMapper) => {
      if (!isObj.isObj(obj) || !isFunc.isFunc(keyMapper))
        return obj;
      return mapEntries(obj, (key, value) => [keyMapper(key), value]);
    };
    var mapObj = (obj, cb) => {
      if (!isObj.isObj(obj))
        return [];
      const entries = Object.entries(obj);
      return isFunc.isFunc(cb) ? entries.map(([key, value]) => cb(key, value)) : entries;
    };
    var omitKeys = (obj = {}, keys = []) => isObj.isObj(obj) && reduceObj.reduceObj(obj, (key, _, updated) => {
      keys.indexOf(key) === -1 && (updated[key] = obj[key]);
      return updated;
    }, {}) || {};
    var pickKeys = (obj = {}, keys = []) => isObj.isObj(obj) && keys.reduce((updated, key) => {
      key in obj && (updated[key] = obj[key]);
      return updated;
    }, {}) || {};
    var sanitizeCopy = (obj) => JSON.parse(sanitize.sanitize(JSON.stringify(obj)));
    var trimStringFields = (object) => Object.entries(object).reduce((cleaned, [key, value]) => {
      cleaned[key] = isStr.isStr(value) ? value.trim() : value;
      return cleaned;
    }, object);
    var toObj = (val, divider, split) => {
      if (isArr.isArr(val))
        return Object.keys(val).reduce((obj, key) => {
          obj[key] = val[key];
          return obj;
        }, {});
      if (!isStr.isStr(val))
        return {};
      divider = divider || "=";
      split = split || "&";
      return val.toString().split(split).reduce((obj, item) => {
        const sep = item.split(divider);
        obj[sep[0].trim()] = strToType.strToType(sep[1].trim());
        return obj;
      }, {});
    };
    var keyMap = (arr, toUpperCase) => isArr.isArr(arr) && arr.reduce((obj, key) => {
      if (!isStr.isStr(key))
        return obj;
      const use = toUpperCase && key.toUpperCase() || key;
      obj[use] = use;
      return obj;
    }, {}) || {};
    var everyEntry = (obj, predicate, logError = true) => {
      if (!isObj.isObj(obj)) {
        logError && console.error(`First argument ${obj} must be an object.`);
        return false;
      }
      if (!isFunc.isFunc(predicate)) {
        logError && console.error(`Second argument ${predicate}, must a function`);
        return false;
      }
      return pipeline.pipeline(obj, Object.entries, (entries) => entries.every(([key, value]) => predicate(key, value)));
    };
    var someEntry = (obj, predicate, logError = true) => {
      if (!isObj.isObj(obj)) {
        logError && console.error(`First argument ${obj} must be an object.`);
        return false;
      }
      if (!isFunc.isFunc(predicate)) {
        logError && console.error(`Second argument ${predicate}, must a function`);
        return false;
      }
      return pipeline.pipeline(obj, Object.entries, (entries) => entries.some(([key, value]) => predicate(key, value)));
    };
    var filterObj = (obj, predicate, logError = true) => {
      if (!isObj.isObj(obj)) {
        logError && console.error(`First argument ${obj} must be an object.`);
        return obj;
      }
      if (!isFunc.isFunc(predicate)) {
        logError && console.error(`Second argument ${predicate}, must a function`);
        return obj;
      }
      return reduceObj.reduceObj(obj, (key, value, data) => {
        if (predicate(key, value))
          data[key] = value;
        return data;
      }, {});
    };
    var pad = (hash, len) => {
      while (hash.length < len)
        hash = "0" + hash;
      return hash;
    };
    var fold = (hash, text) => {
      if (text.length === 0)
        return hash;
      let i;
      let chr;
      let len;
      for (i = 0, len = text.length; i < len; i++) {
        chr = text.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0;
      }
      return hash < 0 ? hash * -2 : hash;
    };
    var foldObject = (hash, obj, seen) => {
      const foldKey = (hash2, key) => foldValue(hash2, obj[key], key, seen);
      return Object.keys(obj).sort().reduce(foldKey, hash);
    };
    var foldValue = (input, value, key, seen) => {
      const hash = fold(fold(fold(input, key), toString(value)), typeof value);
      if (value === null)
        return fold(hash, "null");
      if (value === void 0)
        return fold(hash, "undefined");
      if (typeof value === "object" || typeof value === "function") {
        if (seen.indexOf(value) !== -1)
          return fold(hash, "[Circular]" + key);
        seen.push(value);
        const objHash = foldObject(hash, value, seen);
        if (!("valueOf" in value) || typeof value.valueOf !== "function")
          ;
        try {
          return fold(objHash, String(value.valueOf()));
        } catch (err) {
          return fold(objHash, "[valueOf exception]" + (err.stack || err.message));
        }
      }
      return fold(hash, value.toString());
    };
    var toString = (obj) => Object.prototype.toString.call(obj);
    var hashObj = (obj) => pad(foldValue(0, obj, "", []).toString(16), 8);
    var splitByKeys = (obj = {}, keys) => {
      if (!keys)
        return [{}, {
          ...obj
        }];
      const intersect = [{}, {}];
      const compareKeys = ensureArr.ensureArr(keys);
      return isObj.isObj(obj) ? reduceObj.reduceObj(obj, (key, _, updated) => {
        exists.exists(compareKeys.find((k) => exists.exists(k) && toStr2.toStr(k) === key)) ? updated[0][key] = obj[key] : updated[1][key] = obj[key];
        return updated;
      }, intersect) : intersect;
    };
    var transformKeys = (obj = noOps.emptyObj, keyMap2 = noOps.emptyObj, opts3 = noOps.emptyObj) => {
      const {
        strict = false
      } = opts3;
      return Object.entries(obj).reduce((acc, [key, value]) => {
        const ref = keyMap2[key] || (!strict ? key : void 0);
        ref && (acc[ref] = value);
        return acc;
      }, {});
    };
    exports.applyToCloneOf = applyToCloneOf;
    exports.clearObj = clearObj;
    exports.cloneJson = cloneJson;
    exports.deepMerge = deepMerge3;
    exports.eitherObj = eitherObj;
    exports.everyEntry = everyEntry;
    exports.filterObj = filterObj;
    exports.hashObj = hashObj;
    exports.keyMap = keyMap;
    exports.mapEntries = mapEntries;
    exports.mapKeys = mapKeys;
    exports.mapObj = mapObj;
    exports.omitKeys = omitKeys;
    exports.pickKeys = pickKeys;
    exports.sanitizeCopy = sanitizeCopy;
    exports.someEntry = someEntry;
    exports.splitByKeys = splitByKeys;
    exports.toObj = toObj;
    exports.transformKeys = transformKeys;
    exports.trimStringFields = trimStringFields;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/wait-8ca88995.js
var require_wait_8ca88995 = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/wait-8ca88995.js"(exports) {
    "use strict";
    var isObj = require_isObj_6b3aa807();
    var isFunc = require_isFunc_f93803cb();
    var promisify = (method) => {
      if (!isFunc.isFunc(method))
        throw `Argument must be a function`;
      return (...args) => {
        return new Promise((res, rej) => {
          if (!isFunc.isFunc(args[args.length - 1]))
            return res(method(...args));
          args.pop();
          args.push((...cbData) => {
            return cbData && cbData[0] ? rej(...cbData) : res(...cbData);
          });
          return method(...args);
        });
      };
    };
    var defObjProps = Array.from(["caller", "callee", "arguments", "apply", "bind", "call", "toString", "__proto__", "__defineGetter__", "__defineSetter__", "hasOwnProperty", "__lookupGetter__", "__lookupSetter__", "isPrototypeOf", "propertyIsEnumerable", "valueOf", "toLocaleString"]).concat(Object.getOwnPropertyNames(Object.prototype)).reduce((map, functionName) => {
      map[functionName] = true;
      return map;
    }, {});
    var addAsync = (object) => {
      if (!object.__IS_PROMISIFIED__) {
        for (const prop of Object.getOwnPropertyNames(object)) {
          const isAsync = prop.indexOf("Async") !== -1 || object[`${prop}Async`];
          if (isAsync || defObjProps[prop])
            continue;
          if (isFunc.isFunc(object[prop]))
            object[`${prop}Async`] = promisify(object[prop]);
          else {
            const getValue = Object.getOwnPropertyDescriptor(object, prop).get;
            if (isFunc.isFunc(getValue))
              object[`${prop}Async`] = promisify(getValue);
          }
        }
        object.__IS_PROMISIFIED__ = true;
      }
      return object;
    };
    var promisifyAll = (object) => {
      if (!isObj.isObj(object))
        return object;
      addAsync(object);
      const proto = Object.getPrototypeOf(object);
      proto && Object.getPrototypeOf(proto) !== null && addAsync(proto);
      return object;
    };
    var wait = (time) => new Promise((res) => setTimeout(() => res(true), time));
    exports.promisify = promisify;
    exports.promisifyAll = promisifyAll;
    exports.wait = wait;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/joinRegex-5320d139.js
var require_joinRegex_5320d139 = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/joinRegex-5320d139.js"(exports) {
    "use strict";
    var isStr = require_isStr_8a57710e();
    var isArr = require_isArr_39234014();
    require_validate_23297ec2();
    require_noOps_b5f3c7e4();
    var not = require_not_16fa9c85();
    var getRegexSource = (maybeRx) => not.isRegex(maybeRx) ? maybeRx.source : isStr.isStr(maybeRx) ? maybeRx : null;
    var parseArgs = (args) => {
      if (isArr.isArr(args[0]))
        return [args[0], args[1]];
      const last = args[args.length - 1];
      const options = isStr.isStr(last) ? last : void 0;
      const expressions = options ? args.splice(0, args.length - 1) : args;
      return [expressions, options];
    };
    var joinRegex = (...args) => {
      const [expressions, options] = parseArgs(args);
      const source = expressions.reduce((joined, next) => {
        const nextSource = getRegexSource(next);
        return !nextSource ? joined : joined === "" ? nextSource : `${joined}|${nextSource}`;
      }, "");
      return new RegExp(`(${source})`, options);
    };
    exports.getRegexSource = getRegexSource;
    exports.joinRegex = joinRegex;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/getWordEndingAt-63d038a5.js
var require_getWordEndingAt_63d038a5 = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/getWordEndingAt-63d038a5.js"(exports) {
    "use strict";
    var isStr = require_isStr_8a57710e();
    var isFunc = require_isFunc_f93803cb();
    var isQuoted = require_isQuoted_eb6994da();
    var toStr$1 = require_toStr_8e499966();
    var isNonNegative = require_isNonNegative_9959647c();
    var isArr = require_isArr_39234014();
    var isColl = require_isColl_5757310a();
    var get = require_get_00626335();
    var buildPath = (...args) => {
      const built = args.reduce((path, arg) => {
        let str = toStr(arg);
        return `${path}${str && "/" + str || ""}`;
      }, "");
      return built.replace(/([^:\/]|^)\/{2,}/g, "$1/");
    };
    var mapString = (str, charMapper) => {
      if (!isStr.isStr(str))
        return str;
      if (!isFunc.isFunc(charMapper))
        return str;
      let result = "";
      for (const char of str) {
        result += charMapper(char);
      }
      return result;
    };
    var delimitString = (str, delimiter, delimiters = ["-", "_", " "]) => {
      if (!isStr.isStr(str))
        return str;
      const isDelimiter = (c) => delimiters.some((del) => del === c);
      let prevChar = "_";
      return mapString(str, (char) => {
        if (isDelimiter(char)) {
          prevChar = delimiter;
          return delimiter;
        }
        if (isQuoted.isUpperCase(char) && isQuoted.isLowerCase(prevChar) && !isDelimiter(prevChar)) {
          prevChar = char;
          return delimiter + char;
        }
        prevChar = char;
        return char;
      });
    };
    var snakeCase = (str) => {
      const underscored = delimitString(str, "_");
      return underscored.toLowerCase();
    };
    var capitalize = (str, lowercaseTail = true) => {
      if (!isStr.isStr(str) || !str[0])
        return str;
      const tail = lowercaseTail ? str.slice(1).toLowerCase() : str.slice(1);
      return `${str[0].toUpperCase()}${tail}`;
    };
    var removeDot = (string) => {
      const noDot = string.indexOf(".") === 0 ? string.slice(1) : string;
      return noDot.indexOf(".") === noDot.length - 1 ? noDot.slice(0, -1) : noDot;
    };
    var cleanStr = (str) => {
      return str && removeDot(str).replace(/[-_]/gm, " ") || str;
    };
    var camelCase = (str, compCase) => {
      return str && cleanStr(str).split(/[\s_-]/gm).reduce((cased, word, index) => {
        if (!word)
          return cased;
        cased += (index > 0 || compCase) && capitalize(word) || word.toLowerCase();
        return cased;
      }, "") || str;
    };
    var camelCasePath = (path) => {
      const split = path.split(".");
      const camelCasedSplit = split.map((str, idx) => idx > 0 ? capitalize(str, false) : str);
      return camelCasedSplit.length > 1 ? camelCasedSplit.join("") : path;
    };
    var containsStr = (str, substring, fromIndex) => {
      str = !isStr.isStr(str) && toStr$1.toStr(str) || str;
      substring = !isStr.isStr(substring) && toStr$1.toStr(substring) || substring;
      return str.indexOf(substring, fromIndex) !== -1;
    };
    var eitherStr = (str1, str2) => isStr.isStr(str1) && str1 || str2;
    var uppercasePattern = /[A-Z]/g;
    var msPattern = /^ms-/;
    var hyphenCache = {};
    var toHyphenLower = (match) => "-" + match.toLowerCase();
    var hyphenator = (rule) => {
      if (hyphenCache.hasOwnProperty(rule))
        return hyphenCache[rule];
      const hRule = rule.replace(uppercasePattern, toHyphenLower);
      return hyphenCache[rule] = msPattern.test(hRule) ? "-" + hRule : hRule;
    };
    var hashString = (str, maxLength) => {
      if (!isStr.isStr(str) || str.length == 0)
        return 0;
      str = str.split("").reverse().join("");
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = `${Math.abs(hash & hash)}`;
      }
      return isNonNegative.isNonNegative(maxLength) ? hash.slice(0, maxLength) : hash;
    };
    var parseJSON = (str, logErr = true) => {
      try {
        return JSON.parse(str);
      } catch (e) {
        logErr && console.error(e.message);
        return null;
      }
    };
    var plural = (str) => {
      if (!str || !str.length)
        return str;
      return str[str.length - 1] !== "s" ? str + "s" : str;
    };
    var singular = (str) => {
      if (!str || !str.length)
        return str;
      return str[str.length - 1] === "s" ? str.slice(0, str.length - 1) : str;
    };
    var styleCase = (str) => {
      if (!isStr.isStr(str))
        return str;
      const cased = camelCase(str);
      return `${cased[0].toLowerCase()}${cased.slice(1)}`;
    };
    var trainCase = (str) => isStr.isStr(str) && str.split(/(?=[A-Z])|[\s_-]/gm).join("-").toLowerCase() || str;
    var wordCaps = (str) => {
      if (!isStr.isStr(str))
        return str;
      let cleaned = cleanStr(str);
      return cleaned.split(" ").map((word) => word && capitalize(word) || "").join(" ");
    };
    var spaceJoin = (original, toAdd) => {
      toAdd = isArr.isArr(toAdd) ? toAdd : [toAdd];
      return toAdd.reduce((joined, item) => {
        return isStr.isStr(item) ? `${joined ? joined + " " : ""}${item}`.trim() : joined;
      }, isStr.isStr(original) ? original : "");
    };
    var templateRx = (tempStr, data, fallback = "", rx) => {
      const orgRx = template.regex;
      template.regex = rx || /{{([^}]*)}}/g;
      const resp = template(tempStr, data, fallback);
      template.regex = orgRx;
      return resp;
    };
    var template = (tempStr, data, fallback = "") => {
      data = isColl.isColl(data) && data || {};
      const regex = template.regex || /\${(.*?)\}/g;
      return isStr.isStr(tempStr) ? tempStr.replace(regex, (match, exact) => {
        const path = (exact || match.substr(2, match.length - 3)).trim();
        const replaceWith = get.get(data, path, fallback);
        return isFunc.isFunc(replaceWith) ? replaceWith(data, path, fallback) : replaceWith;
      }) : console.error(`template requires a string as the first argument`) || tempStr;
    };
    var validFilename = (fileName) => {
      if (!fileName)
        return false;
      const regex = /[<>:"/\\|?*\u0000-\u001F]/g;
      const windowsRegex = /^(con|prn|aux|nul|com\d|lpt\d)$/i;
      const periodRegex = /^\.\.?$/;
      return regex.test(fileName) || windowsRegex.test(fileName) || periodRegex.test(fileName) ? false : true;
    };
    var reverseStr = (str) => {
      if (!isStr.isStr(str))
        return void 0;
      let reversed = "";
      for (let char of str) {
        reversed = char + reversed;
      }
      return reversed;
    };
    var getNearestDelimiterIndex = (text, index, delimiters = [" "]) => {
      const indices = delimiters.map((str) => text.indexOf(str, index)).sort();
      return indices.find((idx) => idx >= 0);
    };
    var getWordStartingAt = (text, index, delimiters = [" "]) => {
      const endingSpaceIdx = getNearestDelimiterIndex(text, index, delimiters);
      return text.substring(index, endingSpaceIdx === -1 ? text.length : endingSpaceIdx);
    };
    var getWordEndingAt = (text, index, delimiters = [" "]) => {
      const reversed = reverseStr(text);
      const reversedIndex = text.length - index;
      return reverseStr(getWordStartingAt(reversed, reversedIndex, delimiters));
    };
    exports.buildPath = buildPath;
    exports.camelCase = camelCase;
    exports.camelCasePath = camelCasePath;
    exports.capitalize = capitalize;
    exports.cleanStr = cleanStr;
    exports.containsStr = containsStr;
    exports.delimitString = delimitString;
    exports.eitherStr = eitherStr;
    exports.getNearestDelimiterIndex = getNearestDelimiterIndex;
    exports.getWordEndingAt = getWordEndingAt;
    exports.getWordStartingAt = getWordStartingAt;
    exports.hashString = hashString;
    exports.hyphenator = hyphenator;
    exports.mapString = mapString;
    exports.parseJSON = parseJSON;
    exports.plural = plural;
    exports.removeDot = removeDot;
    exports.reverseStr = reverseStr;
    exports.singular = singular;
    exports.snakeCase = snakeCase;
    exports.spaceJoin = spaceJoin;
    exports.styleCase = styleCase;
    exports.template = template;
    exports.templateRx = templateRx;
    exports.trainCase = trainCase;
    exports.validFilename = validFilename;
    exports.wordCaps = wordCaps;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/getURLParam-201ef5fe.js
var require_getURLParam_201ef5fe = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/getURLParam-201ef5fe.js"(exports) {
    "use strict";
    var reduceObj = require_reduceObj_f41cbf8d();
    var isStr = require_isStr_8a57710e();
    var isNum = require_isNum_c7164b50();
    var isBool = require_isBool_aa6af74e();
    var isColl = require_isColl_5757310a();
    var isArr = require_isArr_39234014();
    var validate = require_validate_23297ec2();
    var queryToObj = (string) => {
      const currentQueryItems = {};
      const stringSplit = string.split("?");
      const querystring = stringSplit[stringSplit.length - 1];
      if (!querystring)
        return currentQueryItems;
      const split = querystring.split("&");
      split.length && split.map((item) => {
        const components = item.split("=");
        if (components.length <= 1)
          return currentQueryItems;
        const itemSplit = [components.shift(), components.join("=")];
        if (itemSplit.length === 2) {
          const array = decodeURIComponent(itemSplit[1]).split(",");
          if (array && array.length > 1)
            currentQueryItems[itemSplit[0]] = array;
          else if (itemSplit[0] in currentQueryItems) {
            const val = currentQueryItems[itemSplit[0]];
            currentQueryItems[itemSplit[0]] = isArr.isArr(val) ? val.push(decodeURIComponent(itemSplit[1])) : [val, decodeURIComponent(itemSplit[1])];
          } else
            currentQueryItems[itemSplit[0]] = decodeURIComponent(itemSplit[1]);
        }
      });
      return currentQueryItems;
    };
    var objToQuery = (obj) => {
      let firstSet;
      return reduceObj.reduceObj(obj, (key, value, urlStr) => {
        if (!value)
          return urlStr;
        const useVal = isStr.isStr(value) || isNum.isNum(value) || isBool.isBool(value) ? value : isColl.isColl(value) ? isArr.isArr(value) ? value.join(",") : JSON.stringify(value) : null;
        if (!useVal)
          return urlStr;
        urlStr = !firstSet ? `?${encodeURIComponent(key)}=${encodeURIComponent(useVal)}` : `${urlStr}&${encodeURIComponent(key)}=${encodeURIComponent(useVal)}`;
        firstSet = true;
        return urlStr;
      }, "");
    };
    var getURLParam = (paramKey) => {
      var _doc$location, _queryToObj$paramKey, _queryToObj;
      const [valid] = validate.validate({
        paramKey
      }, {
        paramKey: isStr.isStr
      });
      if (!valid)
        return null;
      const doc = typeof document !== "undefined" ? document : null;
      const search = doc === null || doc === void 0 ? void 0 : (_doc$location = doc.location) === null || _doc$location === void 0 ? void 0 : _doc$location.search;
      return isStr.isStr(search) ? (_queryToObj$paramKey = (_queryToObj = queryToObj(search)) === null || _queryToObj === void 0 ? void 0 : _queryToObj[paramKey]) !== null && _queryToObj$paramKey !== void 0 ? _queryToObj$paramKey : null : null;
    };
    exports.getURLParam = getURLParam;
    exports.objToQuery = objToQuery;
    exports.queryToObj = queryToObj;
  }
});

// node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/index.js
var require_cjs = __commonJS({
  "node_modules/.pnpm/@keg-hub+jsutils@9.6.1/node_modules/@keg-hub/jsutils/build/cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var intersect = require_intersect_6fe7b944();
    var ensureArr = require_ensureArr_ae68c041();
    var isArr = require_isArr_39234014();
    var isBool = require_isBool_aa6af74e();
    var toBool = require_toBool_deb350e4();
    var softFalsy = require_softFalsy_3d7ead1c();
    var shallowEqual = require_shallowEqual_eaf2262d();
    var get = require_get_00626335();
    var isColl = require_isColl_5757310a();
    var deepEqual = require_deepEqual_adba847a();
    var set = require_set_c0a98b21();
    var deepClone = require_deepClone_ae664a21();
    var not = require_not_16fa9c85();
    var either = require_either_81805472();
    var noOps = require_noOps_b5f3c7e4();
    var isValidDate = require_isValidDate_813b9419();
    var strToType = require_strToType_00c4481f();
    var exists = require_exists_c79204b1();
    var log = require_log_37bbfac6();
    var pipeline = require_pipeline_e65bdaae();
    var stackTracePaths = require_stackTracePaths_a7780a09();
    var compareTo = require_compareTo_d69e4abf();
    var isFunc = require_isFunc_f93803cb();
    var isNonNegative = require_isNonNegative_9959647c();
    var isInt = require_isInt_94ce4199();
    var isNum = require_isNum_c7164b50();
    var toNum = require_toNum_eeb2e51e();
    var mod = require_mod_31dfe732();
    var transformKeys = require_transformKeys_574f796c();
    var jsonEqual = require_jsonEqual_7e69ef6a();
    var isObj = require_isObj_6b3aa807();
    var reduceObj = require_reduceObj_f41cbf8d();
    var wait = require_wait_8ca88995();
    var joinRegex = require_joinRegex_5320d139();
    var getWordEndingAt = require_getWordEndingAt_63d038a5();
    var isQuoted = require_isQuoted_eb6994da();
    var isStr = require_isStr_8a57710e();
    var sanitize = require_sanitize_0a18302d();
    var toStr2 = require_toStr_8e499966();
    var validate = require_validate_23297ec2();
    var getURLParam = require_getURLParam_201ef5fe();
    var isValidUrl = require_isValidUrl_a77135f0();
    var formatCls = (classes) => classes.filter((item) => typeof item === "string" && Boolean(item)).join(` `).trim();
    var cls = (...classGroup) => {
      return formatCls(classGroup.map((classes) => {
        return Array.isArray(classes) ? cls(...classes) : typeof classes !== `object` ? formatCls([classes]) : formatCls(Object.entries(classes).map(([item, val]) => {
          return typeof val === "boolean" ? val && formatCls([item]) : cls(val);
        }));
      }));
    };
    exports.areCountMapsEqual = intersect.areCountMapsEqual;
    exports.areFrequencyEqual = intersect.areFrequencyEqual;
    exports.areSetEqual = intersect.areSetEqual;
    exports.buildElementCountMap = intersect.buildElementCountMap;
    exports.cloneArr = intersect.cloneArr;
    exports.eitherArr = intersect.eitherArr;
    exports.findExtrema = intersect.findExtrema;
    exports.findMax = intersect.findMax;
    exports.findMin = intersect.findMin;
    exports.flatArr = intersect.flatArr;
    exports.flatMap = intersect.flatMap;
    exports.flatUnion = intersect.flatUnion;
    exports.intersect = intersect.intersect;
    exports.omitRange = intersect.omitRange;
    exports.randomArr = intersect.randomArr;
    exports.randomizeArr = intersect.randomizeArr;
    exports.uniqArr = intersect.uniqArr;
    exports.uniqArrByReference = intersect.uniqArrByReference;
    exports.ensureArr = ensureArr.ensureArr;
    exports.isArr = isArr.isArr;
    exports.isBool = isBool.isBool;
    exports.convertToStrBool = toBool.convertToStrBool;
    exports.isStrBool = toBool.isStrBool;
    exports.toBool = toBool.toBool;
    exports.softFalsy = softFalsy.softFalsy;
    exports.cleanColl = shallowEqual.cleanColl;
    exports.mapColl = shallowEqual.mapColl;
    exports.mapFind = shallowEqual.mapFind;
    exports.reduceColl = shallowEqual.reduceColl;
    exports.repeat = shallowEqual.repeat;
    exports.shallowEqual = shallowEqual.shallowEqual;
    exports.unset = shallowEqual.unset;
    exports.get = get.get;
    exports.isColl = isColl.isColl;
    exports.deepEqual = deepEqual.deepEqual;
    exports.isEmptyColl = deepEqual.isEmptyColl;
    exports.set = set.set;
    exports.cloneFunc = deepClone.cloneFunc;
    exports.cloneObjWithPrototypeAndProperties = deepClone.cloneObjWithPrototypeAndProperties;
    exports.deepClone = deepClone.deepClone;
    exports.hasDomAccess = not.hasDomAccess;
    exports.identity = not.identity;
    exports.isDom = not.hasDomAccess;
    exports.isOrderable = not.isOrderable;
    exports.isRegex = not.isRegex;
    exports.match = not.match;
    exports.not = not.not;
    exports.either = either.either;
    exports.deepFreeze = noOps.deepFreeze;
    exports.emptyArr = noOps.emptyArr;
    exports.emptyObj = noOps.emptyObj;
    exports.noOpArr = noOps.noOpArr;
    exports.noOpObj = noOps.noOpObj;
    exports.noPropArr = noOps.noPropArr;
    exports.noPropObj = noOps.noPropObj;
    exports.isEmpty = isValidDate.isEmpty;
    exports.isSame = isValidDate.isSame;
    exports.isValidDate = isValidDate.isValidDate;
    exports.typeOf = isValidDate.typeOf;
    exports.strToType = strToType.strToType;
    exports.exists = exists.exists;
    exports.logData = log.logData;
    exports.resetLogs = log.resetLogs;
    exports.setLogs = log.setLogs;
    exports.applyToFunc = pipeline.applyToFunc;
    exports.pipeline = pipeline.pipeline;
    exports.checkCall = stackTracePaths.checkCall;
    exports.complement = stackTracePaths.complement;
    exports.debounce = stackTracePaths.debounce;
    exports.doIt = stackTracePaths.doIt;
    exports.eitherFunc = stackTracePaths.eitherFunc;
    exports.ife = stackTracePaths.checkCall;
    exports.iife = stackTracePaths.checkCall;
    exports.limbo = stackTracePaths.limbo;
    exports.limboify = stackTracePaths.limboify;
    exports.memorize = stackTracePaths.memorize;
    exports.noOp = stackTracePaths.noOp;
    exports.parseErrorMessage = stackTracePaths.parseErrorMessage;
    exports.runSeq = stackTracePaths.runSeq;
    exports.stackTracePaths = stackTracePaths.stackTracePaths;
    exports.throttle = stackTracePaths.throttle;
    exports.throttleLast = stackTracePaths.throttleLast;
    exports.timedRun = stackTracePaths.timedRun;
    exports.uuid = stackTracePaths.uuid;
    exports.compareTo = compareTo.compareTo;
    exports.isFunc = isFunc.isFunc;
    exports.isNonNegative = isNonNegative.isNonNegative;
    exports.isFloat = isInt.isFloat;
    exports.isInt = isInt.isInt;
    exports.isNegative = isInt.isNegative;
    exports.isPositive = isInt.isPositive;
    exports.equalsNaN = isNum.equalsNaN;
    exports.isNum = isNum.isNum;
    exports.getNums = toNum.getNums;
    exports.toNum = toNum.toNum;
    exports.mod = mod.mod;
    exports.nth = mod.nth;
    exports.toFloat = mod.toFloat;
    exports.toInt = mod.toInt;
    exports.applyToCloneOf = transformKeys.applyToCloneOf;
    exports.clearObj = transformKeys.clearObj;
    exports.cloneJson = transformKeys.cloneJson;
    exports.deepMerge = transformKeys.deepMerge;
    exports.eitherObj = transformKeys.eitherObj;
    exports.everyEntry = transformKeys.everyEntry;
    exports.filterObj = transformKeys.filterObj;
    exports.hashObj = transformKeys.hashObj;
    exports.keyMap = transformKeys.keyMap;
    exports.mapEntries = transformKeys.mapEntries;
    exports.mapKeys = transformKeys.mapKeys;
    exports.mapObj = transformKeys.mapObj;
    exports.omitKeys = transformKeys.omitKeys;
    exports.pickKeys = transformKeys.pickKeys;
    exports.sanitizeCopy = transformKeys.sanitizeCopy;
    exports.someEntry = transformKeys.someEntry;
    exports.splitByKeys = transformKeys.splitByKeys;
    exports.toObj = transformKeys.toObj;
    exports.transformKeys = transformKeys.transformKeys;
    exports.trimStringFields = transformKeys.trimStringFields;
    exports.hasOwn = jsonEqual.hasOwn;
    exports.isArrMap = jsonEqual.isArrMap;
    exports.isEntry = jsonEqual.isEntry;
    exports.jsonEqual = jsonEqual.jsonEqual;
    exports.isObj = isObj.isObj;
    exports.reduceObj = reduceObj.reduceObj;
    exports.promisify = wait.promisify;
    exports.promisifyAll = wait.promisifyAll;
    exports.wait = wait.wait;
    exports.getRegexSource = joinRegex.getRegexSource;
    exports.joinRegex = joinRegex.joinRegex;
    exports.buildPath = getWordEndingAt.buildPath;
    exports.camelCase = getWordEndingAt.camelCase;
    exports.camelCasePath = getWordEndingAt.camelCasePath;
    exports.capitalize = getWordEndingAt.capitalize;
    exports.cleanStr = getWordEndingAt.cleanStr;
    exports.containsStr = getWordEndingAt.containsStr;
    exports.delimitString = getWordEndingAt.delimitString;
    exports.eitherStr = getWordEndingAt.eitherStr;
    exports.getNearestDelimiterIndex = getWordEndingAt.getNearestDelimiterIndex;
    exports.getWordEndingAt = getWordEndingAt.getWordEndingAt;
    exports.getWordStartingAt = getWordEndingAt.getWordStartingAt;
    exports.hashString = getWordEndingAt.hashString;
    exports.hyphenator = getWordEndingAt.hyphenator;
    exports.mapString = getWordEndingAt.mapString;
    exports.parseJSON = getWordEndingAt.parseJSON;
    exports.plural = getWordEndingAt.plural;
    exports.removeDot = getWordEndingAt.removeDot;
    exports.reverseStr = getWordEndingAt.reverseStr;
    exports.singular = getWordEndingAt.singular;
    exports.snakeCase = getWordEndingAt.snakeCase;
    exports.spaceJoin = getWordEndingAt.spaceJoin;
    exports.styleCase = getWordEndingAt.styleCase;
    exports.template = getWordEndingAt.template;
    exports.templateRx = getWordEndingAt.templateRx;
    exports.trainCase = getWordEndingAt.trainCase;
    exports.validFilename = getWordEndingAt.validFilename;
    exports.wordCaps = getWordEndingAt.wordCaps;
    exports.isEmail = isQuoted.isEmail;
    exports.isIp = isQuoted.isIp;
    exports.isIp4 = isQuoted.isIp4;
    exports.isIp6 = isQuoted.isIp6;
    exports.isLowerCase = isQuoted.isLowerCase;
    exports.isPhone = isQuoted.isPhone;
    exports.isQuoted = isQuoted.isQuoted;
    exports.isUpperCase = isQuoted.isUpperCase;
    exports.isUrl = isQuoted.isUrl;
    exports.isUuid = isQuoted.isUuid;
    exports.isStr = isStr.isStr;
    exports.sanitize = sanitize.sanitize;
    exports.toStr = toStr2.toStr;
    exports.validate = validate.validate;
    exports.getURLParam = getURLParam.getURLParam;
    exports.objToQuery = getURLParam.objToQuery;
    exports.queryToObj = getURLParam.queryToObj;
    exports.isValidUrl = isValidUrl.isValidUrl;
    exports.cls = cls;
  }
});

// src/index.js
var src_exports = {};
__export(src_exports, {
  parse: () => parse2,
  parseDefaults: () => parseDefaults,
  stringify: () => stringify
});
module.exports = __toCommonJS(src_exports);

// src/compat.js
function startsWith(str, searchString, position) {
  return str.substr(position || 0, searchString.length) === searchString;
}
function endsWith(str, searchString, position) {
  const index = (position || str.length) - searchString.length;
  const lastIndex = str.lastIndexOf(searchString, index);
  return lastIndex !== -1 && lastIndex === index;
}
function stringIncludes(str, searchString, position) {
  return str.indexOf(searchString, position || 0) !== -1;
}
function isRealNaN(x) {
  return typeof x === "number" && isNaN(x);
}
function arrayIncludes(array, searchElement, position) {
  const len = array.length;
  if (len === 0)
    return false;
  const lookupIndex = position | 0;
  const isNaNElement = isRealNaN(searchElement);
  let searchIndex = lookupIndex >= 0 ? lookupIndex : len + lookupIndex;
  while (searchIndex < len) {
    const element = array[searchIndex++];
    if (element === searchElement)
      return true;
    if (isNaNElement && isRealNaN(element))
      return true;
  }
  return false;
}

// src/lexer.js
function feedPosition(position, str, len) {
  const start = position.index;
  const end = position.index = start + len;
  for (let i = start; i < end; i++) {
    const char = str.charAt(i);
    if (char === "\n") {
      position.line++;
      position.column = 0;
    } else {
      position.column++;
    }
  }
}
function jumpPosition(position, str, end) {
  const len = end - position.index;
  return feedPosition(position, str, len);
}
function makeInitialPosition() {
  return {
    index: 0,
    column: 0,
    line: 0
  };
}
function copyPosition(position) {
  return {
    index: position.index,
    line: position.line,
    column: position.column
  };
}
function lexer(str, options) {
  const state = {
    str,
    options,
    position: makeInitialPosition(),
    tokens: []
  };
  lex(state);
  return state.tokens;
}
function lex(state) {
  const {
    str,
    options: { childlessTags: childlessTags2 }
  } = state;
  const len = str.length;
  while (state.position.index < len) {
    const start = state.position.index;
    lexText(state);
    if (state.position.index === start) {
      const isComment = startsWith(str, "!--", start + 1);
      if (isComment) {
        lexComment(state);
      } else {
        const tagName = lexTag(state);
        const safeTag = tagName.toLowerCase();
        if (arrayIncludes(childlessTags2, safeTag)) {
          lexSkipTag(tagName, state);
        }
      }
    }
  }
}
var alphanumeric = /[A-Za-z0-9]/;
function findTextEnd(str, index) {
  while (true) {
    const textEnd = str.indexOf("<", index);
    if (textEnd === -1) {
      return textEnd;
    }
    const char = str.charAt(textEnd + 1);
    if (char === "/" || char === "!" || alphanumeric.test(char)) {
      return textEnd;
    }
    index = textEnd + 1;
  }
}
function lexText(state) {
  const type = "text";
  const { str, position } = state;
  let textEnd = findTextEnd(str, position.index);
  if (textEnd === position.index)
    return;
  if (textEnd === -1) {
    textEnd = str.length;
  }
  const start = copyPosition(position);
  const content = str.slice(position.index, textEnd);
  jumpPosition(position, str, textEnd);
  const end = copyPosition(position);
  state.tokens.push({ type, content, position: { start, end } });
}
function lexComment(state) {
  const { str, position } = state;
  const start = copyPosition(position);
  feedPosition(position, str, 4);
  let contentEnd = str.indexOf("-->", position.index);
  let commentEnd = contentEnd + 3;
  if (contentEnd === -1) {
    contentEnd = commentEnd = str.length;
  }
  const content = str.slice(position.index, contentEnd);
  jumpPosition(position, str, commentEnd);
  state.tokens.push({
    type: "comment",
    content,
    position: {
      start,
      end: copyPosition(position)
    }
  });
}
function lexTag(state) {
  const { str, position } = state;
  {
    const secondChar = str.charAt(position.index + 1);
    const close = secondChar === "/";
    const start = copyPosition(position);
    feedPosition(position, str, close ? 2 : 1);
    state.tokens.push({ type: "tag-start", close, position: { start } });
  }
  const tagName = lexTagName(state);
  lexTagAttributes(state);
  {
    const firstChar = str.charAt(position.index);
    const close = firstChar === "/";
    feedPosition(position, str, close ? 2 : 1);
    const end = copyPosition(position);
    state.tokens.push({ type: "tag-end", close, position: { end } });
  }
  return tagName;
}
var whitespace = /\s/;
function isWhitespaceChar(char) {
  return whitespace.test(char);
}
function lexTagName(state) {
  const { str, position } = state;
  const len = str.length;
  let start = position.index;
  while (start < len) {
    const char = str.charAt(start);
    const isTagChar = !(isWhitespaceChar(char) || char === "/" || char === ">");
    if (isTagChar)
      break;
    start++;
  }
  let end = start + 1;
  while (end < len) {
    const char = str.charAt(end);
    const isTagChar = !(isWhitespaceChar(char) || char === "/" || char === ">");
    if (!isTagChar)
      break;
    end++;
  }
  jumpPosition(position, str, end);
  const tagName = str.slice(start, end);
  state.tokens.push({
    type: "tag",
    content: tagName
  });
  return tagName;
}
function lexTagAttributes(state) {
  const { str, position, tokens } = state;
  let cursor = position.index;
  let quote = null;
  let wordBegin = cursor;
  const words = [];
  const len = str.length;
  while (cursor < len) {
    const char = str.charAt(cursor);
    if (quote) {
      const isQuoteEnd = char === quote;
      if (isQuoteEnd) {
        quote = null;
      }
      cursor++;
      continue;
    }
    const isTagEnd = char === "/" || char === ">";
    if (isTagEnd) {
      if (cursor !== wordBegin) {
        words.push(str.slice(wordBegin, cursor));
      }
      break;
    }
    const isWordEnd = isWhitespaceChar(char);
    if (isWordEnd) {
      if (cursor !== wordBegin) {
        words.push(str.slice(wordBegin, cursor));
      }
      wordBegin = cursor + 1;
      cursor++;
      continue;
    }
    const isQuoteStart = char === "'" || char === '"';
    if (isQuoteStart) {
      quote = char;
      cursor++;
      continue;
    }
    cursor++;
  }
  jumpPosition(position, str, cursor);
  const wLen = words.length;
  const type = "attribute";
  for (let i = 0; i < wLen; i++) {
    const word = words[i];
    const isNotPair = word.indexOf("=") === -1;
    if (isNotPair) {
      const secondWord = words[i + 1];
      if (secondWord && startsWith(secondWord, "=")) {
        if (secondWord.length > 1) {
          const newWord = word + secondWord;
          tokens.push({ type, content: newWord });
          i += 1;
          continue;
        }
        const thirdWord = words[i + 2];
        i += 1;
        if (thirdWord) {
          const newWord = word + "=" + thirdWord;
          tokens.push({ type, content: newWord });
          i += 1;
          continue;
        }
      }
    }
    if (endsWith(word, "=")) {
      const secondWord = words[i + 1];
      if (secondWord && !stringIncludes(secondWord, "=")) {
        const newWord2 = word + secondWord;
        tokens.push({ type, content: newWord2 });
        i += 1;
        continue;
      }
      const newWord = word.slice(0, -1);
      tokens.push({ type, content: newWord });
      continue;
    }
    tokens.push({ type, content: word });
  }
}
var push = [].push;
function lexSkipTag(tagName, state) {
  const { str, position, tokens } = state;
  const safeTagName = tagName.toLowerCase();
  const len = str.length;
  let index = position.index;
  while (index < len) {
    const nextTag = str.indexOf("</", index);
    if (nextTag === -1) {
      lexText(state);
      break;
    }
    const tagStartPosition = copyPosition(position);
    jumpPosition(tagStartPosition, str, nextTag);
    const tagState = { str, position: tagStartPosition, tokens: [] };
    const name = lexTag(tagState);
    if (safeTagName !== name.toLowerCase()) {
      index = tagState.position.index;
      continue;
    }
    if (nextTag !== position.index) {
      const textStart = copyPosition(position);
      jumpPosition(position, str, nextTag);
      tokens.push({
        type: "text",
        content: str.slice(textStart.index, nextTag),
        position: {
          start: textStart,
          end: copyPosition(position)
        }
      });
    }
    push.apply(tokens, tagState.tokens);
    jumpPosition(position, str, tagState.position.index);
    break;
  }
}

// src/helpers.js
var import_jsutils = __toESM(require_cjs());
var selectTypes = [
  ["class", "."],
  ["id", "#"],
  ["data", "["]
];
var selectorCheck = {
  tagConvert: {},
  attrKeyAdd: {},
  attrKeyConvert: {},
  attrValueConvert: {}
};
var clean = (str) => {
  return str && unquote(str.trim()).trim() || "";
};
var buildElSelectors = (selCheck, selAttr, key, attr) => {
  let elSelect = selAttr && selAttr.selector;
  if (key !== "tagConvert") {
    if (typeof selAttr === "string" || typeof selAttr === "function") {
      selCheck[key][attr] = selAttr;
      return;
    }
    if (selAttr && !elSelect && Object.keys(selAttr).length) {
      elSelect = {};
      Object.keys(selAttr).map((key2) => {
        elSelect[key2] = selAttr[key2];
      });
    }
    if (!elSelect) {
      if (selAttr === null)
        selCheck[key][attr] = null;
      return;
    }
    selCheck[key][attr] = selCheck[key][attr] || {};
  } else {
    elSelect = {};
    elSelect[attr] = selAttr;
  }
  return elSelect;
};
var findSelector = (hasSelectors, elSelectors, select, props, tag) => {
  let el;
  selectTypes.map((type) => {
    if (tag.indexOf(type[1]) !== -1) {
      const split = tag.split(type[1]);
      if (type[0] === "data") {
        const dataSplit = split[1].split("=");
        const key = clean(dataSplit[0].replace("]", ""));
        const dataKey = dataSplit[1] && clean(dataSplit[1].replace("]", "")) || "";
        props[key] = { ...props[key], [dataKey]: elSelectors[select] };
      } else {
        props[type[0]] = {
          ...props[type[0]],
          [clean(split[1])]: elSelectors[select]
        };
      }
      el = clean(split[0]);
      if (el.indexOf(".") !== -1 || el.indexOf("#") !== -1 || el.indexOf("[") !== -1) {
        console.warn(
          `Error: "${el}" is not formatted correctly. It contains one of ". # ["`
        );
      }
      hasSelectors.push(true);
    }
  });
  return el;
};
var setupSelectors = (options) => {
  const selCheck = (0, import_jsutils.deepMerge)(selectorCheck);
  const selectorArr = Object.keys(selCheck);
  Object.keys(options).map((key) => {
    if (selectorArr.indexOf(key) === -1)
      return;
    const props = {};
    Object.keys(options[key]).map((attr) => {
      const attribute = options[key][attr];
      let elSelectors = buildElSelectors(selCheck, attribute, key, attr);
      if (!elSelectors)
        return;
      const isArr = Array.isArray(elSelectors);
      if (isArr) {
        if (!options[key][attr].value)
          return;
        selCheck[key][attr].value = options[key][attr].value;
      }
      Object.keys(elSelectors).map((select) => {
        const tags = isArr && elSelectors[select] || select;
        const allTags = tags.split(",");
        allTags.map((_tag) => {
          const tag = clean(_tag);
          const hasSelectors = [];
          let el = findSelector(hasSelectors, elSelectors, select, props, tag);
          if (hasSelectors.indexOf(true) !== -1) {
            const loc = key !== "tagConvert" ? attr : el;
            selCheck[key] = selCheck[key] || {};
            selCheck[key][loc] = selCheck[key][loc] || {};
            selCheck[key][loc][el] = { ...selCheck[key][loc][el], ...props };
          } else {
            const loc = key !== "tagConvert" ? attr : tag;
            selCheck[key] = selCheck[key] || {};
            selCheck[key][loc] = selCheck[key][loc] || {};
            selCheck[key][loc][tag] = selCheck[key][loc][tag] || {};
            selCheck[key][loc][tag].all = elSelectors[select];
          }
        });
      });
    });
  });
  return selCheck;
};
var addChildren = (block, childs) => {
  const addChilds = childs.length === 1 && typeof childs[0] === "string" ? childs[0] : childs.length && childs || null;
  if (addChilds) {
    if (!block[2])
      block[2] = addChilds;
    else if (Array.isArray(block[2]))
      block[2] = block[2].concat(addChilds);
    else
      block[2] = [block[2]].concat(addChilds);
  }
  return block;
};
var convertCase = (text) => {
  let converted = "";
  const text_split = text.split("-");
  if (!text_split.length)
    return text;
  converted += text_split.shift();
  text_split.map((val) => {
    converted += val.charAt(0).toUpperCase() + val.slice(1);
  });
  return converted;
};
var convertStyle = (styles) => {
  const valObj = {};
  const val_split = styles.trim().split(";");
  Array.isArray(val_split) && val_split[0].trim() !== "" && val_split.map((item) => {
    if (item.indexOf(":") !== -1) {
      const item_split = item.split(":");
      if (Array.isArray(item_split) && item_split.length === 2) {
        if (item_split[0].trim() !== "" && item_split[1].trim() !== "") {
          valObj[convertCase(item_split[0].trim())] = item_split[1].trim();
        }
      }
    }
  });
  return valObj;
};
var splitKeyValue = (str, sep) => {
  const idx = str.indexOf(sep);
  if (idx === -1)
    return [str];
  return [str.slice(0, idx), str.slice(idx + sep.length)];
};
var unquote = (str) => {
  const car = str.charAt(0);
  const end = str.length - 1;
  const isQuoteStart = car === '"' || car === "'";
  return isQuoteStart && car === str.charAt(end) ? str.slice(1, end) : str;
};

// src/parser.js
function parser(tokens, options) {
  const root = { tagName: null, children: [] };
  const state = { tokens, options, cursor: 0, stack: [root] };
  parse(state);
  return root.children;
}
function hasTerminalParent(tagName, stack, terminals) {
  const tagParents = terminals[tagName];
  if (tagParents) {
    let currentIndex = stack.length - 1;
    while (currentIndex >= 0) {
      const parentTagName = stack[currentIndex].tagName;
      if (parentTagName === tagName) {
        break;
      }
      if (arrayIncludes(tagParents, parentTagName)) {
        return true;
      }
      currentIndex--;
    }
  }
  return false;
}
function parse(state) {
  const { tokens, options } = state;
  let { stack } = state;
  let nodes = stack[stack.length - 1].children;
  const len = tokens.length;
  let { cursor } = state;
  while (cursor < len) {
    const token = tokens[cursor];
    if (token.type !== "tag-start") {
      nodes.push(token);
      cursor++;
      continue;
    }
    const tagToken = tokens[++cursor];
    cursor++;
    const tagName = tagToken.content.toLowerCase();
    if (token.close) {
      let index = stack.length;
      let didRewind = false;
      while (--index > -1) {
        if (stack[index].tagName === tagName) {
          stack.splice(index);
          didRewind = true;
          break;
        }
      }
      while (cursor < len) {
        const endToken = tokens[cursor];
        if (endToken.type !== "tag-end")
          break;
        cursor++;
      }
      if (didRewind) {
        break;
      } else {
        continue;
      }
    }
    const isClosingTag = arrayIncludes(options.closingTags, tagName);
    let shouldRewindToAutoClose = isClosingTag;
    if (shouldRewindToAutoClose) {
      const { closingTagAncestorBreakers: terminals } = options;
      shouldRewindToAutoClose = !hasTerminalParent(tagName, stack, terminals);
    }
    if (shouldRewindToAutoClose) {
      let currentIndex = stack.length - 1;
      while (currentIndex > 0) {
        if (tagName === stack[currentIndex].tagName) {
          stack = stack.slice(0, currentIndex);
          const previousIndex = currentIndex - 1;
          nodes = stack[previousIndex].children;
          break;
        }
        currentIndex = currentIndex - 1;
      }
    }
    let attributes = [];
    let attrToken;
    while (cursor < len) {
      attrToken = tokens[cursor];
      if (attrToken.type === "tag-end")
        break;
      attributes.push(attrToken.content);
      cursor++;
    }
    cursor++;
    const children = [];
    attributes = Array.isArray(attributes) && attributes.length ? attributes.reduce((attrs, attr) => {
      const parts = splitKeyValue(attr, "=");
      attrs[parts[0]] = parts[1] && unquote(parts[1]) || "";
      return attrs;
    }, {}) : {};
    nodes.push({
      0: tagToken.content,
      1: attributes,
      2: children
    });
    const hasChildren = !(attrToken.close || arrayIncludes(options.voidTags, tagName));
    if (hasChildren) {
      stack.push({ tagName, children });
      const innerState = { tokens, options, cursor, stack };
      parse(innerState);
      cursor = innerState.cursor;
    }
  }
  state.cursor = cursor;
}

// src/prop_map.js
var propMap = {
  // HTML
  accept: "accept",
  acceptcharset: "acceptCharset",
  "accept-charset": "acceptCharset",
  accesskey: "accessKey",
  action: "action",
  allowfullscreen: "allowFullScreen",
  alt: "alt",
  as: "as",
  async: "async",
  autocapitalize: "autoCapitalize",
  autocomplete: "autoComplete",
  autocorrect: "autoCorrect",
  autofocus: "autoFocus",
  autoplay: "autoPlay",
  autosave: "autoSave",
  capture: "capture",
  cellpadding: "cellPadding",
  cellspacing: "cellSpacing",
  challenge: "challenge",
  charset: "charSet",
  checked: "checked",
  children: "children",
  cite: "cite",
  class: "className",
  classid: "classID",
  classname: "className",
  cols: "cols",
  colspan: "colSpan",
  content: "content",
  contenteditable: "contentEditable",
  contextmenu: "contextMenu",
  controls: "controls",
  controlslist: "controlsList",
  coords: "coords",
  crossorigin: "crossOrigin",
  dangerouslysetinnerhtml: "dangerouslySetInnerHTML",
  data: "data",
  datetime: "dateTime",
  default: "default",
  defaultchecked: "defaultChecked",
  defaultvalue: "defaultValue",
  defer: "defer",
  dir: "dir",
  disabled: "disabled",
  download: "download",
  draggable: "draggable",
  enctype: "encType",
  for: "htmlFor",
  form: "form",
  formmethod: "formMethod",
  formaction: "formAction",
  formenctype: "formEncType",
  formnovalidate: "formNoValidate",
  formtarget: "formTarget",
  frameborder: "frameBorder",
  headers: "headers",
  height: "height",
  hidden: "hidden",
  high: "high",
  href: "href",
  hreflang: "hrefLang",
  htmlfor: "htmlFor",
  httpequiv: "httpEquiv",
  "http-equiv": "httpEquiv",
  icon: "icon",
  id: "id",
  innerhtml: "innerHTML",
  inputmode: "inputMode",
  integrity: "integrity",
  is: "is",
  itemid: "itemID",
  itemprop: "itemProp",
  itemref: "itemRef",
  itemscope: "itemScope",
  itemtype: "itemType",
  keyparams: "keyParams",
  keytype: "keyType",
  kind: "kind",
  label: "label",
  lang: "lang",
  list: "list",
  loop: "loop",
  low: "low",
  manifest: "manifest",
  marginwidth: "marginWidth",
  marginheight: "marginHeight",
  max: "max",
  maxlength: "maxLength",
  media: "media",
  mediagroup: "mediaGroup",
  method: "method",
  min: "min",
  minlength: "minLength",
  multiple: "multiple",
  muted: "muted",
  name: "name",
  nomodule: "noModule",
  nonce: "nonce",
  novalidate: "noValidate",
  open: "open",
  optimum: "optimum",
  pattern: "pattern",
  placeholder: "placeholder",
  playsinline: "playsInline",
  poster: "poster",
  preload: "preload",
  profile: "profile",
  radiogroup: "radioGroup",
  readonly: "readOnly",
  referrerpolicy: "referrerPolicy",
  rel: "rel",
  required: "required",
  reversed: "reversed",
  role: "role",
  rows: "rows",
  rowspan: "rowSpan",
  sandbox: "sandbox",
  scope: "scope",
  scoped: "scoped",
  scrolling: "scrolling",
  seamless: "seamless",
  selected: "selected",
  shape: "shape",
  size: "size",
  sizes: "sizes",
  span: "span",
  spellcheck: "spellCheck",
  src: "src",
  srcdoc: "srcDoc",
  srclang: "srcLang",
  srcset: "srcSet",
  start: "start",
  step: "step",
  style: "style",
  summary: "summary",
  tabindex: "tabIndex",
  target: "target",
  title: "title",
  type: "type",
  usemap: "useMap",
  value: "value",
  width: "width",
  wmode: "wmode",
  wrap: "wrap",
  // SVG
  about: "about",
  accentheight: "accentHeight",
  "accent-height": "accentHeight",
  accumulate: "accumulate",
  additive: "additive",
  alignmentbaseline: "alignmentBaseline",
  "alignment-baseline": "alignmentBaseline",
  allowreorder: "allowReorder",
  alphabetic: "alphabetic",
  amplitude: "amplitude",
  arabicform: "arabicForm",
  "arabic-form": "arabicForm",
  ascent: "ascent",
  attributename: "attributeName",
  attributetype: "attributeType",
  autoreverse: "autoReverse",
  azimuth: "azimuth",
  basefrequency: "baseFrequency",
  baselineshift: "baselineShift",
  "baseline-shift": "baselineShift",
  baseprofile: "baseProfile",
  bbox: "bbox",
  begin: "begin",
  bias: "bias",
  by: "by",
  calcmode: "calcMode",
  capheight: "capHeight",
  "cap-height": "capHeight",
  clip: "clip",
  clippath: "clipPath",
  "clip-path": "clipPath",
  clippathunits: "clipPathUnits",
  cliprule: "clipRule",
  "clip-rule": "clipRule",
  color: "color",
  colorinterpolation: "colorInterpolation",
  "color-interpolation": "colorInterpolation",
  colorinterpolationfilters: "colorInterpolationFilters",
  "color-interpolation-filters": "colorInterpolationFilters",
  colorprofile: "colorProfile",
  "color-profile": "colorProfile",
  colorrendering: "colorRendering",
  "color-rendering": "colorRendering",
  contentscripttype: "contentScriptType",
  contentstyletype: "contentStyleType",
  cursor: "cursor",
  cx: "cx",
  cy: "cy",
  d: "d",
  datatype: "datatype",
  decelerate: "decelerate",
  descent: "descent",
  diffuseconstant: "diffuseConstant",
  direction: "direction",
  display: "display",
  divisor: "divisor",
  dominantbaseline: "dominantBaseline",
  "dominant-baseline": "dominantBaseline",
  dur: "dur",
  dx: "dx",
  dy: "dy",
  edgemode: "edgeMode",
  elevation: "elevation",
  enablebackground: "enableBackground",
  "enable-background": "enableBackground",
  end: "end",
  exponent: "exponent",
  externalresourcesrequired: "externalResourcesRequired",
  fill: "fill",
  fillopacity: "fillOpacity",
  "fill-opacity": "fillOpacity",
  fillrule: "fillRule",
  "fill-rule": "fillRule",
  filter: "filter",
  filterres: "filterRes",
  filterunits: "filterUnits",
  floodopacity: "floodOpacity",
  "flood-opacity": "floodOpacity",
  floodcolor: "floodColor",
  "flood-color": "floodColor",
  focusable: "focusable",
  fontfamily: "fontFamily",
  "font-family": "fontFamily",
  fontsize: "fontSize",
  "font-size": "fontSize",
  fontsizeadjust: "fontSizeAdjust",
  "font-size-adjust": "fontSizeAdjust",
  fontstretch: "fontStretch",
  "font-stretch": "fontStretch",
  fontstyle: "fontStyle",
  "font-style": "fontStyle",
  fontvariant: "fontVariant",
  "font-variant": "fontVariant",
  fontweight: "fontWeight",
  "font-weight": "fontWeight",
  format: "format",
  from: "from",
  fx: "fx",
  fy: "fy",
  g1: "g1",
  g2: "g2",
  glyphname: "glyphName",
  "glyph-name": "glyphName",
  glyphorientationhorizontal: "glyphOrientationHorizontal",
  "glyph-orientation-horizontal": "glyphOrientationHorizontal",
  glyphorientationvertical: "glyphOrientationVertical",
  "glyph-orientation-vertical": "glyphOrientationVertical",
  glyphref: "glyphRef",
  gradienttransform: "gradientTransform",
  gradientunits: "gradientUnits",
  hanging: "hanging",
  horizadvx: "horizAdvX",
  "horiz-adv-x": "horizAdvX",
  horizoriginx: "horizOriginX",
  "horiz-origin-x": "horizOriginX",
  ideographic: "ideographic",
  imagerendering: "imageRendering",
  "image-rendering": "imageRendering",
  in2: "in2",
  in: "in",
  inlist: "inlist",
  intercept: "intercept",
  k1: "k1",
  k2: "k2",
  k3: "k3",
  k4: "k4",
  k: "k",
  kernelmatrix: "kernelMatrix",
  kernelunitlength: "kernelUnitLength",
  kerning: "kerning",
  keypoints: "keyPoints",
  keysplines: "keySplines",
  keytimes: "keyTimes",
  lengthadjust: "lengthAdjust",
  letterspacing: "letterSpacing",
  "letter-spacing": "letterSpacing",
  lightingcolor: "lightingColor",
  "lighting-color": "lightingColor",
  limitingconeangle: "limitingConeAngle",
  local: "local",
  markerend: "markerEnd",
  "marker-end": "markerEnd",
  markerheight: "markerHeight",
  markermid: "markerMid",
  "marker-mid": "markerMid",
  markerstart: "markerStart",
  "marker-start": "markerStart",
  markerunits: "markerUnits",
  markerwidth: "markerWidth",
  mask: "mask",
  maskcontentunits: "maskContentUnits",
  maskunits: "maskUnits",
  mathematical: "mathematical",
  mode: "mode",
  numoctaves: "numOctaves",
  offset: "offset",
  opacity: "opacity",
  operator: "operator",
  order: "order",
  orient: "orient",
  orientation: "orientation",
  origin: "origin",
  overflow: "overflow",
  overlineposition: "overlinePosition",
  "overline-position": "overlinePosition",
  overlinethickness: "overlineThickness",
  "overline-thickness": "overlineThickness",
  paintorder: "paintOrder",
  "paint-order": "paintOrder",
  panose1: "panose1",
  "panose-1": "panose1",
  pathlength: "pathLength",
  patterncontentunits: "patternContentUnits",
  patterntransform: "patternTransform",
  patternunits: "patternUnits",
  pointerevents: "pointerEvents",
  "pointer-events": "pointerEvents",
  points: "points",
  pointsatx: "pointsAtX",
  pointsaty: "pointsAtY",
  pointsatz: "pointsAtZ",
  prefix: "prefix",
  preservealpha: "preserveAlpha",
  preserveaspectratio: "preserveAspectRatio",
  primitiveunits: "primitiveUnits",
  property: "property",
  r: "r",
  radius: "radius",
  refx: "refX",
  refy: "refY",
  renderingintent: "renderingIntent",
  "rendering-intent": "renderingIntent",
  repeatcount: "repeatCount",
  repeatdur: "repeatDur",
  requiredextensions: "requiredExtensions",
  requiredfeatures: "requiredFeatures",
  resource: "resource",
  restart: "restart",
  result: "result",
  results: "results",
  rotate: "rotate",
  rx: "rx",
  ry: "ry",
  scale: "scale",
  security: "security",
  seed: "seed",
  shaperendering: "shapeRendering",
  "shape-rendering": "shapeRendering",
  slope: "slope",
  spacing: "spacing",
  specularconstant: "specularConstant",
  specularexponent: "specularExponent",
  speed: "speed",
  spreadmethod: "spreadMethod",
  startoffset: "startOffset",
  stddeviation: "stdDeviation",
  stemh: "stemh",
  stemv: "stemv",
  stitchtiles: "stitchTiles",
  stopcolor: "stopColor",
  "stop-color": "stopColor",
  stopopacity: "stopOpacity",
  "stop-opacity": "stopOpacity",
  strikethroughposition: "strikethroughPosition",
  "strikethrough-position": "strikethroughPosition",
  strikethroughthickness: "strikethroughThickness",
  "strikethrough-thickness": "strikethroughThickness",
  string: "string",
  stroke: "stroke",
  strokedasharray: "strokeDasharray",
  "stroke-dasharray": "strokeDasharray",
  strokedashoffset: "strokeDashoffset",
  "stroke-dashoffset": "strokeDashoffset",
  strokelinecap: "strokeLinecap",
  "stroke-linecap": "strokeLinecap",
  strokelinejoin: "strokeLinejoin",
  "stroke-linejoin": "strokeLinejoin",
  strokemiterlimit: "strokeMiterlimit",
  "stroke-miterlimit": "strokeMiterlimit",
  strokewidth: "strokeWidth",
  "stroke-width": "strokeWidth",
  strokeopacity: "strokeOpacity",
  "stroke-opacity": "strokeOpacity",
  suppresscontenteditablewarning: "suppressContentEditableWarning",
  suppresshydrationwarning: "suppressHydrationWarning",
  surfacescale: "surfaceScale",
  systemlanguage: "systemLanguage",
  tablevalues: "tableValues",
  targetx: "targetX",
  targety: "targetY",
  textanchor: "textAnchor",
  "text-anchor": "textAnchor",
  textdecoration: "textDecoration",
  "text-decoration": "textDecoration",
  textlength: "textLength",
  textrendering: "textRendering",
  "text-rendering": "textRendering",
  to: "to",
  transform: "transform",
  typeof: "typeof",
  u1: "u1",
  u2: "u2",
  underlineposition: "underlinePosition",
  "underline-position": "underlinePosition",
  underlinethickness: "underlineThickness",
  "underline-thickness": "underlineThickness",
  unicode: "unicode",
  unicodebidi: "unicodeBidi",
  "unicode-bidi": "unicodeBidi",
  unicoderange: "unicodeRange",
  "unicode-range": "unicodeRange",
  unitsperem: "unitsPerEm",
  "units-per-em": "unitsPerEm",
  unselectable: "unselectable",
  valphabetic: "vAlphabetic",
  "v-alphabetic": "vAlphabetic",
  values: "values",
  vectoreffect: "vectorEffect",
  "vector-effect": "vectorEffect",
  version: "version",
  vertadvy: "vertAdvY",
  "vert-adv-y": "vertAdvY",
  vertoriginx: "vertOriginX",
  "vert-origin-x": "vertOriginX",
  vertoriginy: "vertOriginY",
  "vert-origin-y": "vertOriginY",
  vhanging: "vHanging",
  "v-hanging": "vHanging",
  videographic: "vIdeographic",
  "v-ideographic": "vIdeographic",
  viewbox: "viewBox",
  viewtarget: "viewTarget",
  visibility: "visibility",
  vmathematical: "vMathematical",
  "v-mathematical": "vMathematical",
  vocab: "vocab",
  widths: "widths",
  wordspacing: "wordSpacing",
  "word-spacing": "wordSpacing",
  writingmode: "writingMode",
  "writing-mode": "writingMode",
  x1: "x1",
  x2: "x2",
  x: "x",
  xchannelselector: "xChannelSelector",
  xheight: "xHeight",
  "x-height": "xHeight",
  xlinkactuate: "xlinkActuate",
  "xlink:actuate": "xlinkActuate",
  xlinkarcrole: "xlinkArcrole",
  "xlink:arcrole": "xlinkArcrole",
  xlinkhref: "xlinkHref",
  "xlink:href": "xlinkHref",
  xlinkrole: "xlinkRole",
  "xlink:role": "xlinkRole",
  xlinkshow: "xlinkShow",
  "xlink:show": "xlinkShow",
  xlinktitle: "xlinkTitle",
  "xlink:title": "xlinkTitle",
  xlinktype: "xlinkType",
  "xlink:type": "xlinkType",
  xmlbase: "xmlBase",
  "xml:base": "xmlBase",
  xmllang: "xmlLang",
  "xml:lang": "xmlLang",
  xmlns: "xmlns",
  "xml:space": "xmlSpace",
  xmlnsxlink: "xmlnsXlink",
  "xmlns:xlink": "xmlnsXlink",
  xmlspace: "xmlSpace",
  y1: "y1",
  y2: "y2",
  y: "y",
  ychannelselector: "yChannelSelector",
  z: "z",
  zoomandpan: "zoomAndPan"
};
var revPropMap = Object.entries(propMap).reduce(
  (obj, [key, value]) => ({ ...obj, [value]: key }),
  {}
);

// src/stringify.js
var opts = {
  styleAsCss: true,
  selfClosing: true,
  attrLowerCase: false
};
var formatAttributes = (attributes, options = opts) => {
  let attrString = Object.keys(attributes).reduce((attrs, currentKey) => {
    let key = currentKey;
    if (options.hasOpts && options.attrLowerCase && revPropMap[currentKey])
      key = revPropMap[currentKey];
    let value = attributes[currentKey];
    if (!value)
      return `${attrs} ${key}`;
    else if (key === "style" && typeof value === "object") {
      let styles = "";
      const noCss = options.styleAsCss === false;
      Object.keys(value).map((_name) => {
        const name = noCss ? _name : _name.split(/(?=[A-Z])/).join("-").toLowerCase();
        styles += `${name}: ${value[_name]}; `;
      });
      const quoteEscape = styles.indexOf("'") !== -1;
      const quote = quoteEscape ? '"' : "'";
      return `${attrs} ${key}=${quote}${styles.trim()}${quote}`;
    }
    if (typeof value === "boolean")
      value = `${value}`;
    if (typeof value === "string") {
      const quoteEscape = value.indexOf("'") !== -1;
      const quote = quoteEscape ? '"' : "'";
      return `${attrs} ${key}=${quote}${value}${quote}`;
    }
    return attrs;
  }, "");
  attrString = typeof attrString === "string" && attrString.trim() || "";
  return attrString.length ? " " + attrString : "";
};
var buildTag = (tagName, attributes, children, options = opts) => {
  return `<${tagName}${formatAttributes(attributes, options)}>${toHTML(children, options) || ""}</${tagName}>`;
};
var buildSelfCloseTag = (tagName, attributes, options = opts) => {
  let formatted = formatAttributes(attributes, options);
  formatted = formatted.length ? formatted + " " : formatted;
  const inCloseArr = Array.isArray(options.selfClosing) && !options.selfClosing.includes(tagName);
  const end = options.selfClosing !== false && !inCloseArr ? `/` : ``;
  const full = `${tagName}${formatted}${end}`.trim();
  return `<${full}>`;
};
function toHTML(tree, _options) {
  const options = Object.assign({ ...opts }, _options);
  if (typeof tree === "string")
    return tree;
  return tree && tree.map((node) => {
    if (typeof node === "string")
      return node;
    if (node.type === "comment")
      return `<!--${node.content}-->`;
    const tagName = node[0];
    const attributes = node[1];
    const children = node[2];
    const tagCheck = !children && tagName.toLowerCase() || tagName;
    const isSelfClosing = arrayIncludes(options.voidTags, tagCheck);
    return isSelfClosing ? buildSelfCloseTag(tagName, attributes, options) : buildTag(tagName, attributes, children, options);
  }).join("");
}

// src/format.js
var import_jsutils2 = __toESM(require_cjs());
var defRoot = { 0: "div" };
var opts2 = {
  trim: false,
  root: void 0,
  attrKeyAdd: {},
  tagConvert: {},
  comments: true,
  parseInt: false,
  parseBoolean: true,
  lowerCaseTag: true,
  attrKeyConvert: {},
  attrValueConvert: {},
  attrCamelCase: false,
  attrArrEmpty: void 0
};
var domTagAction = "$$DOM_TAG_NAME";
var convertBlock = (block, parent, nodes, children, tree, options) => {
  const data = options.selectorCheck.tagConvert[block[0]] ? runAction(
    {
      action: options.selectorCheck.tagConvert[block[0]],
      node: block,
      key: domTagAction,
      value: block[0],
      nodes,
      children
    },
    "value",
    options
  ) : block[0];
  if (typeof data === "string")
    block[0] = data;
  if (typeof data === "object")
    block = data;
  block[1] = typeof block[1] === "object" ? Object.keys(block[1]).reduce((attrs, key) => {
    let useKey = options.selectorCheck.attrKeyConvert[key] ? runAction(
      {
        action: options.selectorCheck.attrKeyConvert[key],
        node: block,
        value: block[1][key],
        key,
        nodes,
        children
      },
      "key",
      options
    ) : key;
    useKey = options.attrCamelCase && propMap[useKey] || useKey;
    if (useKey && block[1][key]) {
      attrs[useKey] = options.selectorCheck.attrValueConvert[key] ? runAction(
        {
          action: options.selectorCheck.attrValueConvert[key],
          node: block,
          value: block[1][key],
          key,
          nodes,
          children
        },
        "value",
        options
      ) : typeof block[1][key] === "string" ? unquote(block[1][key]) : block[1][key];
    }
    return attrs;
  }, {}) : {};
  if (block[2] && typeof block[2] !== "string" && block[2].length)
    block[2] = block[2].map(
      (child) => convertBlock(child, block, nodes, children, tree, options)
    );
  return tree && allElementsCB(block, parent, tree, options) || block;
};
var buildBlock = (org, added, nodes, children, parent, options) => {
  org[0] = added[0];
  org[1] = { ...org[1], ...added[1] };
  if (added[2])
    org[2] = added[2];
  return convertBlock(org, parent, nodes, children, void 0, options);
};
var tagConvert = (args, options) => {
  let block = args.block;
  const { node, nodes, parent, action, children } = args;
  const tagName = node[0];
  if (!tagName)
    return block;
  block[0] = options.lowerCaseTag ? tagName.toLowerCase() : tagName;
  if (typeof action === "function") {
    let data = runAction(
      {
        key: domTagAction,
        value: block[0],
        action,
        node,
        nodes,
        children
      },
      "value",
      options
    );
    if (!data)
      return block;
    if (typeof data === "string")
      data = { 0: data };
    if (typeof data === "object")
      block = buildBlock(block, data, nodes, children, parent, options);
  } else if (typeof action === "object" && !Array.isArray(action) && action[0]) {
    block = buildBlock(block, action, nodes, children, parent, options);
  } else {
    const data = runAction(
      {
        key: domTagAction,
        value: block[0],
        action,
        node,
        nodes,
        children
      },
      "value",
      options
    );
    if (typeof data === "string")
      block[0] = data;
    if (typeof data === "object")
      block = buildBlock(block, data, nodes, children, parent, options);
  }
  return block;
};
var format = (args, options) => {
  let nodes = args.nodes;
  const { tree, parent, childs } = args;
  return childs ? childs.reduce((children, node) => {
    nodes = nodes || childs;
    const child = node.type === "text" || node.type === "comment" ? filterFS(node, options) : formatNode(
      {
        node,
        childs,
        nodes,
        children,
        tree,
        parent
      },
      options
    );
    child && children.push(child);
    return children;
  }, []) : [];
};
var formatNode = (args, options) => {
  const { node, tree, nodes, parent, children } = args;
  const block = options.selectorCheck.tagConvert[node[0]] ? tagConvert(
    {
      action: options.selectorCheck.tagConvert[node[0]],
      block: {},
      value: node[0],
      node,
      nodes,
      children,
      parent
    },
    options
  ) : { 0: node[0] };
  const attrs = formatAttributes2(
    {
      attributes: node[1],
      node,
      nodes,
      children
    },
    options
  );
  block[1] = { ...attrs, ...block[1] };
  return allElementsCB(
    // Add the children to the block
    addChildren(
      block,
      // Format the children before adding to the block
      format(
        {
          tree,
          childs: node[2],
          parent: block,
          nodes,
          children
        },
        options
      )
    ),
    parent,
    tree,
    options
  );
};
var formatAttributes2 = (args, options) => {
  const { node, nodes, children, attributes = {} } = args;
  const attrs = {};
  Object.keys(attributes).map((item) => {
    const parts = [item, attributes[item]];
    if (options.selectorCheck.attrKeyConvert[parts[0]] === null)
      return;
    let key = options.selectorCheck.attrKeyConvert[parts[0]] ? runAction(
      {
        action: options.selectorCheck.attrKeyConvert[parts[0]],
        key: parts[0],
        value: parts[1],
        node,
        nodes,
        children
      },
      "key",
      options
    ) : parts[0];
    key = options.attrCamelCase && propMap[key] || key;
    const value = typeof parts[1] === "string" || typeof parts[1] === "object" ? formatValue(
      {
        key: parts[0],
        value: parts[1],
        node,
        nodes,
        children
      },
      options
    ) : null;
    if (key) {
      if ((key === "className" || key === "class") && value === "")
        attrs[key] = "";
      if (key === "id" && !value)
        return;
      attrs[key] = value || value === false ? value : true;
    }
  });
  return options.attrArrEmpty ? attrs : addAttribute(
    {
      node,
      attrs,
      nodes,
      children
    },
    options
  );
};
var formatValue = (args, options) => {
  var _a;
  const { node, key, value, nodes, children } = args;
  const updatedVal = key === "style" && typeof value === "string" ? convertStyle(unquote(value)) : options.selectorCheck.attrValueConvert[key] ? runAction(
    {
      action: options.selectorCheck.attrValueConvert[key],
      value: unquote(value),
      node,
      key,
      nodes,
      children
    },
    "value",
    options
  ) : typeof value === "string" && unquote(value) || value;
  const trimmed = (_a = updatedVal == null ? void 0 : updatedVal.trim) == null ? void 0 : _a.call(updatedVal);
  if (options.parseBoolean) {
    if (trimmed === `true`)
      return true;
    if (trimmed === `false`)
      return false;
  }
  if (options.parseInt) {
    const asInt = parseInt(trimmed);
    if (`${asInt}` === trimmed)
      return asInt;
  }
  return updatedVal;
};
var runAction = (args, def, options) => {
  const { key, node, value, nodes, action, children } = args;
  switch (typeof action) {
    case "string":
      return action || args[def];
    case "function":
      return action(
        {
          0: node[0],
          1: node[1],
          2: node[2]
        },
        key,
        value,
        nodes,
        children,
        options
      ) || args[def];
    case "object":
      let updateVal;
      const tagType = node[0];
      if (!tagType)
        return args[def];
      const nodeAttrs = node[1];
      if (!nodeAttrs)
        return args[def];
      const selector = action[tagType];
      if (!selector)
        return args[def];
      updateVal = selector.all || null;
      const selectKeys = Object.keys(selector);
      if (
        // Check if there are more keys then just the all key
        selector.all && selectKeys.length > 1 || // Check if there is no all key, but there are other keys
        !selector.all && selectKeys.length >= 1
      ) {
        if (!nodeAttrs)
          return args[def];
        let setSelector;
        Object.keys(selector).map((key2) => {
          if (setSelector || !nodeAttrs[key2] && nodeAttrs[key2] !== "")
            return;
          if (nodeAttrs[key2] === "true" && !selector[key2][nodeAttrs[key2]] && selector[key2][""]) {
            updateVal = selector[key2][""];
            setSelector = true;
          } else if (selector[key2][nodeAttrs[key2]]) {
            updateVal = selector[key2][nodeAttrs[key2]];
            setSelector = true;
          }
        });
      }
      if (updateVal) {
        if (typeof updateVal === "string" || typeof updateVal === "object")
          return updateVal;
        else if (typeof updateVal === "function") {
          return updateVal(
            {
              0: node[0],
              1: node[1],
              2: node[2]
            },
            key,
            value,
            nodes,
            children,
            options
          ) || args[def];
        }
      }
      return args[def];
    default:
      return action || args[def];
  }
};
var addAttribute = (args, options) => {
  const { node, attrs, nodes, children } = args;
  Object.keys(options.selectorCheck.attrKeyAdd).map((key) => {
    const value = runAction(
      {
        key,
        node,
        nodes,
        children,
        action: options.selectorCheck.attrKeyAdd[key]
      },
      void 0,
      options
    );
    if (value)
      attrs[key] = value;
  });
  return attrs;
};
var filterFS = (node, options) => {
  let start = "";
  let end = "";
  let text = node.content;
  if (node.type === "comment") {
    if (!options.comments)
      return null;
    start = "<!--";
    end = "-->";
  }
  if (options.trim) {
    return node.content.trim() !== "\n" && node.content.replace(/\s/g, "").length > 0 ? start + node.content.trim() + end : null;
  }
  return text ? start + text + end : null;
};
var allElementsCB = (block, parent, tree, options) => {
  return typeof options.allElements === "function" ? options.allElements(block, parent, tree) || block : block;
};
var formatFS = (nodes, _options = import_jsutils2.emptyObj) => {
  const { root, ...rest } = _options;
  let rootFS = (0, import_jsutils2.deepMerge)({}, defRoot, root);
  const options = (0, import_jsutils2.deepMerge)({}, opts2, rest);
  options.selectorCheck = setupSelectors(options);
  options.attrArrEmpty = Object.keys(options.attrKeyAdd).length === 0;
  if (options.selectorCheck.tagConvert[rootFS[0]])
    rootFS = tagConvert(
      {
        nodes,
        rootFS,
        node: rootFS,
        block: rootFS,
        children: nodes,
        value: rootFS[0],
        action: options.selectorCheck.tagConvert[rootFS[0]]
      },
      options
    );
  rootFS[1] = formatAttributes2(
    {
      nodes,
      node: rootFS,
      children: nodes,
      attributes: rootFS[1]
    },
    options
  );
  rootFS[2] = Array.isArray(rootFS[2]) ? rootFS[2].map(
    (child) => convertBlock(child, rootFS, nodes, nodes, rootFS, options)
  ) : [];
  const builtRoot = addChildren(
    rootFS,
    format(
      {
        tree: rootFS,
        childs: nodes,
        parent: rootFS
      },
      options
    )
  );
  return allElementsCB(builtRoot, builtRoot, builtRoot, options);
};

// src/tags.js
var childlessTags = ["style", "script", "template"];
var closingTags = [
  "html",
  "head",
  "body",
  "p",
  "dt",
  "dd",
  "li",
  "option",
  "thead",
  "th",
  "tbody",
  "tr",
  "td",
  "tfoot",
  "colgroup"
];
var closingTagAncestorBreakers = {
  li: ["ul", "ol", "menu"],
  dt: ["dl"],
  dd: ["dl"],
  tbody: ["table"],
  thead: ["table"],
  tfoot: ["table"],
  tr: ["table"],
  td: ["table"]
};
var voidTags = [
  "!doctype",
  "area",
  "base",
  "br",
  "col",
  "command",
  "embed",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
];

// src/symplasm.ts
var parseDefaults = {
  voidTags,
  closingTags,
  childlessTags,
  hasOpts: false,
  includePositions: false,
  closingTagAncestorBreakers
};
function parse2(str, opts3) {
  let options = Object.assign({ ...parseDefaults }, opts3);
  const tokens = lexer(str, options);
  const nodes = parser(tokens, options);
  return formatFS(nodes, options);
}
function stringify(ast, opts3) {
  let options = { ...parseDefaults };
  options.hasOpts = false;
  if (opts3) {
    options = Object.assign({ ...parseDefaults }, opts3);
    options.hasOpts = true;
  }
  return Array.isArray(ast) ? toHTML(ast, options) : toHTML([ast], options);
}
(() => {
  if (Boolean(typeof window !== "undefined")) {
    window.Symplasm = { parse: parse2, stringify, parseDefaults };
  }
})();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  parse,
  parseDefaults,
  stringify
});
//# sourceMappingURL=index.js.map
