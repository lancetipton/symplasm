import {
  addChildren,
  convertStyle,
  setupSelectors,
  unquote
} from './helpers'

let options = {
  root: {
    0: 'div',
  },
  tagConvert: {},
  attrKeyConvert: {},
  attrValueConvert: {},
  attrKeyAdd: {},
  trim: false,
  lowerCaseTag: true,
  comments: true
}

let selectorCheck = {
  tagConvert: {},
  attrKeyConvert: {},
  attrValueConvert: {},
  attrKeyAdd: {},
}
let attrArrEmpty = true
const domTagAction = '$$DOM_TAG_NAME'

const convertBlock = (block, nodes, children) => {
  const data = selectorCheck.tagConvert[block[0]]
    ? runAction({
        action: selectorCheck.tagConvert[block[0]],
        node: block,
        key: domTagAction,
        value: block[0],
        nodes,
        children
      }, 'value')
    : block[0]
  if(typeof data === 'string') block[0] = data
  if(typeof data === 'object') block = data

  block[1] = typeof block[1] === 'object'
    ? Object.keys(block[1]).reduce((attrs, key) => {
        let useKey = selectorCheck.attrKeyConvert[key]
          ? runAction({
              action: selectorCheck.attrKeyConvert[key],
              node: block,
              value: block[1][key],
              key,
              nodes,
              children
            }, 'key')
          : key

        if(useKey && block[1][key]){
          attrs[useKey] = selectorCheck.attrValueConvert[key]
            ? runAction({
                action: selectorCheck.attrValueConvert[key],
                node: block,
                value: block[1][key],
                key,
                nodes,
                children
              }, 'value')
            : typeof block[1][key] === 'string'
              ? unquote(block[1][key])
              : block[1][key]
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

  const tagName = node[0]
  if(!tagName) return block
  block[0] = options.lowerCaseTag
    ? tagName.toLowerCase()
    : tagName

  if(typeof action === 'function'){
    let data = runAction({
      key: domTagAction,
      value: block[0],
      action,
      node,
      nodes,
      children
    }, 'value')
    if(!data) return block
    if(typeof data === 'string') data = { 0: data }
    
    if(typeof data === 'object')
      block = buildBlock(block, data, nodes, children)
  }
  else if(typeof action === 'object' && !Array.isArray(action) && action[0]){
    block = buildBlock(block, action, nodes, children)
  }
  else {
    const data = runAction({
      key: domTagAction,
      value: block[0],
      action,
      node,
      nodes,
      children
    }, 'value')
    if(typeof data === 'string') block[0] = data
    if(typeof data === 'object'){
      block = buildBlock(block, data, nodes, children)
    }
  }
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
  const block = selectorCheck.tagConvert[node[0]]
    ? tagConvert({
        action: selectorCheck.tagConvert[node[0]],
        block: {},
        value: node[0],
        node,
        nodes,
        children
      })
    : { 0: node[0] }

  // Build any of the current attrs
  const attrs = formatAttributes({
    attributes: node[1],
    node,
    nodes,
    children
  })

  // current attr data get merge after the data from the node
  // This is because the only way the block will have attrs is if it was tagConverted
  block[1] = Object.assign({}, attrs, block[1])

  const childs = format({
    childs: node[2],
    parent: block,
    nodes,
    children
  })
  return addChildren(block, childs)
}

const formatAttributes = (args) => {
  const { node, nodes, children } = args
  let { attributes } = args
  attributes = attributes || {}
  const attrs = {}

  Object.keys(attributes).map(item => {
    const parts = [ item, attributes[item]]

    const key = selectorCheck.attrKeyConvert[parts[0]]
      ? runAction({
          action: selectorCheck.attrKeyConvert[parts[0]],
          key: parts[0],
          value: parts[1],
          node,
          nodes,
          children
        }, 'key')
      : parts[0]

    const value = typeof parts[1] === 'string' || typeof parts[1] === 'object'
      ? formatValue({
          key: parts[0],
          value: parts[1],
          node,
          nodes,
          children
        })
      : null

    if(key){
      if(key === 'class' && value === '') attrs[key] = ''
      if(key === 'id' && !value) return
      attrs[key] = value || value === false
        ? value
        : true
    }

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
  const updatedVal = key === 'style' && typeof value === 'string'
    ? convertStyle(unquote(value))
    : selectorCheck.attrValueConvert[key]
      ? runAction({
          action: selectorCheck.attrValueConvert[key],
          value: unquote(value),
          node,
          key,
          nodes,
          children
        }, 'value')
      : typeof value === 'string' && unquote(value) || value

  if(updatedVal === 'true') return true
  if(updatedVal === 'false') return false
  return updatedVal
}

// ----------- Run options methods ----------- //
const runAction = (args, def) => {
  const { action, node, key, value, nodes, children } = args
  
  switch(typeof action){
    case 'string':
      return action || args[def]
    case 'function':
      return action({
        0: node[0],
        1: node[1],
        2: node[2]
      }, key, value, nodes, children, options) || args[def]
      
    case 'object':
      let updateVal
      // Get the tag type to be checked
      const tagType = node[0]
       if(!tagType) return args[def]
      
      // Get the node attrs if there are any
      const nodeAttrs = node[1]
      if(!nodeAttrs) return args[def]
      
      // Get the selector to check
      const selector = action[tagType]
      // if none, return the default
      if(!selector) return args[def]
      // Check if it's an all selector, if it is, set the value
      updateVal = selector.all || null
      const selectKeys = Object.keys(selector)

      if(
        // Check if there are more keys then just the all key
        selector.all && selectKeys.length > 1 ||
        // Check if there is no all key, but there are other keys
        !selector.all  && selectKeys.length >= 1
      ){
        // return the default if it's not a select all and no attrs exist
        if(!nodeAttrs) return args[def]
        // Loop the slector and check if any of the elements attrs match
        let setSelector
        
        Object.keys(selector).map(key => {
          // If the updateVaule is already set or the key does not exist, stop checking
          if(setSelector || (!nodeAttrs[key] && nodeAttrs[key] !== '')) return
          
          if(nodeAttrs[key] === "true" && !selector[key][nodeAttrs[key]] && selector[key]['']){
            updateVal = selector[key]['']
            setSelector = true
          }
          else if(selector[key][nodeAttrs[key]]){
            updateVal = selector[key][nodeAttrs[key]]
            setSelector = true
          }
        })
      }

      if(updateVal){
        // If we should update, set the update based on type
        if(typeof updateVal === 'string' || typeof updateVal === 'object') return updateVal
        else if(typeof updateVal === 'function'){
          return updateVal({
            0: node[0],
            1: node[1],
            2: node[2]
          }, key, value, nodes, children, options) || args[def]
        }
      }
      // If we should not update the elment, return the default
      return args[def]

    default:
      return action || args[def]
  }
}

// ----------- Helpers ----------- //
const addAttribute = (args) => {
  const { node, attrs, nodes, children } = args
  
  Object.keys(selectorCheck.attrKeyAdd).map(key => {
    const value = runAction({
      action: selectorCheck.attrKeyAdd[key],
      key,
      node,
      nodes,
      children
    })

    if(value) attrs[key] = value
  })

  return attrs
}


const filterFS = (node) => {
  let start = ''
  let end = ''
  let text = node.content

  if (node.type === 'comment') {
    if(!options.comments) return null
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
  let rootFS = Object.assign({}, options.root, _options.root)
  Object.assign(options, _options)
  selectorCheck = setupSelectors(selectorCheck, options)
  attrArrEmpty = Object.keys(options.attrKeyAdd).length === 0
  
  if(selectorCheck.tagConvert[rootFS[0]]){
    rootFS = tagConvert({
      action: selectorCheck.tagConvert[rootFS[0]],
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

  rootFS[2] = Array.isArray(rootFS[2])
  ? rootFS[2].map(child => {
      return convertBlock(child, nodes, nodes)
    })
  : []

  return addChildren(rootFS, format({
    childs: nodes,
    parent: rootFS,
  }))
}