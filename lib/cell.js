'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatCell = formatCell;
exports.formatAttributes = formatAttributes;
exports.format = format;
exports.filterCell = filterCell;
exports.mapCell = mapCell;

var _format = require('./format');

var options = {
  root: {
    type: 'div',
    class: 'cell-root',
    active: true
  },
  trim: false,
  lowerCaseTag: true
};

function formatCell(nodes, _options) {
  Object.assign(options, _options);
  var rootCell = {
    $type: options.root.type,
    class: options.root.class,
    $cell: options.root.active
  };
  rootCell['$components'] = format(nodes, rootCell);
  return rootCell;
}

function formatAttributes(attributes, cell) {
  attributes.map(function (attribute) {
    var parts = (0, _format.splitHead)(attribute.trim(), '=');
    var key = parts[0];
    var value = typeof parts[1] === 'string' ? formatValue(parts[0], parts[1]) : null;
    cell[key] = value;
  });
  return cell;
}

function formatValue(key, value) {
  if (key.indexOf('_') === 0 && options.convertAttrs) {
    try {
      return JSON.parse((0, _format.unquote)(value));
    } catch (e) {}
  }
  return (0, _format.unquote)(value);
}

function filterCell(node, parent) {
  var start = '';
  var end = '';
  var text = node.content;
  if (node.type === 'comment') {
    start = '<!--';
    end = '-->';
  }
  if (options.trim) {
    if (node.content.trim() !== '\n' && node.content.replace(/\s/g, '').length > 0) {
      text = node.content.trim();
    } else {
      text = null;
    }
  }
  if (text) {
    parent.$html = parent.$html || '';
    parent.$html += start + text + end;
  }
  return false;
}

function format(nodes, parent) {
  return nodes.filter(function (node) {
    if (node.type === 'text' || node.type === 'comment') {
      return filterCell(node, parent);
    }
    return node;
  }).map(function (node) {
    return mapCell(node);
  });
}

function filterCell(node, parent) {
  var start = '';
  var end = '';
  var text = node.content;
  if (node.type === 'comment') {
    start = '<!--';
    end = '-->';
  }
  if (options.trim) {
    if (node.content.trim() !== '\n' && node.content.replace(/\s/g, '').length > 0) {
      text = node.content.trim();
    } else {
      text = null;
    }
  }
  if (text) {
    parent.$html = parent.$html || '';
    parent.$html += start + text + end;
  }
  return false;
}

function mapCell(node) {
  var cell = {};
  cell.$type = options.lowerCaseTag ? node.tagName.toLowerCase() : node.tagName;
  formatAttributes(node.attributes, cell);
  var childComponents = format(node.children, cell);
  if (childComponents.length > 0) {
    cell.$components = childComponents;
  }
  return cell;
}
//# sourceMappingURL=cell.js.map
