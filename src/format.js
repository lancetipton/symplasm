let options = {
  root: {
    0: 'div',
    1: {
      className: 'root-node',
      active: true
    }
  },
  trim: false,
  lowerCaseTag: true
}

export function formatFS (nodes, _options) {
  Object.assign(options, _options)
  const rootFS = Object.assign({}, options.root)
  rootFS[2] = format(nodes, rootFS)
  return rootFS
}

function formatAttributes (attributes, block) {
  const attrs = {}
  
  attributes && attributes.map(attribute => {
    const parts = splitHead(attribute.trim(), '=')
    const key = parts[0]
    const value = typeof parts[1] === 'string'
      ? formatValue(parts[0], parts[1])
      : null
    attrs[key] = value
  })
  block[1] = attrs
  return block
}

function format (nodes, parent) {
  return nodes
    ? nodes.reduce((children, node) => {
        const child = node.type === 'text' || node.type === 'comment'
          ? filterFS(node, parent)
          : map(node)
        child && children.push(child)
        return children
      }, [])
    : []
}

function formatValue (key, value) {
  if (key.indexOf('_') === 0 && options.convertAttrs) {
    try { return JSON.parse(unquote(value)) } catch (e) {}
  }
  return unquote(value)
}

function filterFS (node, parent) {
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

function map (node) {
  let block = {}
  block[0] = options.lowerCaseTag
    ? node.tagName.toLowerCase()
    : node.tagName
  
  block = formatAttributes(node.attributes, block)
  
  let childComponents = format(node.children, block)
  if (childComponents.length > 0) {
    block[2] = childComponents
  }
  return block
}

function splitHead (str, sep) {
  const idx = str.indexOf(sep)
  if (idx === -1) return [str]
  return [str.slice(0, idx), str.slice(idx + sep.length)]
}

function unquote (str) {
  const car = str.charAt(0)
  const end = str.length - 1
  const isQuoteStart = car === '"' || car === "'"
  if (isQuoteStart && car === str.charAt(end)) {
    return str.slice(1, end)
  }
  return str
}