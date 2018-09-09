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
  attrKeyAdd: {},
  trim: false,
  lowerCaseTag: true
}

let selectorCheck = {
  tagConvert: {},
  attrKeyConvert: {},
  attrValueConvert: {},
  attrKeyAdd: {},
}
let attrArrEmpty = true

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
    ? runAction({
        action: options.tagConvert[block[0]],
        node: block,
        key: '$$DOM_TAG_NAME',
        value: block[0],
        nodes,
        children
      }, 'value')
    : block[0]

  block[1] = typeof block[1] === 'object'
    ? Object.keys(block[1]).reduce((attrs, key) => {
        let useKey = options.attrKeyConvert[key]
          ? runAction({
              action: options.attrKeyConvert[key],
              node: block,
              value: block[1][key],
              key,
              nodes,
              children
            }, 'key')
          : key

        if(useKey && block[1][key]){
          attrs[useKey] = options.attrValueConvert[key]
            ? runAction({
                action: options.attrValueConvert[key],
                node: block,
                value: block[1][key],
                key,
                nodes,
                children
              }, 'value')
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

const buildBlock = (org, added, nodes, children) => {
  org[0] = added[0]
  org[1] = Object.assign({}, org[1], added[1])
  if(added[2]) org[2] = added[2]
  return convertBlock(org, nodes, children)
}

const tagConvert = (args) => {
  const { action, node, value, nodes, children } = args
  let { block } = args
  
  const tagName = node.tagName || node[0]
  if(!tagName) return block
  block[0] = options.lowerCaseTag
    ? tagName.toLowerCase()
    : tagName

  if(typeof action === 'function'){
    let data = runAction({
      key: '$$DOM_TAG_NAME',
      value: block[0],
      action,
      node,
      nodes,
      children
    }, 'value')
    if(!data) return block
    if(typeof data === 'string') data = { 0: data }
    
    if(typeof data === 'object')
      return buildBlock(block, data, nodes, children)
  }
  else if(typeof action === 'object' && !Array.isArray(action) && action[0]){
    return buildBlock(block, action, nodes, children)
  }
  else block[0] = runAction({
    key: '$$DOM_TAG_NAME',
    value: block[0],
    action,
    node,
    nodes,
    children
  }, 'value')

  return block
}

// ----------- Formatters ----------- //
const format = (args) => {
  const { parent, children } = args
  let { childs, nodes, } = args

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
    ? tagConvert({
        action: options.tagConvert[node.tagName],
        block: {},
        value: node.tagName,
        node,
        nodes,
        children
      })
    : { 0: node.tagName }
  
  const attrs = formatAttributes({
    attributes: node.attributes,
    node,
    nodes,
    children
  })
  block[1] = Object.assign({}, block[1], attrs)

  const childs = format({
    childs: node.children,
    parent: block,
    nodes,
    children
  })
  return addChildren(block, childs)
}

const formatAttributes = (args) => {
  const { node, attributes, nodes, children } = args
  const attrs = {}

  const isArray = Array.isArray(attributes)
  Object.keys(attributes).map(item => {
    const parts = isArray
      ? splitKeyValue(attributes[item].trim(), '=')
      : [ item, attributes[item]]

    const key = options.attrKeyConvert && options.attrKeyConvert[parts[0]]
      ? runAction({
        action: options.attrKeyConvert[parts[0]],
        key: parts[0],
        value: parts[1],
        node,
        nodes,
        children
      }, 'key')
      : parts[0]
  
    const value = typeof parts[1] === 'string'
      ? formatValue({
          key: parts[0],
          value: parts[1],
          node,
          nodes,
          children
        })
      : null
    if(key && value) attrs[key] = value
  })
  
  
  if(attrArrEmpty) return attrs
  
  return addAttribute({
    node,
    attrs,
    nodes,
    children
  })
  
}

const formatValue = (args) => {
  const { node, key, value, nodes, children } = args
  return key === 'style' && typeof value === 'string'
    ? convertStyle(unquote(value))
    : options.attrValueConvert[key]
      ? runAction({
          action: options.attrValueConvert[key],
          value: unquote(value),
          node,
          key,
          nodes,
          children
        }, 'value')
      : unquote(value)
}

// ----------- Selector Checks ----------- //

// ----------- Run options methods ----------- //
const runAction = (args, def) => {
  const { action, node, key, value, nodes, children } = args
  console.log('------------------do selector check here------------------');
  switch(typeof action){
    case 'function':
      return action(node, key, value, nodes, children, options) || action
    case 'object':
      const tagType = node.tagName || node[0]
      let updateValue = !action.selector
      // Run default actions if no selector specified
      if(typeof action.selector === 'object'){
        if(Array.isArray(action.selector) && action.selector.indexOf(tagType) !== -1){
          
        }
        
        Object.keys(action.selector).map(key => {
          const actionValue = action.selector[key]
          if(typeof actionValue === 'string'){
            
          }
          if(typeof actionValue === 'object'){
            
          }
        })
      }
      if(updateValue){
        if(!tagType || !action.value) return value
        if(typeof action.value === 'string') return action.value
        if(typeof action.value === 'function')
          return action.value(node, key, value, nodes, children, options)
      }
      
      
      return args[def]
    default:
      return action
  }
}

// ----------- Helpers ----------- //
const addAttribute = (args) => {
  const { node, attrs, nodes, children } = args
  
  Object.keys(options.attrKeyAdd).map(key => {
    const action = options.attrKeyAdd[key]
    let value
    if(typeof action === 'object'){
      if(!action.value) return
      const checkArgs = Object.assign({}, args, { action, key })
      console.log('------------------do selector check here------------------');
      if(checkSelector(checkArgs)){
        value = typeof action.value === 'function'
          ? action.value(
              node,
              key,
              action.value,
              nodes,
              children,
              options,
            )
          : action.value
      }
    }
    else {
      value = runAction({
        action: options.attrKeyAdd[key],
        value: action.value,
        node,
        key,
        nodes,
        children
      })
    }
    if(value) attrs[key] = value
  })

  return attrs
}

// ----------- Selector Checks ----------- //


const checkSelector = (args) => {
  const { action, node, key, value, nodes, children } = args
  const tagType = node.tagName || node[0]
  
  if(action.selector){
    
  }
  // runAction
  // action, node, key, value, nodes, children
  // action.selector && action.selector.indexOf(tagType) === -1
  
  // addAttribute
  // node, attrs, nodes, children
  // !action.selector || action.selector.indexOf(node.tagName) !== -1
}

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

const setupSelectors = () => {
  const selectorArr = ['tagConvert', 'attrKeyConvert', 'attrValueConvert', 'attrKeyAdd']
  const selectTypes = [[ 'class', '.'], [ 'id', '#'], [ 'data', '[']]

  Object.keys(options).map(key => {
    if(selectorArr.indexOf(key) === -1) return
    
    Object.keys(options[key]).map(attr => {
      // Get the attribute to be checked - i.e. class / id / name
      const attribute = options[key][attr]
      // No selector, just return
      if(!attribute.selector) return
      selectorCheck[key][attr] = selectorCheck[key][attr] || {}
      // chache selector type
      const isArr = Array.isArray(attribute.selector)
      // check that is has a value to return
      if(isArr){
        if(!options[key][attr].value) return  
        selectorCheck[key][attr].value = options[key][attr].value
      }
      else if(!attribute.selector[select].value) return
      
      Object.keys(attribute.selector).map(select => {
        // Selector tags - i.e. input.class / button#primary / select[td-select]
        const tags = isArr && attribute.selector[select] || select
        // split all tags if more then 1
        const allTags = tags.split(',')
        // loop tags and split on selector type - i.e. class / id / name
        allTags.map(tag => {
          const props = {}
          let el
          const hasSelectors = []
          // Loop selector types and add to select checker
          selectTypes.map(type => {
            if(tag.indexOf(type[1]) !== -1){
              const split = tag.split(type[1])
              props[type[0]] = split[1].replace(']', '')
              el = split[0]
              hasSelectors.push(true)
            }
          })
          if(hasSelectors.indexOf(true) !== -1){
            selectorCheck[key][attr][el] = props
            if(!isArr) selectorCheck[key][attr][el].value = attribute.selector[select].value
          }
          else {
            selectorCheck[key][attr][tag] = '*'
            if(!isArr) selectorCheck[key][attr][tag].value = attribute.selector[select].value
          }
        })
      })

    })
  })
}

export const formatFS = (nodes, _options) => {
  let rootFS = Object.assign({}, options.root, _options.root)
  Object.assign(options, _options)
  setupSelectors(options)
  attrArrEmpty = Object.keys(options.attrKeyAdd).length === 0
  if(options.tagConvert[rootFS[0]]){
    rootFS = tagConvert({
      action: options.tagConvert[rootFS[0]],
      block: rootFS,
      value: rootFS[0],
      node: rootFS,
      children: nodes,
      nodes,
    })
  }
  rootFS[1] = formatAttributes({
    attributes: rootFS[1],
    node: rootFS,
    children: nodes,
    nodes
  })
  return addChildren(rootFS, format({
    childs: nodes,
    parent: rootFS,
  }))
}