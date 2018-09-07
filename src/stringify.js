import {arrayIncludes} from './compat'

export function formatAttributes (attributes) {
  return Object.keys(attributes).reduce((attrs, key) => {
    const value = attributes[key]
    if (!value) return `${attrs} ${key}`
    else if(key === 'style' && typeof value === 'object'){
      let styles = ''
      Object.keys(value).map(name => {
        styles += `${name}:${value[name]};`
      })
      const quoteEscape = styles.indexOf('\'') !== -1
      const quote = quoteEscape ? '"' : '\''
      return `${attrs} ${key}=${quote}${styles}${quote}`
    }
    
    if(typeof value === 'string'){
      const quoteEscape = value.indexOf('\'') !== -1
      const quote = quoteEscape ? '"' : '\''
      return `${attrs} ${key}=${quote}${value}${quote}`
    }
    
  }, '')
}

export function toHTML (tree, options) {
  if (typeof tree === 'string') return tree
console.log('------------------tree------------------');
console.log(tree);

  return tree && tree.map(node => {
    if (typeof node === 'string') return node
    if (node.type === 'comment') return `<!--${node.content}-->`
    const tagName = node[0]
    const attributes = node[1]
    const children = node[2]

    const isSelfClosing = arrayIncludes(options.voidTags, tagName.toLowerCase())
    return isSelfClosing
      ? `<${tagName}${formatAttributes(attributes)}>`
      : `<${tagName}${formatAttributes(attributes)}>${toHTML(children, options)}</${tagName}>`
  }).join('')
}

export default {toHTML}
