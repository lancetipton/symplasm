'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var selectTypes = [['class', '.'], ['id', '#'], ['data', '[']];

var addChildren = function addChildren(block, childs) {
  var addChilds = childs.length === 1 && typeof childs[0] === 'string' ? childs[0] : childs.length && childs || null;

  if (addChilds) {
    if (!block[2]) block[2] = addChilds;else if (Array.isArray(block[2])) block[2] = block[2].concat(addChilds);else block[2] = [block[2]].concat(addChilds);
  }
  return block;
};

var convertCase = function convertCase(text) {
  var converted = '';
  var text_split = text.split('-');
  if (!text_split.length) return text;
  converted += text_split.shift();
  text_split.map(function (val) {
    converted += val.charAt(0).toUpperCase() + val.slice(1);
  });
  return converted;
};

var convertStyle = function convertStyle(styles) {
  var valObj = {};
  var val_split = styles.trim().split(';');

  Array.isArray(val_split) && val_split[0].trim() !== '' && val_split.map(function (item) {
    if (item.indexOf(':') !== -1) {
      var item_split = item.split(':');
      if (Array.isArray(item_split) && item_split.length === 2) {
        if (item_split[0].trim() !== '' && item_split[1].trim() !== '') {
          valObj[convertCase(item_split[0].trim())] = item_split[1].trim();
        }
      }
    }
  });

  return valObj;
};

var setupSelectors = function setupSelectors(selectorCheck, options) {
  var selectorArr = Object.keys(selectorCheck);
  Object.keys(options).map(function (key) {
    // Only check keys from the selector Array
    if (selectorArr.indexOf(key) === -1) return;

    var props = {};
    Object.keys(options[key]).map(function (attr) {
      // Get the attribute to be checked - i.e. class / id / name
      var attribute = options[key][attr];

      // Get the element selectors,
      var elementSelectors = attribute.selector;

      if (key !== 'tagConvert') {
        // If it's just a string set it, and return
        // This means all items should be coverted
        // i.e. class='className'
        if (typeof attribute === 'string' || typeof attribute === 'function') {
          selectorCheck[key][attr] = attribute;
          return;
        }

        // If there's no selectors, loop the attribute and add the keys 
        // to the elementSelector
        if (!elementSelectors && Object.keys(attribute).length) {
          elementSelectors = {};
          Object.keys(attribute).map(function (key) {
            elementSelectors[key] = attribute[key];
          });
        }

        if (!elementSelectors) return;
        // Set the default for the selectorCheck items
        selectorCheck[key][attr] = selectorCheck[key][attr] || {};
      } else {
        elementSelectors = {};
        elementSelectors[attr] = attribute;
      }

      // chache selector type
      var isArr = Array.isArray(elementSelectors);
      // check that is has a value to return
      if (isArr) {
        // If it's an array and there is no value, we have no way to conver the items
        // So just return
        if (!options[key][attr].value) return;
        // Otherwise set the items
        selectorCheck[key][attr].value = options[key][attr].value;
      }

      Object.keys(elementSelectors).map(function (select) {
        // Selector tags - i.e. input.class / button#primary / select[td-select]
        var tags = isArr && elementSelectors[select] || select;
        // split all tags if more then 1
        var allTags = tags.split(',');
        // loop tags and split on selector type - i.e. class / id / name
        allTags.map(function (_tag) {
          var tag = clean(_tag);
          var el = void 0;

          var hasSelectors = [];
          // Loop selector types and add to select checker
          // This checks for a class / id / attribute on the select item
          selectTypes.map(function (type) {
            // If it has the passed in type in the string convert it, and add the the props
            if (tag.indexOf(type[1]) !== -1) {
              var split = tag.split(type[1]);
              if (type[0] === 'data') {
                var dataSplit = split[1].split('=');
                var _key = clean(dataSplit[0].replace(']', ''));
                var dataKey = dataSplit[1] && clean(dataSplit[1].replace(']', '')) || '';
                props[_key] = Object.assign({}, props[_key], _defineProperty({}, dataKey, elementSelectors[select]));
              } else {
                props[type[0]] = Object.assign({}, props[type[0]], _defineProperty({}, clean(split[1]), elementSelectors[select]));
              }

              el = clean(split[0]);
              if (el.indexOf('.') !== -1 || el.indexOf('#') !== -1 || el.indexOf('[') !== -1) {
                console.warn('Error: "' + el + '" is not formatted correctly. It contains one of ". # ["');
              }
              // Update that we have a select type on the selector
              hasSelectors.push(true);
            }
          });

          // Check if a select type was found on the selector
          // This will be an array of true if it had a select type on it
          // If no class / id / attribute was found on the selector, it will be an empty array
          // ------------------ ELEMENT WITH A SELECTOR ------------------ //
          if (hasSelectors.indexOf(true) !== -1) {
            var loc = key !== 'tagConvert' ? attr : el;
            selectorCheck[key] = selectorCheck[key] || {};
            selectorCheck[key][loc] = selectorCheck[key][loc] || {};
            selectorCheck[key][loc][el] = Object.assign({}, selectorCheck[key][loc][el], props);
          }
          // ------------------ ALL OF ELEMENT TYPE ------------------ //
          else {
              var _loc = key !== 'tagConvert' ? attr : tag;

              selectorCheck[key] = selectorCheck[key] || {};
              selectorCheck[key][_loc] = selectorCheck[key][_loc] || {};
              selectorCheck[key][_loc][tag] = selectorCheck[key][_loc][tag] || {};
              selectorCheck[key][_loc][tag].all = elementSelectors[select];
            }
        });
      });
    });
  });
  return selectorCheck;
};

var splitKeyValue = function splitKeyValue(str, sep) {
  var idx = str.indexOf(sep);
  if (idx === -1) return [str];
  return [str.slice(0, idx), str.slice(idx + sep.length)];
};

var clean = function clean(str) {
  return str && unquote(str.trim()).trim() || '';
};

var unquote = function unquote(str) {
  var car = str.charAt(0);
  var end = str.length - 1;
  var isQuoteStart = car === '"' || car === "'";
  if (isQuoteStart && car === str.charAt(end)) {
    return str.slice(1, end);
  }
  return str;
};

exports.addChildren = addChildren;
exports.convertCase = convertCase;
exports.convertStyle = convertStyle;
exports.setupSelectors = setupSelectors;
exports.splitKeyValue = splitKeyValue;
exports.unquote = unquote;
//# sourceMappingURL=helpers.js.map
