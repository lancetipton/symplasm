import lexer from './lexer'
import parser from './parser'
import { toHTML } from './stringify'
import { formatFS } from './format'

import {
  voidTags,
  closingTags,
  childlessTags,
  closingTagAncestorBreakers,
} from './tags'

export const parseDefaults = {
  voidTags,
  closingTags,
  childlessTags,
  hasOpts: false,
  includePositions: false,
  closingTagAncestorBreakers,
}

export function parse(str: String) {
  let options = Object.assign({ ...parseDefaults }, arguments[1])
  const tokens = lexer(str, options)
  const nodes = parser(tokens, options)
  return formatFS(nodes, options)
}

export function stringify(ast: Record<any, any>) {
  let options = { ...parseDefaults }
  options.hasOpts = false
  if (arguments[1]) {
    options = Object.assign({ ...parseDefaults }, arguments[1])
    options.hasOpts = true
  }

  return Array.isArray(ast) ? toHTML(ast, options) : toHTML([ast], options)
}

;(() => {
  if (Boolean(typeof window !== 'undefined')) {
    // @ts-ignore
    window.Symplasm = { parse, stringify, parseDefaults }
  }
})()
