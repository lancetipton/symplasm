import { propMap } from './prop_map'
import { deepMerge, emptyObj } from '@keg-hub/jsutils'
import { addChildren, convertStyle, setupSelectors, unquote } from './helpers'

const defRoot = { 0: 'div' }

const opts = {
  trim: false,
  root: undefined,
  attrKeyAdd: {},
  tagConvert: {},
  comments: true,
  parseInt: false,
  parseBoolean: true,
  lowerCaseTag: true,
  attrKeyConvert: {},
  attrValueConvert: {},
  attrCamelCase: false,
  attrArrEmpty: undefined,
}

const domTagAction = '$$DOM_TAG_NAME'

const convertBlock = (block, parent, nodes, children, tree, options) => {
  const data = options.selectorCheck.tagConvert[block[0]]
    ? runAction(
      {
        action: options.selectorCheck.tagConvert[block[0]],
        node: block,
        key: domTagAction,
        value: block[0],
        nodes,
        children,
      },
      'value',
      options
    )
    : block[0]
  if (typeof data === 'string') block[0] = data
  if (typeof data === 'object') block = data

  // If the block has attributes, loop over attrs and format based on settings
  block[1] =
    typeof block[1] === 'object'
      ? Object.keys(block[1]).reduce((attrs, key) => {
        let useKey = options.selectorCheck.attrKeyConvert[key]
          ? runAction(
            {
              action: options.selectorCheck.attrKeyConvert[key],
              node: block,
              value: block[1][key],
              key,
              nodes,
              children,
            },
            'key',
            options
          )
          : key

        useKey = (options.attrCamelCase && propMap[useKey]) || useKey

        if (useKey && block[1][key]) {
          attrs[useKey] = options.selectorCheck.attrValueConvert[key]
            ? runAction(
              {
                action: options.selectorCheck.attrValueConvert[key],
                node: block,
                value: block[1][key],
                key,
                nodes,
                children,
              },
              'value',
              options
            )
            : typeof block[1][key] === 'string'
              ? unquote(block[1][key])
              : block[1][key]
        }

        return attrs
      }, {})
      : {}

  // If first child is an array, loop over each child
  if (block[2] && typeof block[2] !== 'string' && block[2].length)
    block[2] = block[2].map(child =>
      convertBlock(child, block, nodes, children, tree, options)
    )

  return (tree && allElementsCB(block, parent, tree, options)) || block
}

const buildBlock = (org, added, nodes, children, parent, options) => {
  org[0] = added[0]
  org[1] = { ...org[1], ...added[1] }
  if (added[2]) org[2] = added[2]

  return convertBlock(org, parent, nodes, children, undefined, options)
}

const tagConvert = (args, options) => {
  let block = args.block
  const { node, nodes, parent, action, children } = args

  const tagName = node[0]
  if (!tagName) return block
  block[0] = options.lowerCaseTag ? tagName.toLowerCase() : tagName

  // Handle action method
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
      'value',
      options
    )

    if (!data) return block
    if (typeof data === 'string') data = { 0: data }

    if (typeof data === 'object')
      block = buildBlock(block, data, nodes, children, parent, options)
  }

  // Handle action object or array of objects
  else if (typeof action === 'object' && !Array.isArray(action) && action[0]) {
    block = buildBlock(block, action, nodes, children, parent, options)
  }

  // Handle default action for data
  else {
    const data = runAction(
      {
        key: domTagAction,
        value: block[0],
        action,
        node,
        nodes,
        children,
      },
      'value',
      options
    )

    if (typeof data === 'string') block[0] = data

    if (typeof data === 'object')
      block = buildBlock(block, data, nodes, children, parent, options)
  }
  return block
}

// ----------- Formatters ----------- //
const format = (args, options) => {
  let nodes = args.nodes
  const { tree, parent, childs } = args

  return childs
    ? childs.reduce((children, node) => {
      nodes = nodes || childs
      const child =
          node.type === 'text' || node.type === 'comment'
            ? filterFS(node, options)
            : formatNode(
              {
                node,
                childs,
                nodes,
                children,
                tree,
                parent,
              },
              options
            )
      child && children.push(child)
      return children
    }, [])
    : []
}

const formatNode = (args, options) => {
  const { node, tree, nodes, parent, children } = args

  // Check if the node needs to be converted
  // If it does, run the conversion
  // Otherwise set the default
  const block = options.selectorCheck.tagConvert[node[0]]
    ? tagConvert(
      {
        action: options.selectorCheck.tagConvert[node[0]],
        block: {},
        value: node[0],
        node,
        nodes,
        children,
        parent,
      },
      options
    )
    : { 0: node[0] }

  // Build any of the current attrs
  const attrs = formatAttributes(
    {
      attributes: node[1],
      node,
      nodes,
      children,
    },
    options
  )

  // current attr data get merge after the data from the node
  // This is because the only way the block will have attrs is if it was tagConverted
  block[1] = { ...attrs, ...block[1] }

  return allElementsCB(
    // Add the children to the block
    addChildren(
      block,
      // Format the children before adding to the block
      format(
        {
          tree,
          childs: node[2],
          parent: block,
          nodes,
          children,
        },
        options
      )
    ),
    parent,
    tree,
    options
  )
}

const formatAttributes = (args, options) => {
  const { node, nodes, children, attributes = {} } = args

  const attrs = {}

  Object.keys(attributes).map(item => {
    const parts = [ item, attributes[item] ]

    if (options.selectorCheck.attrKeyConvert[parts[0]] === null) return

    let key = options.selectorCheck.attrKeyConvert[parts[0]]
      ? runAction(
        {
          action: options.selectorCheck.attrKeyConvert[parts[0]],
          key: parts[0],
          value: parts[1],
          node,
          nodes,
          children,
        },
        'key',
        options
      )
      : parts[0]

    key = (options.attrCamelCase && propMap[key]) || key

    const value =
      typeof parts[1] === 'string' || typeof parts[1] === 'object'
        ? formatValue(
          {
            key: parts[0],
            value: parts[1],
            node,
            nodes,
            children,
          },
          options
        )
        : null

    if (key) {
      if ((key === 'className' || key === 'class') && value === '')
        attrs[key] = ''

      if (key === 'id' && !value) return

      attrs[key] = value || value === false ? value : true
    }
  })

  return options.attrArrEmpty
    ? attrs
    : addAttribute(
      {
        node,
        attrs,
        nodes,
        children,
      },
      options
    )
}

const formatValue = (args, options) => {
  const { node, key, value, nodes, children } = args

  const updatedVal =
    key === 'style' && typeof value === 'string'
      ? convertStyle(unquote(value))
      : options.selectorCheck.attrValueConvert[key]
        ? runAction(
          {
            action: options.selectorCheck.attrValueConvert[key],
            value: unquote(value),
            node,
            key,
            nodes,
            children,
          },
          'value',
          options
        )
        : (typeof value === 'string' && unquote(value)) || value

  const trimmed = updatedVal?.trim?.()

  if (options.parseBoolean) {
    if (trimmed === `true`) return true
    if (trimmed === `false`) return false
  }

  if (options.parseInt) {
    const asInt = parseInt(trimmed)
    if (`${asInt}` === trimmed) return asInt
  }

  return updatedVal
}

// ----------- Run options methods ----------- //
const runAction = (args, def, options) => {
  const { key, node, value, nodes, action, children } = args

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
        options
      ) || args[def]
    )

  case 'object':
    let updateVal
    // Get the tag type to be checked
    const tagType = node[0]
    if (!tagType) return args[def]

    // Get the node attrs if there are any
    const nodeAttrs = node[1]
    if (!nodeAttrs) return args[def]

    // Get the selector to check
    const selector = action[tagType]
    // if none, return the default
    if (!selector) return args[def]
    // Check if it's an all selector, if it is, set the value
    updateVal = selector.all || null
    const selectKeys = Object.keys(selector)

    if (
    // Check if there are more keys then just the all key
      (selector.all && selectKeys.length > 1) ||
        // Check if there is no all key, but there are other keys
        (!selector.all && selectKeys.length >= 1)
    ) {
      // return the default if it's not a select all and no attrs exist
      if (!nodeAttrs) return args[def]
      // Loop the slector and check if any of the elements attrs match
      let setSelector

      Object.keys(selector).map(key => {
        // If the updateVaule is already set or the key does not exist, stop checking
        if (setSelector || (!nodeAttrs[key] && nodeAttrs[key] !== '')) return

        if (
          nodeAttrs[key] === 'true' &&
            !selector[key][nodeAttrs[key]] &&
            selector[key]['']
        ) {
          updateVal = selector[key]['']
          setSelector = true
        }
        else if (selector[key][nodeAttrs[key]]) {
          updateVal = selector[key][nodeAttrs[key]]
          setSelector = true
        }
      })
    }

    if (updateVal) {
      // If we should update, set the update based on type
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
            options
          ) || args[def]
        )
      }
    }
    // If we should not update the elment, return the default
    return args[def]

  default:
    return action || args[def]
  }
}

// ----------- Helpers ----------- //
const addAttribute = (args, options) => {
  const { node, attrs, nodes, children } = args

  Object.keys(options.selectorCheck.attrKeyAdd).map(key => {
    const value = runAction(
      {
        key,
        node,
        nodes,
        children,
        action: options.selectorCheck.attrKeyAdd[key],
      },
      undefined,
      options
    )

    if (value) attrs[key] = value
  })

  return attrs
}

const filterFS = (node, options) => {
  let start = ''
  let end = ''
  let text = node.content

  if (node.type === 'comment') {
    if (!options.comments) return null
    start = '<!--'
    end = '-->'
  }
  if (options.trim) {
    return node.content.trim() !== '\n' &&
      node.content.replace(/\s/g, '').length > 0
      ? start + node.content.trim() + end
      : null
  }
  return text ? start + text + end : null
}

const allElementsCB = (block, parent, tree, options) => {
  return typeof options.allElements === 'function'
    ? options.allElements(block, parent, tree) || block
    : block
}

export const formatFS = (nodes, _options = emptyObj) => {
  const { root, ...rest } = _options

  let rootFS = deepMerge({}, defRoot, root)
  const options = deepMerge({}, opts, rest)

  options.selectorCheck = setupSelectors(options)
  options.attrArrEmpty = Object.keys(options.attrKeyAdd).length === 0

  if (options.selectorCheck.tagConvert[rootFS[0]])
    rootFS = tagConvert(
      {
        nodes,
        rootFS,
        node: rootFS,
        block: rootFS,
        children: nodes,
        value: rootFS[0],
        action: options.selectorCheck.tagConvert[rootFS[0]],
      },
      options
    )

  rootFS[1] = formatAttributes(
    {
      nodes,
      node: rootFS,
      children: nodes,
      attributes: rootFS[1],
    },
    options
  )

  rootFS[2] = Array.isArray(rootFS[2])
    ? rootFS[2].map(child =>
      convertBlock(child, rootFS, nodes, nodes, rootFS, options)
    )
    : []

  const builtRoot = addChildren(
    rootFS,
    format(
      {
        tree: rootFS,
        childs: nodes,
        parent: rootFS,
      },
      options
    )
  )

  return allElementsCB(builtRoot, builtRoot, builtRoot, options)
}
