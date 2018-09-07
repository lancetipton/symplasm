(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.symplasm = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startsWith = startsWith;
exports.endsWith = endsWith;
exports.stringIncludes = stringIncludes;
exports.isRealNaN = isRealNaN;
exports.arrayIncludes = arrayIncludes;
/*
  We don't want to include babel-polyfill in our project.
    - Library authors should be using babel-runtime for non-global polyfilling
    - Adding babel-polyfill/-runtime increases bundle size significantly

  We will include our polyfill instance methods as regular functions.
*/

function startsWith(str, searchString, position) {
  return str.substr(position || 0, searchString.length) === searchString;
}

function endsWith(str, searchString, position) {
  var index = (position || str.length) - searchString.length;
  var lastIndex = str.lastIndexOf(searchString, index);
  return lastIndex !== -1 && lastIndex === index;
}

function stringIncludes(str, searchString, position) {
  return str.indexOf(searchString, position || 0) !== -1;
}

function isRealNaN(x) {
  return typeof x === 'number' && isNaN(x);
}

function arrayIncludes(array, searchElement, position) {
  var len = array.length;
  if (len === 0) return false;

  var lookupIndex = position | 0;
  var isNaNElement = isRealNaN(searchElement);
  var searchIndex = lookupIndex >= 0 ? lookupIndex : len + lookupIndex;
  while (searchIndex < len) {
    var element = array[searchIndex++];
    if (element === searchElement) return true;
    if (isNaNElement && isRealNaN(element)) return true;
  }

  return false;
}

},{}],2:[function(require,module,exports){
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
  trim: false,
  lowerCaseTag: true

  // ----------- Converters ----------- //
};var convertCase = function convertCase(text) {
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
  block[0] = options.tagConvert[block[0]] ? runAction(options.tagConvert[block[0]], block, '$$DOM_NODE_NAME', block[0], nodes, children) : block[0];

  block[1] = _typeof(block[1]) === 'object' ? Object.keys(block[1]).reduce(function (attrs, key) {
    var useKey = options.attrKeyConvert[key] ? runAction(options.attrKeyConvert[key], block, key, block[1][key], nodes, children) : key;

    if (useKey && block[1][key]) {
      attrs[useKey] = options.attrValueConvert[key] ? runAction(options.attrValueConvert[key], block, key, block[1][key], nodes, children) : unquote(block[1][key]);
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

var tagConvert = function tagConvert(action, block, node, value, nodes, children) {
  block[0] = options.lowerCaseTag ? node.tagName.toLowerCase() : node.tagName;

  if ((typeof action === 'undefined' ? 'undefined' : _typeof(action)) === 'object' && !Array.isArray(action) && action[0]) {
    block[0] = action[0];
    block[1] = action[1] || {};
    if (action[2]) block[2] = action[2];
    block = convertBlock(block, nodes, children);
  } else block[0] = runAction(action, node, '$$DOM_NODE_NAME', value, nodes, children);

  return block;
};

// ----------- Run options methods ----------- //
var runAction = function runAction(action, node, key, value, nodes, children) {
  return typeof action === 'function' ? action(node, key, value, nodes, children, options) : action;
};

// ----------- Formatters ----------- //
var format = function format(childs, parent, nodes, children) {
  return childs ? childs.reduce(function (children, node) {
    nodes = nodes || childs;
    var child = node.type === 'text' || node.type === 'comment' ? filterFS(node, parent) : formatNode(node, childs, nodes, children);
    child && children.push(child);
    return children;
  }, []) : [];
};

var formatNode = function formatNode(node, nodes, children) {

  var block = options.tagConvert[node.tagName] ? tagConvert(options.tagConvert[node.tagName], {}, node, node.tagName, nodes, children) : { 0: node.tagName };

  var attrs = formatAttributes(node, node.attributes, nodes, children);
  block[1] = Object.assign({}, attrs, block[1]);

  var childs = format(node.children, block, nodes, children);
  return addChildren(block, childs);
};

var formatAttributes = function formatAttributes(node, attributes, nodes, children) {
  var attrs = {};

  attributes && attributes.map(function (attribute) {
    var parts = splitKeyValue(attribute.trim(), '=');
    var key = options.attrKeyConvert && options.attrKeyConvert[parts[0]] ? runAction(options.attrKeyConvert[parts[0]], node, key, parts[1], nodes, children) : parts[0];

    var value = typeof parts[1] === 'string' ? formatValue(node, parts[0], parts[1], nodes, children) : null;
    if (key && value) attrs[key] = value;
  });
  return attrs;
};

var formatValue = function formatValue(node, key, value, nodes, children) {
  return key === 'style' && typeof value === 'string' ? convertStyle(unquote(value)) : options.attrValueConvert[key] ? runAction(options.attrValueConvert[key], node, key, unquote(value), nodes, children) : unquote(value);
};

// ----------- Helpers ----------- //
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

var formatFS = exports.formatFS = function formatFS(nodes, _options) {
  Object.assign(options, _options);
  var rootFS = convertBlock(Object.assign({}, options.root), nodes);
  var children = format(nodes, rootFS);

  return addChildren(rootFS, children);
};

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseDefaults = undefined;
exports.parse = parse;
exports.stringify = stringify;

var _lexer = require('./lexer');

var _lexer2 = _interopRequireDefault(_lexer);

var _parser = require('./parser');

var _parser2 = _interopRequireDefault(_parser);

var _stringify = require('./stringify');

var _format = require('./format');

var _tags = require('./tags');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parseDefaults = exports.parseDefaults = {
  voidTags: _tags.voidTags,
  closingTags: _tags.closingTags,
  childlessTags: _tags.childlessTags,
  closingTagAncestorBreakers: _tags.closingTagAncestorBreakers,
  includePositions: false
};

function parse(str) {
  var options = Object.assign(parseDefaults, arguments[1]);
  var tokens = (0, _lexer2.default)(str, options);
  var nodes = (0, _parser2.default)(tokens, options);
  return (0, _format.formatFS)(nodes, options);
}

function stringify(ast) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : parseDefaults;

  return Array.isArray(ast) ? (0, _stringify.toHTML)(ast, options) : (0, _stringify.toHTML)([ast], options);
}

},{"./format":2,"./lexer":4,"./parser":5,"./stringify":6,"./tags":7}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.feedPosition = feedPosition;
exports.jumpPosition = jumpPosition;
exports.makeInitialPosition = makeInitialPosition;
exports.copyPosition = copyPosition;
exports.default = lexer;
exports.lex = lex;
exports.findTextEnd = findTextEnd;
exports.lexText = lexText;
exports.lexComment = lexComment;
exports.lexTag = lexTag;
exports.isWhitespaceChar = isWhitespaceChar;
exports.lexTagName = lexTagName;
exports.lexTagAttributes = lexTagAttributes;
exports.lexSkipTag = lexSkipTag;

var _compat = require('./compat');

function feedPosition(position, str, len) {
  var start = position.index;
  var end = position.index = start + len;
  for (var i = start; i < end; i++) {
    var char = str.charAt(i);
    if (char === '\n') {
      position.line++;
      position.column = 0;
    } else {
      position.column++;
    }
  }
}

function jumpPosition(position, str, end) {
  var len = end - position.index;
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
  var state = {
    str: str,
    options: options,
    position: makeInitialPosition(),
    tokens: []
  };
  lex(state);
  return state.tokens;
}

function lex(state) {
  var str = state.str,
      childlessTags = state.options.childlessTags;

  var len = str.length;
  while (state.position.index < len) {
    var start = state.position.index;
    lexText(state);
    if (state.position.index === start) {
      var isComment = (0, _compat.startsWith)(str, '!--', start + 1);
      if (isComment) {
        lexComment(state);
      } else {
        var tagName = lexTag(state);
        var safeTag = tagName.toLowerCase();
        if ((0, _compat.arrayIncludes)(childlessTags, safeTag)) {
          lexSkipTag(tagName, state);
        }
      }
    }
  }
}

var alphanumeric = /[A-Za-z0-9]/;
function findTextEnd(str, index) {
  while (true) {
    var textEnd = str.indexOf('<', index);
    if (textEnd === -1) {
      return textEnd;
    }
    var char = str.charAt(textEnd + 1);
    if (char === '/' || char === '!' || alphanumeric.test(char)) {
      return textEnd;
    }
    index = textEnd + 1;
  }
}

function lexText(state) {
  var type = 'text';
  var str = state.str,
      position = state.position;

  var textEnd = findTextEnd(str, position.index);
  if (textEnd === position.index) return;
  if (textEnd === -1) {
    textEnd = str.length;
  }

  var start = copyPosition(position);
  var content = str.slice(position.index, textEnd);
  jumpPosition(position, str, textEnd);
  var end = copyPosition(position);
  state.tokens.push({ type: type, content: content, position: { start: start, end: end } });
}

function lexComment(state) {
  var str = state.str,
      position = state.position;

  var start = copyPosition(position);
  feedPosition(position, str, 4); // "<!--".length
  var contentEnd = str.indexOf('-->', position.index);
  var commentEnd = contentEnd + 3; // "-->".length
  if (contentEnd === -1) {
    contentEnd = commentEnd = str.length;
  }

  var content = str.slice(position.index, contentEnd);
  jumpPosition(position, str, commentEnd);
  state.tokens.push({
    type: 'comment',
    content: content,
    position: {
      start: start,
      end: copyPosition(position)
    }
  });
}

function lexTag(state) {
  var str = state.str,
      position = state.position;

  {
    var secondChar = str.charAt(position.index + 1);
    var close = secondChar === '/';
    var start = copyPosition(position);
    feedPosition(position, str, close ? 2 : 1);
    state.tokens.push({ type: 'tag-start', close: close, position: { start: start } });
  }
  var tagName = lexTagName(state);
  lexTagAttributes(state);
  {
    var firstChar = str.charAt(position.index);
    var _close = firstChar === '/';
    feedPosition(position, str, _close ? 2 : 1);
    var end = copyPosition(position);
    state.tokens.push({ type: 'tag-end', close: _close, position: { end: end } });
  }
  return tagName;
}

// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-white-space
var whitespace = /\s/;
function isWhitespaceChar(char) {
  return whitespace.test(char);
}

function lexTagName(state) {
  var str = state.str,
      position = state.position;

  var len = str.length;
  var start = position.index;
  while (start < len) {
    var char = str.charAt(start);
    var isTagChar = !(isWhitespaceChar(char) || char === '/' || char === '>');
    if (isTagChar) break;
    start++;
  }

  var end = start + 1;
  while (end < len) {
    var _char = str.charAt(end);
    var _isTagChar = !(isWhitespaceChar(_char) || _char === '/' || _char === '>');
    if (!_isTagChar) break;
    end++;
  }

  jumpPosition(position, str, end);
  var tagName = str.slice(start, end);
  state.tokens.push({
    type: 'tag',
    content: tagName
  });
  return tagName;
}

function lexTagAttributes(state) {
  var str = state.str,
      position = state.position,
      tokens = state.tokens;

  var cursor = position.index;
  var quote = null; // null, single-, or double-quote
  var wordBegin = cursor; // index of word start
  var words = []; // "key", "key=value", "key='value'", etc
  var len = str.length;
  while (cursor < len) {
    var char = str.charAt(cursor);
    if (quote) {
      var isQuoteEnd = char === quote;
      if (isQuoteEnd) {
        quote = null;
      }
      cursor++;
      continue;
    }

    var isTagEnd = char === '/' || char === '>';
    if (isTagEnd) {
      if (cursor !== wordBegin) {
        words.push(str.slice(wordBegin, cursor));
      }
      break;
    }

    var isWordEnd = isWhitespaceChar(char);
    if (isWordEnd) {
      if (cursor !== wordBegin) {
        words.push(str.slice(wordBegin, cursor));
      }
      wordBegin = cursor + 1;
      cursor++;
      continue;
    }

    var isQuoteStart = char === '\'' || char === '"';
    if (isQuoteStart) {
      quote = char;
      cursor++;
      continue;
    }

    cursor++;
  }
  jumpPosition(position, str, cursor);

  var wLen = words.length;
  var type = 'attribute';
  for (var i = 0; i < wLen; i++) {
    var word = words[i];
    var isNotPair = word.indexOf('=') === -1;
    if (isNotPair) {
      var secondWord = words[i + 1];
      if (secondWord && (0, _compat.startsWith)(secondWord, '=')) {
        if (secondWord.length > 1) {
          var newWord = word + secondWord;
          tokens.push({ type: type, content: newWord });
          i += 1;
          continue;
        }
        var thirdWord = words[i + 2];
        i += 1;
        if (thirdWord) {
          var _newWord = word + '=' + thirdWord;
          tokens.push({ type: type, content: _newWord });
          i += 1;
          continue;
        }
      }
    }
    if ((0, _compat.endsWith)(word, '=')) {
      var _secondWord = words[i + 1];
      if (_secondWord && !(0, _compat.stringIncludes)(_secondWord, '=')) {
        var _newWord3 = word + _secondWord;
        tokens.push({ type: type, content: _newWord3 });
        i += 1;
        continue;
      }

      var _newWord2 = word.slice(0, -1);
      tokens.push({ type: type, content: _newWord2 });
      continue;
    }

    tokens.push({ type: type, content: word });
  }
}

var push = [].push;

function lexSkipTag(tagName, state) {
  var str = state.str,
      position = state.position,
      tokens = state.tokens;

  var safeTagName = tagName.toLowerCase();
  var len = str.length;
  var index = position.index;
  while (index < len) {
    var nextTag = str.indexOf('</', index);
    if (nextTag === -1) {
      lexText(state);
      break;
    }

    var tagStartPosition = copyPosition(position);
    jumpPosition(tagStartPosition, str, nextTag);
    var tagState = { str: str, position: tagStartPosition, tokens: [] };
    var name = lexTag(tagState);
    if (safeTagName !== name.toLowerCase()) {
      index = tagState.position.index;
      continue;
    }

    if (nextTag !== position.index) {
      var textStart = copyPosition(position);
      jumpPosition(position, str, nextTag);
      tokens.push({
        type: 'text',
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

},{"./compat":1}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parser;
exports.hasTerminalParent = hasTerminalParent;
exports.parse = parse;

var _compat = require('./compat');

function parser(tokens, options) {
  var root = { tagName: null, children: [] };
  var state = { tokens: tokens, options: options, cursor: 0, stack: [root] };
  parse(state);
  return root.children;
}

function hasTerminalParent(tagName, stack, terminals) {
  var tagParents = terminals[tagName];
  if (tagParents) {
    var currentIndex = stack.length - 1;
    while (currentIndex >= 0) {
      var parentTagName = stack[currentIndex].tagName;
      if (parentTagName === tagName) {
        break;
      }
      if ((0, _compat.arrayIncludes)(tagParents, parentTagName)) {
        return true;
      }
      currentIndex--;
    }
  }
  return false;
}

function parse(state) {
  var tokens = state.tokens,
      options = state.options;
  var stack = state.stack;

  var nodes = stack[stack.length - 1].children;
  var len = tokens.length;
  var cursor = state.cursor;

  while (cursor < len) {
    var token = tokens[cursor];
    if (token.type !== 'tag-start') {
      nodes.push(token);
      cursor++;
      continue;
    }

    var tagToken = tokens[++cursor];
    cursor++;
    var tagName = tagToken.content.toLowerCase();
    if (token.close) {
      var index = stack.length;
      var didRewind = false;
      while (--index > -1) {
        if (stack[index].tagName === tagName) {
          stack.splice(index);
          didRewind = true;
          break;
        }
      }
      while (cursor < len) {
        var endToken = tokens[cursor];
        if (endToken.type !== 'tag-end') break;
        cursor++;
      }
      if (didRewind) {
        break;
      } else {
        continue;
      }
    }

    var isClosingTag = (0, _compat.arrayIncludes)(options.closingTags, tagName);
    var shouldRewindToAutoClose = isClosingTag;
    if (shouldRewindToAutoClose) {
      var terminals = options.closingTagAncestorBreakers;

      shouldRewindToAutoClose = !hasTerminalParent(tagName, stack, terminals);
    }

    if (shouldRewindToAutoClose) {
      // rewind the stack to just above the previous
      // closing tag of the same name
      var currentIndex = stack.length - 1;
      while (currentIndex > 0) {
        if (tagName === stack[currentIndex].tagName) {
          stack = stack.slice(0, currentIndex);
          var previousIndex = currentIndex - 1;
          nodes = stack[previousIndex].children;
          break;
        }
        currentIndex = currentIndex - 1;
      }
    }

    var attributes = [];
    var attrToken = void 0;
    while (cursor < len) {
      attrToken = tokens[cursor];
      if (attrToken.type === 'tag-end') break;
      attributes.push(attrToken.content);
      cursor++;
    }

    cursor++;
    var children = [];
    nodes.push({
      type: 'element',
      tagName: tagToken.content,
      attributes: attributes,
      children: children
    });

    var hasChildren = !(attrToken.close || (0, _compat.arrayIncludes)(options.voidTags, tagName));
    if (hasChildren) {
      stack.push({ tagName: tagName, children: children });
      var innerState = { tokens: tokens, options: options, cursor: cursor, stack: stack };
      parse(innerState);
      cursor = innerState.cursor;
    }
  }
  state.cursor = cursor;
}

},{"./compat":1}],6:[function(require,module,exports){
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

    if (typeof value === 'string') {
      var _quoteEscape = value.indexOf('\'') !== -1;
      var _quote = _quoteEscape ? '"' : '\'';
      return attrs + ' ' + key + '=' + _quote + value + _quote;
    }
  }, '');
}

function toHTML(tree, options) {
  if (typeof tree === 'string') return tree;
  console.log('------------------tree------------------');
  console.log(tree);

  return tree && tree.map(function (node) {
    if (typeof node === 'string') return node;
    if (node.type === 'comment') return '<!--' + node.content + '-->';
    var tagName = node[0];
    var attributes = node[1];
    var children = node[2];

    var isSelfClosing = (0, _compat.arrayIncludes)(options.voidTags, tagName.toLowerCase());
    return isSelfClosing ? '<' + tagName + formatAttributes(attributes) + '>' : '<' + tagName + formatAttributes(attributes) + '>' + toHTML(children, options) + '</' + tagName + '>';
  }).join('');
}

exports.default = { toHTML: toHTML };

},{"./compat":1}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
  Tags which contain arbitary non-parsed content
  For example: <script> JavaScript should not be parsed
*/
var childlessTags = exports.childlessTags = ['style', 'script', 'template'];

/*
  Tags which auto-close because they cannot be nested
  For example: <p>Outer<p>Inner is <p>Outer</p><p>Inner</p>
*/
var closingTags = exports.closingTags = ['html', 'head', 'body', 'p', 'dt', 'dd', 'li', 'option', 'thead', 'th', 'tbody', 'tr', 'td', 'tfoot', 'colgroup'];

/*
  Closing tags which have ancestor tags which
  may exist within them which prevent the
  closing tag from auto-closing.
  For example: in <li><ul><li></ul></li>,
  the top-level <li> should not auto-close.
*/
var closingTagAncestorBreakers = exports.closingTagAncestorBreakers = {
  li: ['ul', 'ol', 'menu'],
  dt: ['dl'],
  dd: ['dl'],
  tbody: ['table'],
  thead: ['table'],
  tfoot: ['table'],
  tr: ['table'],
  td: ['table']

  /*
    Tags which do not need the closing tag
    For example: <img> does not need </img>
  */
};var voidTags = exports.voidTags = ['!doctype', 'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

},{}]},{},[3])(3)
});
//# sourceMappingURL=symplasm.js.map
