'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.formatAttributes = formatAttributes;
exports.toHTML = toHTML;

var _compat = require('./compat');

var _rev_prop_map = require('./rev_prop_map');

var _rev_prop_map2 = _interopRequireDefault(_rev_prop_map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var options = {
  attrLowerCase: false,
  styleAsCss: false
};

function formatAttributes(attributes, options) {
  var attrString = Object.keys(attributes).reduce(function (attrs, currentKey) {
    var key = currentKey;
    if (options.hasOpts && options.attrLowerCase && _rev_prop_map2.default[currentKey]) key = _rev_prop_map2.default[currentKey];

    var value = attributes[currentKey];
    if (!value) return attrs + ' ' + key;else if (key === 'style' && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
      var styles = '';
      Object.keys(value).map(function (_name) {
        var name = _name;
        if (options.hasOpts && options.styleAsCss) name = _name.split(/(?=[A-Z])/).join('-').toLowerCase();

        styles += name + ':' + value[_name] + ';';
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
    return attrs;
  }, '');

  attrString = typeof attrString === 'string' && attrString.trim() || '';
  return attrString.length ? ' ' + attrString : '';
}

var buildTag = function buildTag(tagName, attributes, children, options) {

  return '<' + tagName + formatAttributes(attributes, options) + '>' + (toHTML(children, options) || '') + '</' + tagName + '>';
};

var buildSelfCloseTag = function buildSelfCloseTag(tagName, attributes, options) {
  var formatted = formatAttributes(attributes, options);
  formatted = formatted.length ? formatted + ' ' : formatted;
  return '<' + tagName + formatted + '/' + '>';
};

function toHTML(tree, _options) {

  options = options.hasOpts ? Object.assign(options, _options) : _options;

  if (typeof tree === 'string') return tree;
  return tree && tree.map(function (node) {
    if (typeof node === 'string') return node;
    if (node.type === 'comment') return '<!--' + node.content + '-->';
    var tagName = node[0];
    var attributes = node[1];
    var children = node[2];
    var isSelfClosing = (0, _compat.arrayIncludes)(options.voidTags, tagName.toLowerCase());
    return isSelfClosing ? buildSelfCloseTag(tagName, attributes, options) : buildTag(tagName, attributes, children, options);
  }).join('');
}

exports.default = { toHTML: toHTML };
//# sourceMappingURL=stringify.js.map
