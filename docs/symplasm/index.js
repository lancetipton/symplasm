var __defProp = Object.defineProperty
var __getOwnPropDesc = Object.getOwnPropertyDescriptor
var __getOwnPropNames = Object.getOwnPropertyNames
var __hasOwnProp = Object.prototype.hasOwnProperty
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true })
}
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === 'object') || typeof from === 'function') {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        })
  }
  return to
}
var __toCommonJS = mod =>
  __copyProps(__defProp({}, '__esModule', { value: true }), mod)

// src/index.js
var src_exports = {}
__export(src_exports, {
  parse: () => parse2,
  parseDefaults: () => parseDefaults,
  stringify: () => stringify,
})
module.exports = __toCommonJS(src_exports)

// src/compat.js
function startsWith(str, searchString, position) {
  return str.substr(position || 0, searchString.length) === searchString
}
function endsWith(str, searchString, position) {
  const index = (position || str.length) - searchString.length
  const lastIndex = str.lastIndexOf(searchString, index)
  return lastIndex !== -1 && lastIndex === index
}
function stringIncludes(str, searchString, position) {
  return str.indexOf(searchString, position || 0) !== -1
}
function isRealNaN(x) {
  return typeof x === 'number' && isNaN(x)
}
function arrayIncludes(array, searchElement, position) {
  const len = array.length
  if (len === 0) return false
  const lookupIndex = position | 0
  const isNaNElement = isRealNaN(searchElement)
  let searchIndex = lookupIndex >= 0 ? lookupIndex : len + lookupIndex
  while (searchIndex < len) {
    const element = array[searchIndex++]
    if (element === searchElement) return true
    if (isNaNElement && isRealNaN(element)) return true
  }
  return false
}

// src/lexer.js
function feedPosition(position, str, len) {
  const start = position.index
  const end = (position.index = start + len)
  for (let i = start; i < end; i++) {
    const char = str.charAt(i)
    if (char === '\n') {
      position.line++
      position.column = 0
    } else {
      position.column++
    }
  }
}
function jumpPosition(position, str, end) {
  const len = end - position.index
  return feedPosition(position, str, len)
}
function makeInitialPosition() {
  return {
    index: 0,
    column: 0,
    line: 0,
  }
}
function copyPosition(position) {
  return {
    index: position.index,
    line: position.line,
    column: position.column,
  }
}
function lexer(str, options3) {
  const state = {
    str,
    options: options3,
    position: makeInitialPosition(),
    tokens: [],
  }
  lex(state)
  return state.tokens
}
function lex(state) {
  const {
    str,
    options: { childlessTags: childlessTags2 },
  } = state
  const len = str.length
  while (state.position.index < len) {
    const start = state.position.index
    lexText(state)
    if (state.position.index === start) {
      const isComment = startsWith(str, '!--', start + 1)
      if (isComment) {
        lexComment(state)
      } else {
        const tagName = lexTag(state)
        const safeTag = tagName.toLowerCase()
        if (arrayIncludes(childlessTags2, safeTag)) {
          lexSkipTag(tagName, state)
        }
      }
    }
  }
}
var alphanumeric = /[A-Za-z0-9]/
function findTextEnd(str, index) {
  while (true) {
    const textEnd = str.indexOf('<', index)
    if (textEnd === -1) {
      return textEnd
    }
    const char = str.charAt(textEnd + 1)
    if (char === '/' || char === '!' || alphanumeric.test(char)) {
      return textEnd
    }
    index = textEnd + 1
  }
}
function lexText(state) {
  const type = 'text'
  const { str, position } = state
  let textEnd = findTextEnd(str, position.index)
  if (textEnd === position.index) return
  if (textEnd === -1) {
    textEnd = str.length
  }
  const start = copyPosition(position)
  const content = str.slice(position.index, textEnd)
  jumpPosition(position, str, textEnd)
  const end = copyPosition(position)
  state.tokens.push({ type, content, position: { start, end } })
}
function lexComment(state) {
  const { str, position } = state
  const start = copyPosition(position)
  feedPosition(position, str, 4)
  let contentEnd = str.indexOf('-->', position.index)
  let commentEnd = contentEnd + 3
  if (contentEnd === -1) {
    contentEnd = commentEnd = str.length
  }
  const content = str.slice(position.index, contentEnd)
  jumpPosition(position, str, commentEnd)
  state.tokens.push({
    type: 'comment',
    content,
    position: {
      start,
      end: copyPosition(position),
    },
  })
}
function lexTag(state) {
  const { str, position } = state
  {
    const secondChar = str.charAt(position.index + 1)
    const close = secondChar === '/'
    const start = copyPosition(position)
    feedPosition(position, str, close ? 2 : 1)
    state.tokens.push({ type: 'tag-start', close, position: { start } })
  }
  const tagName = lexTagName(state)
  lexTagAttributes(state)
  {
    const firstChar = str.charAt(position.index)
    const close = firstChar === '/'
    feedPosition(position, str, close ? 2 : 1)
    const end = copyPosition(position)
    state.tokens.push({ type: 'tag-end', close, position: { end } })
  }
  return tagName
}
var whitespace = /\s/
function isWhitespaceChar(char) {
  return whitespace.test(char)
}
function lexTagName(state) {
  const { str, position } = state
  const len = str.length
  let start = position.index
  while (start < len) {
    const char = str.charAt(start)
    const isTagChar = !(isWhitespaceChar(char) || char === '/' || char === '>')
    if (isTagChar) break
    start++
  }
  let end = start + 1
  while (end < len) {
    const char = str.charAt(end)
    const isTagChar = !(isWhitespaceChar(char) || char === '/' || char === '>')
    if (!isTagChar) break
    end++
  }
  jumpPosition(position, str, end)
  const tagName = str.slice(start, end)
  state.tokens.push({
    type: 'tag',
    content: tagName,
  })
  return tagName
}
function lexTagAttributes(state) {
  const { str, position, tokens } = state
  let cursor = position.index
  let quote = null
  let wordBegin = cursor
  const words = []
  const len = str.length
  while (cursor < len) {
    const char = str.charAt(cursor)
    if (quote) {
      const isQuoteEnd = char === quote
      if (isQuoteEnd) {
        quote = null
      }
      cursor++
      continue
    }
    const isTagEnd = char === '/' || char === '>'
    if (isTagEnd) {
      if (cursor !== wordBegin) {
        words.push(str.slice(wordBegin, cursor))
      }
      break
    }
    const isWordEnd = isWhitespaceChar(char)
    if (isWordEnd) {
      if (cursor !== wordBegin) {
        words.push(str.slice(wordBegin, cursor))
      }
      wordBegin = cursor + 1
      cursor++
      continue
    }
    const isQuoteStart = char === "'" || char === '"'
    if (isQuoteStart) {
      quote = char
      cursor++
      continue
    }
    cursor++
  }
  jumpPosition(position, str, cursor)
  const wLen = words.length
  const type = 'attribute'
  for (let i = 0; i < wLen; i++) {
    const word = words[i]
    const isNotPair = word.indexOf('=') === -1
    if (isNotPair) {
      const secondWord = words[i + 1]
      if (secondWord && startsWith(secondWord, '=')) {
        if (secondWord.length > 1) {
          const newWord = word + secondWord
          tokens.push({ type, content: newWord })
          i += 1
          continue
        }
        const thirdWord = words[i + 2]
        i += 1
        if (thirdWord) {
          const newWord = word + '=' + thirdWord
          tokens.push({ type, content: newWord })
          i += 1
          continue
        }
      }
    }
    if (endsWith(word, '=')) {
      const secondWord = words[i + 1]
      if (secondWord && !stringIncludes(secondWord, '=')) {
        const newWord2 = word + secondWord
        tokens.push({ type, content: newWord2 })
        i += 1
        continue
      }
      const newWord = word.slice(0, -1)
      tokens.push({ type, content: newWord })
      continue
    }
    tokens.push({ type, content: word })
  }
}
var push = [].push
function lexSkipTag(tagName, state) {
  const { str, position, tokens } = state
  const safeTagName = tagName.toLowerCase()
  const len = str.length
  let index = position.index
  while (index < len) {
    const nextTag = str.indexOf('</', index)
    if (nextTag === -1) {
      lexText(state)
      break
    }
    const tagStartPosition = copyPosition(position)
    jumpPosition(tagStartPosition, str, nextTag)
    const tagState = { str, position: tagStartPosition, tokens: [] }
    const name = lexTag(tagState)
    if (safeTagName !== name.toLowerCase()) {
      index = tagState.position.index
      continue
    }
    if (nextTag !== position.index) {
      const textStart = copyPosition(position)
      jumpPosition(position, str, nextTag)
      tokens.push({
        type: 'text',
        content: str.slice(textStart.index, nextTag),
        position: {
          start: textStart,
          end: copyPosition(position),
        },
      })
    }
    push.apply(tokens, tagState.tokens)
    jumpPosition(position, str, tagState.position.index)
    break
  }
}

// src/helpers.js
var selectTypes = [
  ['class', '.'],
  ['id', '#'],
  ['data', '['],
]
var buildElSelectors = (selCheck, selAttr, key, attr) => {
  let elSelect = selAttr && selAttr.selector
  if (key !== 'tagConvert') {
    if (typeof selAttr === 'string' || typeof selAttr === 'function') {
      selCheck[key][attr] = selAttr
      return
    }
    if (selAttr && !elSelect && Object.keys(selAttr).length) {
      elSelect = {}
      Object.keys(selAttr).map(key2 => {
        elSelect[key2] = selAttr[key2]
      })
    }
    if (!elSelect) {
      if (selAttr === null) selCheck[key][attr] = null
      return
    }
    selCheck[key][attr] = selCheck[key][attr] || {}
  } else {
    elSelect = {}
    elSelect[attr] = selAttr
  }
  return elSelect
}
var findSelector = (hasSelectors, elSelectors, select, props, tag) => {
  let el
  selectTypes.map(type => {
    if (tag.indexOf(type[1]) !== -1) {
      const split = tag.split(type[1])
      if (type[0] === 'data') {
        const dataSplit = split[1].split('=')
        const key = clean(dataSplit[0].replace(']', ''))
        const dataKey =
          (dataSplit[1] && clean(dataSplit[1].replace(']', ''))) || ''
        props[key] = { ...props[key], [dataKey]: elSelectors[select] }
      } else {
        props[type[0]] = {
          ...props[type[0]],
          [clean(split[1])]: elSelectors[select],
        }
      }
      el = clean(split[0])
      if (
        el.indexOf('.') !== -1 ||
        el.indexOf('#') !== -1 ||
        el.indexOf('[') !== -1
      ) {
        console.warn(
          `Error: "${el}" is not formatted correctly. It contains one of ". # ["`
        )
      }
      hasSelectors.push(true)
    }
  })
  return el
}
var setupSelectors = (selCheck, options3) => {
  const selectorArr = Object.keys(selCheck)
  Object.keys(options3).map(key => {
    if (selectorArr.indexOf(key) === -1) return
    const props = {}
    Object.keys(options3[key]).map(attr => {
      const attribute = options3[key][attr]
      let elSelectors = buildElSelectors(selCheck, attribute, key, attr)
      if (!elSelectors) return
      const isArr = Array.isArray(elSelectors)
      if (isArr) {
        if (!options3[key][attr].value) return
        selCheck[key][attr].value = options3[key][attr].value
      }
      Object.keys(elSelectors).map(select => {
        const tags = (isArr && elSelectors[select]) || select
        const allTags = tags.split(',')
        allTags.map(_tag => {
          const tag = clean(_tag)
          const hasSelectors = []
          let el = findSelector(hasSelectors, elSelectors, select, props, tag)
          if (hasSelectors.indexOf(true) !== -1) {
            const loc = key !== 'tagConvert' ? attr : el
            selCheck[key] = selCheck[key] || {}
            selCheck[key][loc] = selCheck[key][loc] || {}
            selCheck[key][loc][el] = { ...selCheck[key][loc][el], ...props }
          } else {
            const loc = key !== 'tagConvert' ? attr : tag
            selCheck[key] = selCheck[key] || {}
            selCheck[key][loc] = selCheck[key][loc] || {}
            selCheck[key][loc][tag] = selCheck[key][loc][tag] || {}
            selCheck[key][loc][tag].all = elSelectors[select]
          }
        })
      })
    })
  })
  return selCheck
}
var addChildren = (block, childs) => {
  const addChilds =
    childs.length === 1 && typeof childs[0] === 'string'
      ? childs[0]
      : (childs.length && childs) || null
  if (addChilds) {
    if (!block[2]) block[2] = addChilds
    else if (Array.isArray(block[2])) block[2] = block[2].concat(addChilds)
    else block[2] = [block[2]].concat(addChilds)
  }
  return block
}
var convertCase = text => {
  let converted = ''
  const text_split = text.split('-')
  if (!text_split.length) return text
  converted += text_split.shift()
  text_split.map(val => {
    converted += val.charAt(0).toUpperCase() + val.slice(1)
  })
  return converted
}
var convertStyle = styles => {
  const valObj = {}
  const val_split = styles.trim().split(';')
  Array.isArray(val_split) &&
    val_split[0].trim() !== '' &&
    val_split.map(item => {
      if (item.indexOf(':') !== -1) {
        const item_split = item.split(':')
        if (Array.isArray(item_split) && item_split.length === 2) {
          if (item_split[0].trim() !== '' && item_split[1].trim() !== '') {
            valObj[convertCase(item_split[0].trim())] = item_split[1].trim()
          }
        }
      }
    })
  return valObj
}
var splitKeyValue = (str, sep) => {
  const idx = str.indexOf(sep)
  if (idx === -1) return [str]
  return [str.slice(0, idx), str.slice(idx + sep.length)]
}
var clean = str => {
  return (str && unquote(str.trim()).trim()) || ''
}
var unquote = str => {
  const car = str.charAt(0)
  const end = str.length - 1
  const isQuoteStart = car === '"' || car === "'"
  if (isQuoteStart && car === str.charAt(end)) {
    return str.slice(1, end)
  }
  return str
}

// src/parser.js
function parser(tokens, options3) {
  const root = { tagName: null, children: [] }
  const state = { tokens, options: options3, cursor: 0, stack: [root] }
  parse(state)
  return root.children
}
function hasTerminalParent(tagName, stack, terminals) {
  const tagParents = terminals[tagName]
  if (tagParents) {
    let currentIndex = stack.length - 1
    while (currentIndex >= 0) {
      const parentTagName = stack[currentIndex].tagName
      if (parentTagName === tagName) {
        break
      }
      if (arrayIncludes(tagParents, parentTagName)) {
        return true
      }
      currentIndex--
    }
  }
  return false
}
function parse(state) {
  const { tokens, options: options3 } = state
  let { stack } = state
  let nodes = stack[stack.length - 1].children
  const len = tokens.length
  let { cursor } = state
  while (cursor < len) {
    const token = tokens[cursor]
    if (token.type !== 'tag-start') {
      nodes.push(token)
      cursor++
      continue
    }
    const tagToken = tokens[++cursor]
    cursor++
    const tagName = tagToken.content.toLowerCase()
    if (token.close) {
      let index = stack.length
      let didRewind = false
      while (--index > -1) {
        if (stack[index].tagName === tagName) {
          stack.splice(index)
          didRewind = true
          break
        }
      }
      while (cursor < len) {
        const endToken = tokens[cursor]
        if (endToken.type !== 'tag-end') break
        cursor++
      }
      if (didRewind) {
        break
      } else {
        continue
      }
    }
    const isClosingTag = arrayIncludes(options3.closingTags, tagName)
    let shouldRewindToAutoClose = isClosingTag
    if (shouldRewindToAutoClose) {
      const { closingTagAncestorBreakers: terminals } = options3
      shouldRewindToAutoClose = !hasTerminalParent(tagName, stack, terminals)
    }
    if (shouldRewindToAutoClose) {
      let currentIndex = stack.length - 1
      while (currentIndex > 0) {
        if (tagName === stack[currentIndex].tagName) {
          stack = stack.slice(0, currentIndex)
          const previousIndex = currentIndex - 1
          nodes = stack[previousIndex].children
          break
        }
        currentIndex = currentIndex - 1
      }
    }
    let attributes = []
    let attrToken
    while (cursor < len) {
      attrToken = tokens[cursor]
      if (attrToken.type === 'tag-end') break
      attributes.push(attrToken.content)
      cursor++
    }
    cursor++
    const children = []
    attributes =
      Array.isArray(attributes) && attributes.length
        ? attributes.reduce((attrs, attr) => {
            const parts = splitKeyValue(attr, '=')
            attrs[parts[0]] = (parts[1] && unquote(parts[1])) || ''
            return attrs
          }, {})
        : {}
    nodes.push({
      0: tagToken.content,
      1: attributes,
      2: children,
    })
    const hasChildren = !(
      attrToken.close || arrayIncludes(options3.voidTags, tagName)
    )
    if (hasChildren) {
      stack.push({ tagName, children })
      const innerState = { tokens, options: options3, cursor, stack }
      parse(innerState)
      cursor = innerState.cursor
    }
  }
  state.cursor = cursor
}

// src/prop_map.js
var propMap = {
  // HTML
  accept: 'accept',
  acceptcharset: 'acceptCharset',
  'accept-charset': 'acceptCharset',
  accesskey: 'accessKey',
  action: 'action',
  allowfullscreen: 'allowFullScreen',
  alt: 'alt',
  as: 'as',
  async: 'async',
  autocapitalize: 'autoCapitalize',
  autocomplete: 'autoComplete',
  autocorrect: 'autoCorrect',
  autofocus: 'autoFocus',
  autoplay: 'autoPlay',
  autosave: 'autoSave',
  capture: 'capture',
  cellpadding: 'cellPadding',
  cellspacing: 'cellSpacing',
  challenge: 'challenge',
  charset: 'charSet',
  checked: 'checked',
  children: 'children',
  cite: 'cite',
  class: 'className',
  classid: 'classID',
  classname: 'className',
  cols: 'cols',
  colspan: 'colSpan',
  content: 'content',
  contenteditable: 'contentEditable',
  contextmenu: 'contextMenu',
  controls: 'controls',
  controlslist: 'controlsList',
  coords: 'coords',
  crossorigin: 'crossOrigin',
  dangerouslysetinnerhtml: 'dangerouslySetInnerHTML',
  data: 'data',
  datetime: 'dateTime',
  default: 'default',
  defaultchecked: 'defaultChecked',
  defaultvalue: 'defaultValue',
  defer: 'defer',
  dir: 'dir',
  disabled: 'disabled',
  download: 'download',
  draggable: 'draggable',
  enctype: 'encType',
  for: 'htmlFor',
  form: 'form',
  formmethod: 'formMethod',
  formaction: 'formAction',
  formenctype: 'formEncType',
  formnovalidate: 'formNoValidate',
  formtarget: 'formTarget',
  frameborder: 'frameBorder',
  headers: 'headers',
  height: 'height',
  hidden: 'hidden',
  high: 'high',
  href: 'href',
  hreflang: 'hrefLang',
  htmlfor: 'htmlFor',
  httpequiv: 'httpEquiv',
  'http-equiv': 'httpEquiv',
  icon: 'icon',
  id: 'id',
  innerhtml: 'innerHTML',
  inputmode: 'inputMode',
  integrity: 'integrity',
  is: 'is',
  itemid: 'itemID',
  itemprop: 'itemProp',
  itemref: 'itemRef',
  itemscope: 'itemScope',
  itemtype: 'itemType',
  keyparams: 'keyParams',
  keytype: 'keyType',
  kind: 'kind',
  label: 'label',
  lang: 'lang',
  list: 'list',
  loop: 'loop',
  low: 'low',
  manifest: 'manifest',
  marginwidth: 'marginWidth',
  marginheight: 'marginHeight',
  max: 'max',
  maxlength: 'maxLength',
  media: 'media',
  mediagroup: 'mediaGroup',
  method: 'method',
  min: 'min',
  minlength: 'minLength',
  multiple: 'multiple',
  muted: 'muted',
  name: 'name',
  nomodule: 'noModule',
  nonce: 'nonce',
  novalidate: 'noValidate',
  open: 'open',
  optimum: 'optimum',
  pattern: 'pattern',
  placeholder: 'placeholder',
  playsinline: 'playsInline',
  poster: 'poster',
  preload: 'preload',
  profile: 'profile',
  radiogroup: 'radioGroup',
  readonly: 'readOnly',
  referrerpolicy: 'referrerPolicy',
  rel: 'rel',
  required: 'required',
  reversed: 'reversed',
  role: 'role',
  rows: 'rows',
  rowspan: 'rowSpan',
  sandbox: 'sandbox',
  scope: 'scope',
  scoped: 'scoped',
  scrolling: 'scrolling',
  seamless: 'seamless',
  selected: 'selected',
  shape: 'shape',
  size: 'size',
  sizes: 'sizes',
  span: 'span',
  spellcheck: 'spellCheck',
  src: 'src',
  srcdoc: 'srcDoc',
  srclang: 'srcLang',
  srcset: 'srcSet',
  start: 'start',
  step: 'step',
  style: 'style',
  summary: 'summary',
  tabindex: 'tabIndex',
  target: 'target',
  title: 'title',
  type: 'type',
  usemap: 'useMap',
  value: 'value',
  width: 'width',
  wmode: 'wmode',
  wrap: 'wrap',
  // SVG
  about: 'about',
  accentheight: 'accentHeight',
  'accent-height': 'accentHeight',
  accumulate: 'accumulate',
  additive: 'additive',
  alignmentbaseline: 'alignmentBaseline',
  'alignment-baseline': 'alignmentBaseline',
  allowreorder: 'allowReorder',
  alphabetic: 'alphabetic',
  amplitude: 'amplitude',
  arabicform: 'arabicForm',
  'arabic-form': 'arabicForm',
  ascent: 'ascent',
  attributename: 'attributeName',
  attributetype: 'attributeType',
  autoreverse: 'autoReverse',
  azimuth: 'azimuth',
  basefrequency: 'baseFrequency',
  baselineshift: 'baselineShift',
  'baseline-shift': 'baselineShift',
  baseprofile: 'baseProfile',
  bbox: 'bbox',
  begin: 'begin',
  bias: 'bias',
  by: 'by',
  calcmode: 'calcMode',
  capheight: 'capHeight',
  'cap-height': 'capHeight',
  clip: 'clip',
  clippath: 'clipPath',
  'clip-path': 'clipPath',
  clippathunits: 'clipPathUnits',
  cliprule: 'clipRule',
  'clip-rule': 'clipRule',
  color: 'color',
  colorinterpolation: 'colorInterpolation',
  'color-interpolation': 'colorInterpolation',
  colorinterpolationfilters: 'colorInterpolationFilters',
  'color-interpolation-filters': 'colorInterpolationFilters',
  colorprofile: 'colorProfile',
  'color-profile': 'colorProfile',
  colorrendering: 'colorRendering',
  'color-rendering': 'colorRendering',
  contentscripttype: 'contentScriptType',
  contentstyletype: 'contentStyleType',
  cursor: 'cursor',
  cx: 'cx',
  cy: 'cy',
  d: 'd',
  datatype: 'datatype',
  decelerate: 'decelerate',
  descent: 'descent',
  diffuseconstant: 'diffuseConstant',
  direction: 'direction',
  display: 'display',
  divisor: 'divisor',
  dominantbaseline: 'dominantBaseline',
  'dominant-baseline': 'dominantBaseline',
  dur: 'dur',
  dx: 'dx',
  dy: 'dy',
  edgemode: 'edgeMode',
  elevation: 'elevation',
  enablebackground: 'enableBackground',
  'enable-background': 'enableBackground',
  end: 'end',
  exponent: 'exponent',
  externalresourcesrequired: 'externalResourcesRequired',
  fill: 'fill',
  fillopacity: 'fillOpacity',
  'fill-opacity': 'fillOpacity',
  fillrule: 'fillRule',
  'fill-rule': 'fillRule',
  filter: 'filter',
  filterres: 'filterRes',
  filterunits: 'filterUnits',
  floodopacity: 'floodOpacity',
  'flood-opacity': 'floodOpacity',
  floodcolor: 'floodColor',
  'flood-color': 'floodColor',
  focusable: 'focusable',
  fontfamily: 'fontFamily',
  'font-family': 'fontFamily',
  fontsize: 'fontSize',
  'font-size': 'fontSize',
  fontsizeadjust: 'fontSizeAdjust',
  'font-size-adjust': 'fontSizeAdjust',
  fontstretch: 'fontStretch',
  'font-stretch': 'fontStretch',
  fontstyle: 'fontStyle',
  'font-style': 'fontStyle',
  fontvariant: 'fontVariant',
  'font-variant': 'fontVariant',
  fontweight: 'fontWeight',
  'font-weight': 'fontWeight',
  format: 'format',
  from: 'from',
  fx: 'fx',
  fy: 'fy',
  g1: 'g1',
  g2: 'g2',
  glyphname: 'glyphName',
  'glyph-name': 'glyphName',
  glyphorientationhorizontal: 'glyphOrientationHorizontal',
  'glyph-orientation-horizontal': 'glyphOrientationHorizontal',
  glyphorientationvertical: 'glyphOrientationVertical',
  'glyph-orientation-vertical': 'glyphOrientationVertical',
  glyphref: 'glyphRef',
  gradienttransform: 'gradientTransform',
  gradientunits: 'gradientUnits',
  hanging: 'hanging',
  horizadvx: 'horizAdvX',
  'horiz-adv-x': 'horizAdvX',
  horizoriginx: 'horizOriginX',
  'horiz-origin-x': 'horizOriginX',
  ideographic: 'ideographic',
  imagerendering: 'imageRendering',
  'image-rendering': 'imageRendering',
  in2: 'in2',
  in: 'in',
  inlist: 'inlist',
  intercept: 'intercept',
  k1: 'k1',
  k2: 'k2',
  k3: 'k3',
  k4: 'k4',
  k: 'k',
  kernelmatrix: 'kernelMatrix',
  kernelunitlength: 'kernelUnitLength',
  kerning: 'kerning',
  keypoints: 'keyPoints',
  keysplines: 'keySplines',
  keytimes: 'keyTimes',
  lengthadjust: 'lengthAdjust',
  letterspacing: 'letterSpacing',
  'letter-spacing': 'letterSpacing',
  lightingcolor: 'lightingColor',
  'lighting-color': 'lightingColor',
  limitingconeangle: 'limitingConeAngle',
  local: 'local',
  markerend: 'markerEnd',
  'marker-end': 'markerEnd',
  markerheight: 'markerHeight',
  markermid: 'markerMid',
  'marker-mid': 'markerMid',
  markerstart: 'markerStart',
  'marker-start': 'markerStart',
  markerunits: 'markerUnits',
  markerwidth: 'markerWidth',
  mask: 'mask',
  maskcontentunits: 'maskContentUnits',
  maskunits: 'maskUnits',
  mathematical: 'mathematical',
  mode: 'mode',
  numoctaves: 'numOctaves',
  offset: 'offset',
  opacity: 'opacity',
  operator: 'operator',
  order: 'order',
  orient: 'orient',
  orientation: 'orientation',
  origin: 'origin',
  overflow: 'overflow',
  overlineposition: 'overlinePosition',
  'overline-position': 'overlinePosition',
  overlinethickness: 'overlineThickness',
  'overline-thickness': 'overlineThickness',
  paintorder: 'paintOrder',
  'paint-order': 'paintOrder',
  panose1: 'panose1',
  'panose-1': 'panose1',
  pathlength: 'pathLength',
  patterncontentunits: 'patternContentUnits',
  patterntransform: 'patternTransform',
  patternunits: 'patternUnits',
  pointerevents: 'pointerEvents',
  'pointer-events': 'pointerEvents',
  points: 'points',
  pointsatx: 'pointsAtX',
  pointsaty: 'pointsAtY',
  pointsatz: 'pointsAtZ',
  prefix: 'prefix',
  preservealpha: 'preserveAlpha',
  preserveaspectratio: 'preserveAspectRatio',
  primitiveunits: 'primitiveUnits',
  property: 'property',
  r: 'r',
  radius: 'radius',
  refx: 'refX',
  refy: 'refY',
  renderingintent: 'renderingIntent',
  'rendering-intent': 'renderingIntent',
  repeatcount: 'repeatCount',
  repeatdur: 'repeatDur',
  requiredextensions: 'requiredExtensions',
  requiredfeatures: 'requiredFeatures',
  resource: 'resource',
  restart: 'restart',
  result: 'result',
  results: 'results',
  rotate: 'rotate',
  rx: 'rx',
  ry: 'ry',
  scale: 'scale',
  security: 'security',
  seed: 'seed',
  shaperendering: 'shapeRendering',
  'shape-rendering': 'shapeRendering',
  slope: 'slope',
  spacing: 'spacing',
  specularconstant: 'specularConstant',
  specularexponent: 'specularExponent',
  speed: 'speed',
  spreadmethod: 'spreadMethod',
  startoffset: 'startOffset',
  stddeviation: 'stdDeviation',
  stemh: 'stemh',
  stemv: 'stemv',
  stitchtiles: 'stitchTiles',
  stopcolor: 'stopColor',
  'stop-color': 'stopColor',
  stopopacity: 'stopOpacity',
  'stop-opacity': 'stopOpacity',
  strikethroughposition: 'strikethroughPosition',
  'strikethrough-position': 'strikethroughPosition',
  strikethroughthickness: 'strikethroughThickness',
  'strikethrough-thickness': 'strikethroughThickness',
  string: 'string',
  stroke: 'stroke',
  strokedasharray: 'strokeDasharray',
  'stroke-dasharray': 'strokeDasharray',
  strokedashoffset: 'strokeDashoffset',
  'stroke-dashoffset': 'strokeDashoffset',
  strokelinecap: 'strokeLinecap',
  'stroke-linecap': 'strokeLinecap',
  strokelinejoin: 'strokeLinejoin',
  'stroke-linejoin': 'strokeLinejoin',
  strokemiterlimit: 'strokeMiterlimit',
  'stroke-miterlimit': 'strokeMiterlimit',
  strokewidth: 'strokeWidth',
  'stroke-width': 'strokeWidth',
  strokeopacity: 'strokeOpacity',
  'stroke-opacity': 'strokeOpacity',
  suppresscontenteditablewarning: 'suppressContentEditableWarning',
  suppresshydrationwarning: 'suppressHydrationWarning',
  surfacescale: 'surfaceScale',
  systemlanguage: 'systemLanguage',
  tablevalues: 'tableValues',
  targetx: 'targetX',
  targety: 'targetY',
  textanchor: 'textAnchor',
  'text-anchor': 'textAnchor',
  textdecoration: 'textDecoration',
  'text-decoration': 'textDecoration',
  textlength: 'textLength',
  textrendering: 'textRendering',
  'text-rendering': 'textRendering',
  to: 'to',
  transform: 'transform',
  typeof: 'typeof',
  u1: 'u1',
  u2: 'u2',
  underlineposition: 'underlinePosition',
  'underline-position': 'underlinePosition',
  underlinethickness: 'underlineThickness',
  'underline-thickness': 'underlineThickness',
  unicode: 'unicode',
  unicodebidi: 'unicodeBidi',
  'unicode-bidi': 'unicodeBidi',
  unicoderange: 'unicodeRange',
  'unicode-range': 'unicodeRange',
  unitsperem: 'unitsPerEm',
  'units-per-em': 'unitsPerEm',
  unselectable: 'unselectable',
  valphabetic: 'vAlphabetic',
  'v-alphabetic': 'vAlphabetic',
  values: 'values',
  vectoreffect: 'vectorEffect',
  'vector-effect': 'vectorEffect',
  version: 'version',
  vertadvy: 'vertAdvY',
  'vert-adv-y': 'vertAdvY',
  vertoriginx: 'vertOriginX',
  'vert-origin-x': 'vertOriginX',
  vertoriginy: 'vertOriginY',
  'vert-origin-y': 'vertOriginY',
  vhanging: 'vHanging',
  'v-hanging': 'vHanging',
  videographic: 'vIdeographic',
  'v-ideographic': 'vIdeographic',
  viewbox: 'viewBox',
  viewtarget: 'viewTarget',
  visibility: 'visibility',
  vmathematical: 'vMathematical',
  'v-mathematical': 'vMathematical',
  vocab: 'vocab',
  widths: 'widths',
  wordspacing: 'wordSpacing',
  'word-spacing': 'wordSpacing',
  writingmode: 'writingMode',
  'writing-mode': 'writingMode',
  x1: 'x1',
  x2: 'x2',
  x: 'x',
  xchannelselector: 'xChannelSelector',
  xheight: 'xHeight',
  'x-height': 'xHeight',
  xlinkactuate: 'xlinkActuate',
  'xlink:actuate': 'xlinkActuate',
  xlinkarcrole: 'xlinkArcrole',
  'xlink:arcrole': 'xlinkArcrole',
  xlinkhref: 'xlinkHref',
  'xlink:href': 'xlinkHref',
  xlinkrole: 'xlinkRole',
  'xlink:role': 'xlinkRole',
  xlinkshow: 'xlinkShow',
  'xlink:show': 'xlinkShow',
  xlinktitle: 'xlinkTitle',
  'xlink:title': 'xlinkTitle',
  xlinktype: 'xlinkType',
  'xlink:type': 'xlinkType',
  xmlbase: 'xmlBase',
  'xml:base': 'xmlBase',
  xmllang: 'xmlLang',
  'xml:lang': 'xmlLang',
  xmlns: 'xmlns',
  'xml:space': 'xmlSpace',
  xmlnsxlink: 'xmlnsXlink',
  'xmlns:xlink': 'xmlnsXlink',
  xmlspace: 'xmlSpace',
  y1: 'y1',
  y2: 'y2',
  y: 'y',
  ychannelselector: 'yChannelSelector',
  z: 'z',
  zoomandpan: 'zoomAndPan',
}
var revPropMap = Object.entries(propMap).reduce(
  (obj, [key, value]) => ({ ...obj, [value]: key }),
  {}
)

// src/stringify.js
var options = {
  attrLowerCase: false,
  styleAsCss: false,
}
function formatAttributes(attributes, options3) {
  let attrString = Object.keys(attributes).reduce((attrs, currentKey) => {
    let key = currentKey
    if (options3.hasOpts && options3.attrLowerCase && revPropMap[currentKey])
      key = revPropMap[currentKey]
    let value = attributes[currentKey]
    if (!value) return `${attrs} ${key}`
    else if (key === 'style' && typeof value === 'object') {
      let styles = ''
      Object.keys(value).map(_name => {
        let name = _name
        if (options3.hasOpts && options3.styleAsCss)
          name = _name
            .split(/(?=[A-Z])/)
            .join('-')
            .toLowerCase()
        styles += `${name}:${value[_name]};`
      })
      const quoteEscape = styles.indexOf("'") !== -1
      const quote = quoteEscape ? '"' : "'"
      return `${attrs} ${key}=${quote}${styles}${quote}`
    }
    if (typeof value === 'boolean') value = `${value}`
    if (typeof value === 'string') {
      const quoteEscape = value.indexOf("'") !== -1
      const quote = quoteEscape ? '"' : "'"
      return `${attrs} ${key}=${quote}${value}${quote}`
    }
    return attrs
  }, '')
  attrString = (typeof attrString === 'string' && attrString.trim()) || ''
  return attrString.length ? ' ' + attrString : ''
}
var buildTag = (tagName, attributes, children, options3) => {
  return `<${tagName}${formatAttributes(attributes, options3)}>${
    toHTML(children, options3) || ''
  }</${tagName}>`
}
var buildSelfCloseTag = (tagName, attributes, options3) => {
  let formatted = formatAttributes(attributes, options3)
  formatted = formatted.length ? formatted + ' ' : formatted
  return `<${tagName}${formatted}${'/'}>`
}
function toHTML(tree, _options) {
  options = options.hasOpts ? Object.assign(options, _options) : _options
  if (typeof tree === 'string') return tree
  return (
    tree &&
    tree
      .map(node => {
        if (typeof node === 'string') return node
        if (node.type === 'comment') return `<!--${node.content}-->`
        const tagName = node[0]
        const attributes = node[1]
        const children = node[2]
        const tagCheck = (!children && tagName.toLowerCase()) || tagName
        const isSelfClosing = arrayIncludes(options.voidTags, tagCheck)
        return isSelfClosing
          ? buildSelfCloseTag(tagName, attributes, options)
          : buildTag(tagName, attributes, children, options)
      })
      .join('')
  )
}

// src/format.js
var options2 = {
  root: {
    0: 'div',
  },
  tagConvert: {},
  attrKeyConvert: {},
  attrValueConvert: {},
  attrKeyAdd: {},
  attrCamelCase: false,
  trim: false,
  lowerCaseTag: true,
  comments: true,
}
var selectorCheck = {
  tagConvert: {},
  attrKeyConvert: {},
  attrValueConvert: {},
  attrKeyAdd: {},
}
var attrArrEmpty = true
var domTagAction = '$$DOM_TAG_NAME'
var convertBlock = (block, parent, nodes, children, tree) => {
  const data = selectorCheck.tagConvert[block[0]]
    ? runAction(
        {
          action: selectorCheck.tagConvert[block[0]],
          node: block,
          key: domTagAction,
          value: block[0],
          nodes,
          children,
        },
        'value'
      )
    : block[0]
  if (typeof data === 'string') block[0] = data
  if (typeof data === 'object') block = data
  block[1] =
    typeof block[1] === 'object'
      ? Object.keys(block[1]).reduce((attrs, key) => {
          let useKey = selectorCheck.attrKeyConvert[key]
            ? runAction(
                {
                  action: selectorCheck.attrKeyConvert[key],
                  node: block,
                  value: block[1][key],
                  key,
                  nodes,
                  children,
                },
                'key'
              )
            : key
          useKey = (options2.attrCamelCase && propMap[useKey]) || useKey
          if (useKey && block[1][key]) {
            attrs[useKey] = selectorCheck.attrValueConvert[key]
              ? runAction(
                  {
                    action: selectorCheck.attrValueConvert[key],
                    node: block,
                    value: block[1][key],
                    key,
                    nodes,
                    children,
                  },
                  'value'
                )
              : typeof block[1][key] === 'string'
              ? unquote(block[1][key])
              : block[1][key]
          }
          return attrs
        }, {})
      : {}
  if (block[2] && typeof block[2] !== 'string' && block[2].length) {
    block[2] = block[2].map(child => {
      return convertBlock(child, block, nodes, children, tree)
    })
  }
  return (tree && allElementsCB(block, parent, tree)) || block
}
var buildBlock = (org, added, nodes, children, parent) => {
  org[0] = added[0]
  org[1] = { ...org[1], ...added[1] }
  if (added[2]) org[2] = added[2]
  return convertBlock(org, parent, nodes, children)
}
var tagConvert = ({ action, node, value, nodes, children, parent, block }) => {
  const tagName = node[0]
  if (!tagName) return block
  block[0] = options2.lowerCaseTag ? tagName.toLowerCase() : tagName
  if (typeof action === 'function') {
    let data = runAction(
      {
        key: domTagAction,
        value: block[0],
        action,
        node,
        nodes,
        children,
      },
      'value'
    )
    if (!data) return block
    if (typeof data === 'string') data = { 0: data }
    if (typeof data === 'object')
      block = buildBlock(block, data, nodes, children, parent)
  } else if (
    typeof action === 'object' &&
    !Array.isArray(action) &&
    action[0]
  ) {
    block = buildBlock(block, action, nodes, children, parent)
  } else {
    const data = runAction(
      {
        key: domTagAction,
        value: block[0],
        action,
        node,
        nodes,
        children,
      },
      'value'
    )
    if (typeof data === 'string') block[0] = data
    if (typeof data === 'object') {
      block = buildBlock(block, data, nodes, children, parent)
    }
  }
  return block
}
var format = ({ parent, childs, nodes, tree, ...args }) => {
  return childs
    ? childs.reduce((children, node) => {
        nodes = nodes || childs
        const child =
          node.type === 'text' || node.type === 'comment'
            ? filterFS(node, parent)
            : formatNode({
                node,
                childs,
                nodes,
                children,
                tree,
                parent,
              })
        child && children.push(child)
        return children
      }, [])
    : []
}
var formatNode = ({ node, nodes, children, tree, parent }) => {
  const block = selectorCheck.tagConvert[node[0]]
    ? tagConvert({
        action: selectorCheck.tagConvert[node[0]],
        block: {},
        value: node[0],
        node,
        nodes,
        children,
        parent,
      })
    : { 0: node[0] }
  const attrs = formatAttributes2({
    attributes: node[1],
    node,
    nodes,
    children,
  })
  block[1] = { ...attrs, ...block[1] }
  return allElementsCB(
    // Add the children to the block
    addChildren(
      block,
      // Format the children before adding to the block
      format({
        tree,
        childs: node[2],
        parent: block,
        nodes,
        children,
      })
    ),
    parent,
    tree
  )
}
var formatAttributes2 = args => {
  const { node, nodes, children } = args
  let { attributes } = args
  attributes = attributes || {}
  const attrs = {}
  Object.keys(attributes).map(item => {
    const parts = [item, attributes[item]]
    if (selectorCheck.attrKeyConvert[parts[0]] === null) return
    let key = selectorCheck.attrKeyConvert[parts[0]]
      ? runAction(
          {
            action: selectorCheck.attrKeyConvert[parts[0]],
            key: parts[0],
            value: parts[1],
            node,
            nodes,
            children,
          },
          'key'
        )
      : parts[0]
    key = (options2.attrCamelCase && propMap[key]) || key
    const value =
      typeof parts[1] === 'string' || typeof parts[1] === 'object'
        ? formatValue({
            key: parts[0],
            value: parts[1],
            node,
            nodes,
            children,
          })
        : null
    if (key) {
      if ((key === 'className' || key === 'class') && value === '')
        attrs[key] = ''
      if (key === 'id' && !value) return
      attrs[key] = value || value === false ? value : true
    }
  })
  if (attrArrEmpty) return attrs
  return addAttribute({
    node,
    attrs,
    nodes,
    children,
  })
}
var formatValue = args => {
  const { node, key, value, nodes, children } = args
  const updatedVal =
    key === 'style' && typeof value === 'string'
      ? convertStyle(unquote(value))
      : selectorCheck.attrValueConvert[key]
      ? runAction(
          {
            action: selectorCheck.attrValueConvert[key],
            value: unquote(value),
            node,
            key,
            nodes,
            children,
          },
          'value'
        )
      : (typeof value === 'string' && unquote(value)) || value
  if (updatedVal === 'true') return true
  if (updatedVal === 'false') return false
  return updatedVal
}
var runAction = (args, def) => {
  const { action, node, key, value, nodes, children } = args
  switch (typeof action) {
    case 'string':
      return action || args[def]
    case 'function':
      return (
        action(
          {
            0: node[0],
            1: node[1],
            2: node[2],
          },
          key,
          value,
          nodes,
          children,
          options2
        ) || args[def]
      )
    case 'object':
      let updateVal
      const tagType = node[0]
      if (!tagType) return args[def]
      const nodeAttrs = node[1]
      if (!nodeAttrs) return args[def]
      const selector = action[tagType]
      if (!selector) return args[def]
      updateVal = selector.all || null
      const selectKeys = Object.keys(selector)
      if (
        // Check if there are more keys then just the all key
        (selector.all && selectKeys.length > 1) || // Check if there is no all key, but there are other keys
        (!selector.all && selectKeys.length >= 1)
      ) {
        if (!nodeAttrs) return args[def]
        let setSelector
        Object.keys(selector).map(key2 => {
          if (setSelector || (!nodeAttrs[key2] && nodeAttrs[key2] !== ''))
            return
          if (
            nodeAttrs[key2] === 'true' &&
            !selector[key2][nodeAttrs[key2]] &&
            selector[key2]['']
          ) {
            updateVal = selector[key2]['']
            setSelector = true
          } else if (selector[key2][nodeAttrs[key2]]) {
            updateVal = selector[key2][nodeAttrs[key2]]
            setSelector = true
          }
        })
      }
      if (updateVal) {
        if (typeof updateVal === 'string' || typeof updateVal === 'object')
          return updateVal
        else if (typeof updateVal === 'function') {
          return (
            updateVal(
              {
                0: node[0],
                1: node[1],
                2: node[2],
              },
              key,
              value,
              nodes,
              children,
              options2
            ) || args[def]
          )
        }
      }
      return args[def]
    default:
      return action || args[def]
  }
}
var addAttribute = ({ node, attrs, nodes, children }) => {
  Object.keys(selectorCheck.attrKeyAdd).map(key => {
    const value = runAction({
      action: selectorCheck.attrKeyAdd[key],
      key,
      node,
      nodes,
      children,
    })
    if (value) attrs[key] = value
  })
  return attrs
}
var filterFS = node => {
  let start = ''
  let end = ''
  let text = node.content
  if (node.type === 'comment') {
    if (!options2.comments) return null
    start = '<!--'
    end = '-->'
  }
  if (options2.trim) {
    return node.content.trim() !== '\n' &&
      node.content.replace(/\s/g, '').length > 0
      ? start + node.content.trim() + end
      : null
  }
  return text ? start + text + end : null
}
var allElementsCB = (block, parent, tree) => {
  return typeof options2.allElements === 'function'
    ? options2.allElements(block, parent, tree) || block
    : block
}
var formatFS = (nodes, _options) => {
  let rootFS = { ...options2.root, ..._options.root }
  options2 = { ...options2, ..._options }
  selectorCheck = setupSelectors(selectorCheck, options2)
  attrArrEmpty = Object.keys(options2.attrKeyAdd).length === 0
  if (selectorCheck.tagConvert[rootFS[0]]) {
    rootFS = tagConvert({
      action: selectorCheck.tagConvert[rootFS[0]],
      block: rootFS,
      value: rootFS[0],
      node: rootFS,
      children: nodes,
      nodes,
      rootFS,
    })
  }
  rootFS[1] = formatAttributes2({
    attributes: rootFS[1],
    node: rootFS,
    children: nodes,
    nodes,
  })
  rootFS[2] = Array.isArray(rootFS[2])
    ? rootFS[2].map(child => {
        return convertBlock(child, rootFS, nodes, nodes, rootFS)
      })
    : []
  const builtRoot = addChildren(
    rootFS,
    format({
      childs: nodes,
      parent: rootFS,
      tree: rootFS,
    })
  )
  return allElementsCB(builtRoot, builtRoot, builtRoot)
}

// src/tags.js
var childlessTags = ['style', 'script', 'template']
var closingTags = [
  'html',
  'head',
  'body',
  'p',
  'dt',
  'dd',
  'li',
  'option',
  'thead',
  'th',
  'tbody',
  'tr',
  'td',
  'tfoot',
  'colgroup',
]
var closingTagAncestorBreakers = {
  li: ['ul', 'ol', 'menu'],
  dt: ['dl'],
  dd: ['dl'],
  tbody: ['table'],
  thead: ['table'],
  tfoot: ['table'],
  tr: ['table'],
  td: ['table'],
}
var voidTags = [
  '!doctype',
  'area',
  'base',
  'br',
  'col',
  'command',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]

// src/symplasm.ts
var parseDefaults = {
  voidTags,
  closingTags,
  childlessTags,
  hasOpts: false,
  includePositions: false,
  closingTagAncestorBreakers,
}
function parse2(str) {
  let options3 = Object.assign({ ...parseDefaults }, arguments[1])
  const tokens = lexer(str, options3)
  const nodes = parser(tokens, options3)
  return formatFS(nodes, options3)
}
function stringify(ast) {
  let options3 = { ...parseDefaults }
  options3.hasOpts = false
  if (arguments[1]) {
    options3 = Object.assign({ ...parseDefaults }, arguments[1])
    options3.hasOpts = true
  }
  return Array.isArray(ast) ? toHTML(ast, options3) : toHTML([ast], options3)
}
;(() => {
  if (Boolean(typeof window !== 'undefined')) {
    window.Symplasm = { parse: parse2, stringify, parseDefaults }
  }
})()
// Annotate the CommonJS export names for ESM import in node:
0 &&
  (module.exports = {
    parse,
    parseDefaults,
    stringify,
  })
//# sourceMappingURL=index.js.map
