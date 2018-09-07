let options = {
  root: {
    0: 'div',
    1: {
      class: 'root-node',
    }
  },
  tagConvert: {},
  attrKeyConvert: {},
  attrValueConvert: {},
  trim: false,
  lowerCaseTag: true
}

// ----------- Converters ----------- //
const convertCase = text => {
  let converted = ''
  const text_split = text.split('-')
  if(!text_split.length) return text
  converted += text_split.shift()
  text_split.map(val => {
    converted += val.charAt(0).toUpperCase() + val.slice(1)
  })
  return converted
}

const convertStyle = styles => {
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

const convertBlock = (block, nodes, children) => {
  block[0] = options.tagConvert[block[0]]
    ? runAction(options.tagConvert[block[0]], block, '$$DOM_NODE_NAME', block[0], nodes, children)
    : block[0]

  block[1] = typeof block[1] === 'object'
    ? Object.keys(block[1]).reduce((attrs, key) => {
        let useKey = options.attrKeyConvert[key]
          ? runAction(options.attrKeyConvert[key], block, key, block[1][key], nodes, children)
          : key

        if(useKey && block[1][key]){
          attrs[useKey] = options.attrValueConvert[key]
            ? runAction(options.attrValueConvert[key], block, key, block[1][key], nodes, children)
            : unquote(block[1][key])
        }

        return attrs
      }, {})
    : {}
  
  if(block[2] &&  typeof block[2] !== 'string' && block[2].length){
    block[2] = block[2].map(child => {
      return convertBlock(child, nodes, children)
    })
  }

  return block
}

const tagConvert = (action, block, node, value, nodes, children) => {
  block[0] = options.lowerCaseTag
    ? node.tagName.toLowerCase()
    : node.tagName

  if(typeof action === 'object' && !Array.isArray(action) && action[0]){
    block[0] = action[0]
    block[1] = action[1] || {}
    if(action[2]) block[2] = action[2]
    block = convertBlock(block, nodes, children)
  }
  else block[0] = runAction(action, node, '$$DOM_NODE_NAME', value, nodes, children)

  return block
}

// ----------- Run options methods ----------- //
const runAction = (action, node, key, value, nodes, children) => {
  return typeof action === 'function'
    ? action(node, key, value, nodes, children, options)
    : action
}

// ----------- Formatters ----------- //
const format = (childs, parent, nodes, children) => {
  return childs
    ? childs.reduce((children, node) => {
        nodes = nodes || childs
        const child = node.type === 'text' || node.type === 'comment'
          ? filterFS(node, parent)
          : formatNode(node, childs, nodes, children)
        child && children.push(child)
        return children
      }, [])
    : []
}

const formatNode = (node, nodes, children) => {

  const block = options.tagConvert[node.tagName]
    ? tagConvert(options.tagConvert[node.tagName], {}, node, node.tagName, nodes, children)
    : { 0: node.tagName }
  
  const attrs = formatAttributes(node, node.attributes, nodes, children)
  block[1] = Object.assign({}, attrs, block[1])

  const childs = format(node.children, block, nodes, children)
  return addChildren(block, childs)
}

const formatAttributes = (node, attributes, nodes, children) => {
  const attrs = {}
  
  attributes && attributes.map(attribute => {
    const parts = splitKeyValue(attribute.trim(), '=')
    const key = options.attrKeyConvert && options.attrKeyConvert[parts[0]]
      ? runAction(options.attrKeyConvert[parts[0]], node, key, parts[1], nodes, children)
      : parts[0]

    const value = typeof parts[1] === 'string'
      ? formatValue(node, parts[0], parts[1], nodes, children)
      : null
    if(key && value) attrs[key] = value
  })
  return attrs
}

const formatValue = (node, key, value, nodes, children) => {
  return key === 'style' && typeof value === 'string'
    ? convertStyle(unquote(value))
    : options.attrValueConvert[key]
      ? runAction(options.attrValueConvert[key], node, key, unquote(value), nodes, children)
      : unquote(value)
}

// ----------- Helpers ----------- //
const addChildren = (block, childs) => {
  const addChilds = childs.length === 1 && typeof childs[0] === 'string'
    ? childs[0]
    : childs.length && childs || null

  if(addChilds) {
    if(!block[2]) block[2] = addChilds
    else if(Array.isArray(block[2])) block[2] = block[2].concat(addChilds)
    else block[2] = [block[2]].concat(addChilds)
  }
  return block
}

const splitKeyValue = (str, sep) => {
  const idx = str.indexOf(sep)
  if (idx === -1) return [str]
  return [str.slice(0, idx), str.slice(idx + sep.length)]
}

const unquote = str => {
  const car = str.charAt(0)
  const end = str.length - 1
  const isQuoteStart = car === '"' || car === "'"
  if (isQuoteStart && car === str.charAt(end)) {
    return str.slice(1, end)
  }
  return str
}

const filterFS = (node) => {
  let start = ''
  let end = ''
  let text = node.content
  if (node.type === 'comment') {
    start = '<!--'
    end = '-->'
  }
  if (options.trim) {
    return node.content.trim() !== '\n' && node.content.replace(/\s/g, '').length > 0
      ? start + node.content.trim() + end
      : null
  }
  return text
    ? start + text + end
    : null
}

export const formatFS = (nodes, _options) => {
  Object.assign(options, _options)
  const rootFS = convertBlock(Object.assign({}, options.root), nodes)
  const children = format(nodes, rootFS)

  return addChildren(rootFS, children)
}