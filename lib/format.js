'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatFS = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _helpers = require('./helpers');

var options = {
  root: {
    0: 'div'
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

var convertBlock = function convertBlock(block, nodes, children) {

  block[0] = selectorCheck.tagConvert[block[0]] ? runAction({
    action: selectorCheck.tagConvert[block[0]],
    node: block,
    key: '$$DOM_TAG_NAME',
    value: block[0],
    nodes: nodes,
    children: children
  }, 'value') : block[0];

  block[1] = _typeof(block[1]) === 'object' ? Object.keys(block[1]).reduce(function (attrs, key) {
    var useKey = selectorCheck.attrKeyConvert[key] ? runAction({
      action: selectorCheck.attrKeyConvert[key],
      node: block,
      value: block[1][key],
      key: key,
      nodes: nodes,
      children: children
    }, 'key') : key;

    if (useKey && block[1][key]) {
      attrs[useKey] = selectorCheck.attrValueConvert[key] ? runAction({
        action: selectorCheck.attrValueConvert[key],
        node: block,
        value: block[1][key],
        key: key,
        nodes: nodes,
        children: children
      }, 'value') : (0, _helpers.unquote)(block[1][key]);
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
  } else {
    var _data = runAction({
      key: '$$DOM_TAG_NAME',
      value: block[0],
      action: action,
      node: node,
      nodes: nodes,
      children: children
    }, 'value');
    if (typeof _data === 'string') block[0] = _data;
    if ((typeof _data === 'undefined' ? 'undefined' : _typeof(_data)) === 'object') {
      block = buildBlock(block, _data, nodes, children);
    }
  }

  return block;
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
  var block = selectorCheck.tagConvert[node.tagName] ? tagConvert({
    action: selectorCheck.tagConvert[node.tagName],
    block: {},
    value: node.tagName,
    node: node,
    nodes: nodes,
    children: children
  }) : { 0: node.tagName

    // Build any of the current attrs
  };var attrs = formatAttributes({
    attributes: node.attributes,
    node: node,
    nodes: nodes,
    children: children
  });

  // current attr data get merge after the data from the node
  // This is because the only way the block will have attrs is if it was tagConverted
  block[1] = Object.assign({}, attrs, block[1]);

  var childs = format({
    childs: node.children,
    parent: block,
    nodes: nodes,
    children: children
  });
  return (0, _helpers.addChildren)(block, childs);
};

var formatAttributes = function formatAttributes(args) {
  var node = args.node,
      nodes = args.nodes,
      children = args.children;
  var attributes = args.attributes;

  attributes = attributes || {};
  var attrs = {};

  var isArray = Array.isArray(attributes);
  Object.keys(attributes).map(function (item) {
    var parts = isArray ? (0, _helpers.splitKeyValue)(attributes[item].trim(), '=') : [item, attributes[item]];

    var key = selectorCheck.attrKeyConvert[parts[0]] ? runAction({
      action: selectorCheck.attrKeyConvert[parts[0]],
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
    if (key) attrs[key] = value || 'true';
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

  return key === 'style' && typeof value === 'string' ? (0, _helpers.convertStyle)((0, _helpers.unquote)(value)) : selectorCheck.attrValueConvert[key] ? runAction({
    action: selectorCheck.attrValueConvert[key],
    value: (0, _helpers.unquote)(value),
    node: node,
    key: key,
    nodes: nodes,
    children: children
  }, 'value') : (0, _helpers.unquote)(value);
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
    case 'string':
      return action || args[def];
    case 'function':

      return action({
        0: node.tagName || node[0],
        1: node.attributes || node[1],
        2: children || node[2]
      }, key, value, nodes, children, options) || args[def];
    case 'object':
      var shouldUpdateValue = false;
      // Get the tag type to be checked
      var tagType = node.tagName || node[0];
      if (!tagType) return args[def];

      // Get the node attrs if there are any
      var nodeAttrs = node.attributes || node[1];
      var attsIsArr = Array.isArray(nodeAttrs);

      // Get the selector to check
      var selector = action[tagType];
      // if none, return the default
      if (!selector) return args[def];

      // Get the update value
      var updateVal = selector.value || action.value;

      // if none, return the default
      if (!updateVal) return args[def];

      // Check if it's an all selector, if it is, set the value
      if (selector.all) shouldUpdateValue = true;else {
        // return the default if it's not a select all and no attrs exist
        if (!nodeAttrs) return args[def];

        // Loop the slector and check if any of the elements attrs match
        Object.keys(selector).map(function (key) {
          // If the updateVaule is already set, stop checking
          if (shouldUpdateValue) return;

          var toCheck = key + '="' + selector[key] + '"';
          if (attsIsArr) {
            shouldUpdateValue = key !== 'data' ? nodeAttrs.indexOf(toCheck) !== -1 : nodeAttrs.reduce(function (isValid, attr) {
              return isValid || (selector[key].indexOf('=') !== -1 ? selector[key] === attr : selector[key] === attr.split('=')[0]);
            }, false);
          } else {
            var useKey = key;
            if (key === 'data') useKey = selector[key].split('=')[0];
            // if nodeAttrs is an object, and the key does not exsits, then return
            if (!nodeAttrs[useKey]) return;
            shouldUpdateValue = selector[key].indexOf('=') !== -1
            // If select as = we are looking for more specific, so
            // build key from nodeAttrs and test it
            ? useKey + '="' + nodeAttrs[useKey] + '"' === selector[key]
            // Otherwise return true, because we know the nodeAttrs has the key
            : true;
          }
        });
      }

      if (shouldUpdateValue) {
        // If we should update, set the update based on type
        if (typeof updateVal === 'string' || (typeof updateVal === 'undefined' ? 'undefined' : _typeof(updateVal)) === 'object') return updateVal;else if (typeof updateVal === 'function') {
          return updateVal({
            0: node.tagName || node[0],
            1: node.attributes || node[1],
            2: children || node[2]
          }, key, value, nodes, children, options) || args[def];
        }
      }
      // If we should not update the elment, return the default
      return args[def];

    default:
      return action || args[def];
  }
};

// ----------- Helpers ----------- //
var addAttribute = function addAttribute(args) {
  var node = args.node,
      attrs = args.attrs,
      nodes = args.nodes,
      children = args.children;


  Object.keys(selectorCheck.attrKeyAdd).map(function (key) {
    var value = runAction({
      action: selectorCheck.attrKeyAdd[key],
      key: key,
      node: node,
      nodes: nodes,
      children: children
    });

    if (value) attrs[key] = value;
  });

  return attrs;
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

var formatFS = exports.formatFS = function formatFS(nodes, _options) {
  var rootFS = Object.assign({}, options.root, _options.root);
  Object.assign(options, _options);
  selectorCheck = (0, _helpers.setupSelectors)(selectorCheck, options);
  attrArrEmpty = Object.keys(options.attrKeyAdd).length === 0;

  if (selectorCheck.tagConvert[rootFS[0]]) {
    rootFS = tagConvert({
      action: selectorCheck.tagConvert[rootFS[0]],
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

  rootFS[2] = Array.isArray(rootFS[2]) ? rootFS[2].map(function (child) {
    return convertBlock(child, nodes, nodes);
  }) : [];

  return (0, _helpers.addChildren)(rootFS, format({
    childs: nodes,
    parent: rootFS
  }));
};
//# sourceMappingURL=format.js.map
