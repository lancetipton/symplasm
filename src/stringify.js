import {arrayIncludes} from './compat'
import { revPropMap } from './prop_map'

let options = {
  attrLowerCase: false,
  styleAsCss: false
}

export function formatAttributes (attributes, options) {
  let attrString = Object.keys(attributes).reduce((attrs, currentKey) => {
    let key = currentKey
    if(options.hasOpts && options.attrLowerCase && revPropMap[currentKey]) key = revPropMap[currentKey]
    
    let value = attributes[currentKey]
    if (!value) return `${attrs} ${key}`
    else if(key === 'style' && typeof value === 'object'){
      let styles = ''
      Object.keys(value).map(_name => {
        let name = _name
        if(options.hasOpts && options.styleAsCss) name = _name.split(/(?=[A-Z])/).join('-').toLowerCase()
        
        styles += `${name}:${value[_name]};`
      })
      const quoteEscape = styles.indexOf('\'') !== -1
      const quote = quoteEscape ? '"' : '\''
      return `${attrs} ${key}=${quote}${styles}${quote}`
    }
    if(typeof value === 'boolean') value = `${value}`
    
    if(typeof value === 'string'){
      const quoteEscape = value.indexOf('\'') !== -1
      const quote = quoteEscape ? '"' : '\''
      return `${attrs} ${key}=${quote}${value}${quote}`
    }
    return attrs
  }, '')
  
  attrString = typeof attrString === 'string' && attrString.trim() || ''
  return attrString.length
    ? ' '+attrString
    : ''
}

const buildTag = (tagName, attributes, children, options) => {

  return `<${tagName}${formatAttributes(attributes, options)}>${toHTML(children, options) || '' }</${tagName}>`
}

const buildSelfCloseTag = (tagName, attributes, options) => {
  let formatted = formatAttributes(attributes, options)
  formatted = formatted.length
    ? formatted + ' '
    : formatted
  return `<${tagName}${formatted}${'/'}>`
}


export function toHTML (tree, _options) {

  options = options.hasOpts
    ? Object.assign(options, _options)
    : _options
  
  if (typeof tree === 'string') return tree
  return tree && tree.map(node => {
    if (typeof node === 'string') return node
    if (node.type === 'comment') return `<!--${node.content}-->`
    const tagName = node[0]
    const attributes = node[1]
    const children = node[2]
    
    // If element does not have children
    // Theck we want to do a lowerCase check
    // If el does have children, then only do a direct match
    // Any self closing tags should not have children, and uppercase letters
    const tagCheck = !children && tagName.toLowerCase() || tagName
    const isSelfClosing = arrayIncludes(options.voidTags, tagCheck)

    return isSelfClosing
      ? buildSelfCloseTag(tagName, attributes, options)
      : buildTag(tagName, attributes, children, options)
  }).join('')
}

export default {toHTML}
