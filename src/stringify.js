import { revPropMap } from './prop_map'
import { arrayIncludes } from './compat'

const opts = {
  styleAsCss: true,
  selfClosing: true,
  attrLowerCase: false,
}

export const formatAttributes = (attributes, options = opts) => {
  let attrString = Object.keys(attributes).reduce((attrs, currentKey) => {
    let key = currentKey
    if (options.hasOpts && options.attrLowerCase && revPropMap[currentKey])
      key = revPropMap[currentKey]

    let value = attributes[currentKey]
    if (!value) return `${attrs} ${key}`
    // if (!value && (value === undefined || value === null)) return `${attrs} ${key}`
    else if (key === 'style' && typeof value === 'object') {
      let styles = ''
      const noCss = options.styleAsCss === false
      Object.keys(value).map(_name => {
        const name = noCss
          ? _name
          : _name
            .split(/(?=[A-Z])/)
            .join('-')
            .toLowerCase()

        styles += `${name}: ${value[_name]}; `
      })

      const quoteEscape = styles.indexOf("'") !== -1
      const quote = quoteEscape ? '"' : "'"
      return `${attrs} ${key}=${quote}${styles.trim()}${quote}`
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

const buildTag = (tagName, attributes, children, options = opts) => {
  return `<${tagName}${formatAttributes(attributes, options)}>${
    toHTML(children, options) || ''
  }</${tagName}>`
}

const buildSelfCloseTag = (tagName, attributes, options = opts) => {
  let formatted = formatAttributes(attributes, options)
  formatted = formatted.length ? formatted + ' ' : formatted
  const inCloseArr =
    Array.isArray(options.selfClosing) && !options.selfClosing.includes(tagName)
  const end = options.selfClosing !== false && !inCloseArr ? `/` : ``

  const full = `${tagName}${formatted}${end}`.trim()

  return `<${full}>`
}

export function toHTML(tree, _options) {
  const options = Object.assign({ ...opts }, _options)

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

        // If element does not have children
        // Theck we want to do a lowerCase check
        // If el does have children, then only do a direct match
        // Any self closing tags should not have children, and uppercase letters
        const tagCheck = (!children && tagName.toLowerCase()) || tagName
        const isSelfClosing = arrayIncludes(options.voidTags, tagCheck)

        return isSelfClosing
          ? buildSelfCloseTag(tagName, attributes, options)
          : buildTag(tagName, attributes, children, options)
      })
      .join('')
  )
}

export default { toHTML }
