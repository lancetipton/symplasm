'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var options = {
  root: {
    0: 'div',
    1: {
      class: 'root-node'
    }
  },
  tagConvert: {},
  attrKeyConvert: {},
  attrValueConvert: {},
  attrKeyAdd: {},
  trim: false,
  lowerCaseTag: true
};

var selectorCheck = {
  tagConvert: {},
  attrKeyConvert: {},
  attrValueConvert: {},
  attrKeyAdd: {}
};
var attrArrEmpty = true;

// ----------- Converters ----------- //
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

var convertBlock = function convertBlock(block, nodes, children) {
  block[0] = options.tagConvert[block[0]] ? runAction({
    action: options.tagConvert[block[0]],
    node: block,
    key: '$$DOM_TAG_NAME',
    value: block[0],
    nodes: nodes,
    children: children
  }, 'value') : block[0];

  block[1] = _typeof(block[1]) === 'object' ? Object.keys(block[1]).reduce(function (attrs, key) {
    var useKey = options.attrKeyConvert[key] ? runAction({
      action: options.attrKeyConvert[key],
      node: block,
      value: block[1][key],
      key: key,
      nodes: nodes,
      children: children
    }, 'key') : key;

    if (useKey && block[1][key]) {
      attrs[useKey] = options.attrValueConvert[key] ? runAction({
        action: options.attrValueConvert[key],
        node: block,
        value: block[1][key],
        key: key,
        nodes: nodes,
        children: children
      }, 'value') : unquote(block[1][key]);
    }

    return attrs;
  }, {}) : {};

  if (block[2] && typeof block[2] !== 'string' && block[2].length) {
    block[2] = block[2].map(function (child) {
      return convertBlock(child, nodes, children);
    });
  }

  return block;
};

var buildBlock = function buildBlock(org, added, nodes, children) {
  org[0] = added[0];
  org[1] = Object.assign({}, org[1], added[1]);
  if (added[2]) org[2] = added[2];
  return convertBlock(org, nodes, children);
};

var tagConvert = function tagConvert(args) {
  var action = args.action,
      node = args.node,
      value = args.value,
      nodes = args.nodes,
      children = args.children;
  var block = args.block;


  var tagName = node.tagName || node[0];
  if (!tagName) return block;
  block[0] = options.lowerCaseTag ? tagName.toLowerCase() : tagName;

  if (typeof action === 'function') {
    var data = runAction({
      key: '$$DOM_TAG_NAME',
      value: block[0],
      action: action,
      node: node,
      nodes: nodes,
      children: children
    }, 'value');
    if (!data) return block;
    if (typeof data === 'string') data = { 0: data };

    if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') return buildBlock(block, data, nodes, children);
  } else if ((typeof action === 'undefined' ? 'undefined' : _typeof(action)) === 'object' && !Array.isArray(action) && action[0]) {
    return buildBlock(block, action, nodes, children);
  } else block[0] = runAction({
    key: '$$DOM_TAG_NAME',
    value: block[0],
    action: action,
    node: node,
    nodes: nodes,
    children: children
  }, 'value');

  return block;
};

// ----------- Run options methods ----------- //
var runAction = function runAction(args, def) {
  var action = args.action,
      node = args.node,
      key = args.key,
      value = args.value,
      nodes = args.nodes,
      children = args.children;


  switch (typeof action === 'undefined' ? 'undefined' : _typeof(action)) {
    case 'function':
      return action(node, key, value, nodes, children, options) || action;
    case 'object':
      var tagType = node.tagName || node[0];
      var updateValue = !action.selector;
      // Run default actions if no selector specified
      if (_typeof(action.selector) === 'object') {
        if (Array.isArray(action.selector) && action.selector.indexOf(tagType) !== -1) {}

        Object.keys(action.selector).map(function (key) {
          var actionValue = action.selector[key];
          if (typeof actionValue === 'string') {}
          if ((typeof actionValue === 'undefined' ? 'undefined' : _typeof(actionValue)) === 'object') {}
        });
      }
      if (updateValue) {
        if (!tagType || !action.value) return value;
        if (typeof action.value === 'string') return action.value;
        if (typeof action.value === 'function') return action.value(node, key, value, nodes, children, options);
      }

      return args[def];
    default:
      return action;
  }
};

// ----------- Formatters ----------- //
var format = function format(args) {
  var parent = args.parent,
      children = args.children;
  var childs = args.childs,
      nodes = args.nodes;


  return childs ? childs.reduce(function (children, node) {
    nodes = nodes || childs;
    var child = node.type === 'text' || node.type === 'comment' ? filterFS(node, parent) : formatNode(node, childs, nodes, children);
    child && children.push(child);
    return children;
  }, []) : [];
};

var formatNode = function formatNode(node, nodes, children) {

  var block = options.tagConvert[node.tagName] ? tagConvert({
    action: options.tagConvert[node.tagName],
    block: {},
    value: node.tagName,
    node: node,
    nodes: nodes,
    children: children
  }) : { 0: node.tagName };

  var attrs = formatAttributes({
    attributes: node.attributes,
    node: node,
    nodes: nodes,
    children: children
  });
  block[1] = Object.assign({}, block[1], attrs);

  var childs = format({
    childs: node.children,
    parent: block,
    nodes: nodes,
    children: children
  });
  return addChildren(block, childs);
};

var formatAttributes = function formatAttributes(args) {
  var node = args.node,
      attributes = args.attributes,
      nodes = args.nodes,
      children = args.children;

  var attrs = {};

  var isArray = Array.isArray(attributes);
  Object.keys(attributes).map(function (item) {
    var parts = isArray ? splitKeyValue(attributes[item].trim(), '=') : [item, attributes[item]];

    var key = options.attrKeyConvert && options.attrKeyConvert[parts[0]] ? runAction({
      action: options.attrKeyConvert[parts[0]],
      key: parts[0],
      value: parts[1],
      node: node,
      nodes: nodes,
      children: children
    }, 'key') : parts[0];

    var value = typeof parts[1] === 'string' ? formatValue({
      key: parts[0],
      value: parts[1],
      node: node,
      nodes: nodes,
      children: children
    }) : null;
    if (key && value) attrs[key] = value;
  });

  if (attrArrEmpty) return attrs;

  return addAttribute({
    node: node,
    attrs: attrs,
    nodes: nodes,
    children: children
  });
};

var formatValue = function formatValue(args) {
  var node = args.node,
      key = args.key,
      value = args.value,
      nodes = args.nodes,
      children = args.children;

  return key === 'style' && typeof value === 'string' ? convertStyle(unquote(value)) : options.attrValueConvert[key] ? runAction({
    action: options.attrValueConvert[key],
    value: unquote(value),
    node: node,
    key: key,
    nodes: nodes,
    children: children
  }, 'value') : unquote(value);
};

// ----------- Helpers ----------- //
var getSelector = function getSelector(node, selector) {};

var checkSelector = function checkSelector(args) {
  var action = args.action,
      node = args.node,
      key = args.key,
      value = args.value,
      nodes = args.nodes,
      children = args.children;

  var tagType = node.tagName || node[0];

  if (action.selector) {}
  // runAction
  // action, node, key, value, nodes, children
  // action.selector && action.selector.indexOf(tagType) === -1

  // addAttribute
  // node, attrs, nodes, children
  // !action.selector || action.selector.indexOf(node.tagName) !== -1
};

var addAttribute = function addAttribute(args) {
  var node = args.node,
      attrs = args.attrs,
      nodes = args.nodes,
      children = args.children;


  Object.keys(options.attrKeyAdd).map(function (key) {
    var action = options.attrKeyAdd[key];
    var value = void 0;
    if ((typeof action === 'undefined' ? 'undefined' : _typeof(action)) === 'object') {
      if (!action.value) return;
      var checkArgs = Object.assign({}, args, { action: action, key: key });

      if (checkSelector(checkArgs)) {
        value = typeof action.value === 'function' ? action.value(node, key, action.value, nodes, children, options) : action.value;
      }
    } else {
      value = runAction({
        action: options.attrKeyAdd[key],
        value: action.value,
        node: node,
        key: key,
        nodes: nodes,
        children: children
      });
    }
    if (value) attrs[key] = value;
  });

  return attrs;
};

var addChildren = function addChildren(block, childs) {
  var addChilds = childs.length === 1 && typeof childs[0] === 'string' ? childs[0] : childs.length && childs || null;

  if (addChilds) {
    if (!block[2]) block[2] = addChilds;else if (Array.isArray(block[2])) block[2] = block[2].concat(addChilds);else block[2] = [block[2]].concat(addChilds);
  }
  return block;
};

var splitKeyValue = function splitKeyValue(str, sep) {
  var idx = str.indexOf(sep);
  if (idx === -1) return [str];
  return [str.slice(0, idx), str.slice(idx + sep.length)];
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

var filterFS = function filterFS(node) {
  var start = '';
  var end = '';
  var text = node.content;
  if (node.type === 'comment') {
    start = '<!--';
    end = '-->';
  }
  if (options.trim) {
    return node.content.trim() !== '\n' && node.content.replace(/\s/g, '').length > 0 ? start + node.content.trim() + end : null;
  }
  return text ? start + text + end : null;
};

var setupSelectors = function setupSelectors() {
  var selectorArr = ['tagConvert', 'attrKeyConvert', 'attrValueConvert', 'attrKeyAdd'];
  var selectTypes = [['class', '.'], ['id', '#'], ['data', '[']];

  Object.keys(options).map(function (key) {
    if (selectorArr.indexOf(key) === -1) return;

    Object.keys(options[key]).map(function (attr) {
      // Get the attribute to be checked - i.e. class / id / name
      var attribute = options[key][attr];
      // No selector, just return
      if (!attribute.selector) return;
      selectorCheck[key][attr] = selectorCheck[key][attr] || {};
      // chache selector type
      var isArr = Array.isArray(attribute.selector);
      // check that is has a value to return
      if (isArr) {
        if (!options[key][attr].value) return;
        selectorCheck[key][attr].value = options[key][attr].value;
      } else if (!attribute.selector[select].value) return;

      Object.keys(attribute.selector).map(function (select) {
        // Selector tags - i.e. input.class / button#primary / select[td-select]
        var tags = isArr && attribute.selector[select] || select;
        // split all tags if more then 1
        var allTags = tags.split(',');
        // loop tags and split on selector type - i.e. class / id / name
        allTags.map(function (tag) {
          var props = {};
          var el = void 0;
          var hasSelectors = [];
          // Loop selector types and add to select checker
          selectTypes.map(function (type) {
            if (tag.indexOf(type[1]) !== -1) {
              var split = tag.split(type[1]);
              props[type[0]] = split[1].replace(']', '');
              el = split[0];
              hasSelectors.push(true);
            }
          });
          if (hasSelectors.indexOf(true) !== -1) {
            selectorCheck[key][attr][el] = props;
            if (!isArr) selectorCheck[key][attr][el].value = attribute.selector[select].value;
          } else {
            selectorCheck[key][attr][tag] = '*';
            if (!isArr) selectorCheck[key][attr][tag].value = attribute.selector[select].value;
          }
        });
      });
    });
  });
};

var formatFS = exports.formatFS = function formatFS(nodes, _options) {
  var rootFS = Object.assign({}, options.root, _options.root);
  Object.assign(options, _options);
  setupSelectors(options);

  console.log(selectorCheck);

  attrArrEmpty = Object.keys(options.attrKeyAdd).length === 0;
  if (options.tagConvert[rootFS[0]]) {
    rootFS = tagConvert({
      action: options.tagConvert[rootFS[0]],
      block: rootFS,
      value: rootFS[0],
      node: rootFS,
      children: nodes,
      nodes: nodes
    });
  }
  rootFS[1] = formatAttributes({
    attributes: rootFS[1],
    node: rootFS,
    children: nodes,
    nodes: nodes
  });
  return addChildren(rootFS, format({
    childs: nodes,
    parent: rootFS
  }));
};
//# sourceMappingURL=format.js.map
