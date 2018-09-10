'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.formatAttributes = formatAttributes;
exports.toHTML = toHTML;

var _compat = require('./compat');

function formatAttributes(attributes) {
  return Object.keys(attributes).reduce(function (attrs, key) {
    var value = attributes[key];
    if (!value) return attrs + ' ' + key;else if (key === 'style' && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
      var styles = '';
      Object.keys(value).map(function (name) {
        styles += name + ':' + value[name] + ';';
      });
      var quoteEscape = styles.indexOf('\'') !== -1;
      var quote = quoteEscape ? '"' : '\'';
      return attrs + ' ' + key + '=' + quote + styles + quote;
    }
    if (typeof value === 'boolean') value = '' + value;

    if (typeof value === 'string') {
      var _quoteEscape = value.indexOf('\'') !== -1;
      var _quote = _quoteEscape ? '"' : '\'';
      return attrs + ' ' + key + '=' + _quote + value + _quote;
    }
  }, '');
}

function toHTML(tree, options) {
  if (typeof tree === 'string') return tree;
  return tree && tree.map(function (node) {
    if (typeof node === 'string') return node;
    if (node.type === 'comment') return '<!--' + node.content + '-->';
    var tagName = node[0];
    var attributes = node[1];
    var children = node[2];
    var isSelfClosing = (0, _compat.arrayIncludes)(options.voidTags, tagName.toLowerCase());
    return isSelfClosing ? '<' + tagName + formatAttributes(attributes) + '>' : '<' + tagName + formatAttributes(attributes) + '>' + (toHTML(children, options) || '') + '</' + tagName + '>';
  }).join('');
}

exports.default = { toHTML: toHTML };
//# sourceMappingURL=stringify.js.map
