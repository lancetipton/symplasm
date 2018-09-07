import lexer from './lexer'
import parser from './parser'
import {toHTML} from './stringify'
import { formatFS } from './format'

import {
  voidTags,
  closingTags,
  childlessTags,
  closingTagAncestorBreakers
} from './tags'


export const parseDefaults = {
  voidTags,
  closingTags,
  childlessTags,
  closingTagAncestorBreakers,
  includePositions: false
}

export function parse (str) {
  let options = Object.assign(parseDefaults, arguments[1])
  const tokens = lexer(str, options)
  const nodes = parser(tokens, options)
  return formatFS(nodes, options)
}

export function stringify (ast, options = parseDefaults) {
  return Array.isArray(ast)
    ? toHTML(ast, options)
    : toHTML([ast], options)
}
