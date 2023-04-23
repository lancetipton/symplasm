import lexer from '../lexer'
import parser from '../parser'

const lexerOptions = { childlessTags: [] }
const parserOptions = {
  voidTags: [],
  closingTags: [],
  closingTagAncestorBreakers: {},
}

describe(`parser`, () => {
  test('parser() should return nodes', () => {
    const str = '<h1>Hello world</h1>'
    const tokens = lexer(str, lexerOptions)
    const nodes = parser(tokens, parserOptions)

    expect(nodes).toEqual([
      {
        0: 'h1',
        1: {},
        2: [
          {
            type: 'text',
            content: 'Hello world',
            position: {
              start: {
                index: 4,
                line: 0,
                column: 4,
              },
              end: {
                index: 15,
                line: 0,
                column: 15,
              },
            },
          },
        ],
      },
    ])
  })

  test('parser() should not nest within void tags', () => {
    const str = '<div>abc<img/>def</div>'
    const tokens = lexer(str, lexerOptions)
    const nodes = parser(tokens, { voidTags: 'img', closingTags: [] })
    expect(nodes).toEqual([
      {
        0: 'div',
        1: {},
        2: [
          {
            type: 'text',
            content: 'abc',
            position: {
              start: {
                index: 5,
                line: 0,
                column: 5,
              },
              end: {
                index: 8,
                line: 0,
                column: 8,
              },
            },
          },
          {
            0: 'img',
            1: {},
            2: [],
          },
          {
            type: 'text',
            content: 'def',
            position: {
              start: {
                index: 14,
                line: 0,
                column: 14,
              },
              end: {
                index: 17,
                line: 0,
                column: 17,
              },
            },
          },
        ],
      },
    ])
  })

  test('parser() should handle optional-close tags - broken p tag', () => {
    const parserOptions = {
      voidTags: [],
      closingTags: ['p'],
      closingTagAncestorBreakers: {},
    }
    const str = '<p>This is one<p>This is two</p>'
    const tokens = lexer(str, lexerOptions)
    const nodes = parser(tokens, parserOptions)

    expect(nodes).toEqual([
      {
        0: 'p',
        1: {},
        2: [
          {
            type: 'text',
            content: 'This is one',
            position: {
              start: {
                index: 3,
                line: 0,
                column: 3,
              },
              end: {
                index: 14,
                line: 0,
                column: 14,
              },
            },
          },
        ],
      },
      {
        0: 'p',
        1: {},
        2: [
          {
            type: 'text',
            content: 'This is two',
            position: {
              start: {
                index: 17,
                line: 0,
                column: 17,
              },
              end: {
                index: 28,
                line: 0,
                column: 28,
              },
            },
          },
        ],
      },
    ])
  })

  test('parser() should handle optional-close tags - broken span tag', () => {
    const parserOptions = {
      voidTags: [],
      closingTags: [ 'p', 'span' ],
      closingTagAncestorBreakers: {},
    }

    const str = '<p>This is one <span>okay<p>This is two</p>'
    const tokens = lexer(str, lexerOptions)
    const nodes = parser(tokens, parserOptions)

    expect(nodes).toEqual([
      {
        0: 'p',
        1: {},
        2: [
          {
            type: 'text',
            content: 'This is one ',
            position: {
              start: {
                index: 3,
                line: 0,
                column: 3,
              },
              end: {
                index: 15,
                line: 0,
                column: 15,
              },
            },
          },
          {
            0: 'span',
            1: {},
            2: [
              {
                type: 'text',
                content: 'okay',
                position: {
                  start: {
                    index: 21,
                    line: 0,
                    column: 21,
                  },
                  end: {
                    index: 25,
                    line: 0,
                    column: 25,
                  },
                },
              },
            ],
          },
        ],
      },
      {
        0: 'p',
        1: {},
        2: [
          {
            type: 'text',
            content: 'This is two',
            position: {
              start: {
                index: 28,
                line: 0,
                column: 28,
              },
              end: {
                index: 39,
                line: 0,
                column: 39,
              },
            },
          },
        ],
      },
    ])
  })

  test('parser() should auto-close unmatched child tags', () => {
    const parserOptions = {
      voidTags: [],
      closingTags: [],
      closingTagAncestorBreakers: {},
    }
    const str = '<div>This is <b>one <span>okay</div>'
    const tokens = lexer(str, lexerOptions)
    const nodes = parser(tokens, parserOptions)
    expect(nodes).toEqual([
      {
        0: 'div',
        1: {},
        2: [
          {
            type: 'text',
            content: 'This is ',
            position: {
              start: {
                index: 5,
                line: 0,
                column: 5,
              },
              end: {
                index: 13,
                line: 0,
                column: 13,
              },
            },
          },
          {
            0: 'b',
            1: {},
            2: [
              {
                type: 'text',
                content: 'one ',
                position: {
                  start: {
                    index: 16,
                    line: 0,
                    column: 16,
                  },
                  end: {
                    index: 20,
                    line: 0,
                    column: 20,
                  },
                },
              },
              {
                0: 'span',
                1: {},
                2: [
                  {
                    type: 'text',
                    content: 'okay',
                    position: {
                      start: {
                        index: 26,
                        line: 0,
                        column: 26,
                      },
                      end: {
                        index: 30,
                        line: 0,
                        column: 30,
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ])
  })

  test('parser() should handle empty token arrays', () => {
    const tokens = []
    const nodes = parser(tokens, parserOptions)
    expect(nodes).toEqual([])
  })

  test('parser() should report the element attributes', () => {
    const str = '<div class="cake" data-key="abc" disabled></div>'
    const tokens = lexer(str, lexerOptions)
    const nodes = parser(tokens, parserOptions)
    expect(nodes).toEqual([
      {
        0: 'div',
        1: {
          class: 'cake',
          'data-key': 'abc',
          disabled: '',
        },
        2: [],
      },
    ])
  })

  test('parser() should handle unclosed elements', () => {
    const str = '<div>abc'
    const tokens = lexer(str, lexerOptions)
    const nodes = parser(tokens, parserOptions)

    expect(nodes).toEqual([
      {
        0: 'div',
        1: {},
        2: [
          {
            type: 'text',
            content: 'abc',
            position: {
              start: {
                index: 5,
                line: 0,
                column: 5,
              },
              end: {
                index: 8,
                line: 0,
                column: 8,
              },
            },
          },
        ],
      },
    ])
  })

  test('parser() should preserve case-sensitive tag names', () => {
    const str = '<You-Know-8>'
    const tokens = lexer(str, lexerOptions)
    const nodes = parser(tokens, parserOptions)
    expect(nodes).toEqual([
      {
        0: 'You-Know-8',
        1: {},
        2: [],
      },
    ])
  })

  test('parser() should match by case-insensitive tags', () => {
    const str = '<div>abc</DIV>def'
    const tokens = lexer(str, lexerOptions)
    const nodes = parser(tokens, parserOptions)

    expect(nodes).toEqual([
      {
        0: 'div',
        1: {},
        2: [
          {
            type: 'text',
            content: 'abc',
            position: {
              start: {
                index: 5,
                line: 0,
                column: 5,
              },
              end: {
                index: 8,
                line: 0,
                column: 8,
              },
            },
          },
        ],
      },
      {
        type: 'text',
        content: 'def',
        position: {
          start: {
            index: 14,
            line: 0,
            column: 14,
          },
          end: {
            index: 17,
            line: 0,
            column: 17,
          },
        },
      },
    ])
  })

  describe(`special case is where a <ul|ol|menu> is encountered within an <li>`, () => {
    /*
      To summarize, this special case is where a <ul|ol|menu> is
      encountered within an <li>. The default behavior for <li>s
      as closing tags is to rewind up and auto-close the previous
      <li>. However, <li> may contain <ul|ol|menu> before being
      closed so we should not rewind the stack in those cases.
      This edge-case also applies to <dt|dd> in <dl>s.
    */

    test('parser() should handle ancestor breaker special case (#39.1)', () => {
      const str = '<ul><li>abc<ul><li>def</li></ul></li></ul>'
      const tokens = lexer(str, lexerOptions)
      const nodes = parser(tokens, {
        voidTags: [],
        closingTags: ['li'],
        closingTagAncestorBreakers: {
          li: ['ul'],
        },
      })

      expect(nodes).toEqual([
        {
          0: 'ul',
          1: {},
          2: [
            {
              0: 'li',
              1: {},
              2: [
                {
                  type: 'text',
                  content: 'abc',
                  position: {
                    start: {
                      index: 8,
                      line: 0,
                      column: 8,
                    },
                    end: {
                      index: 11,
                      line: 0,
                      column: 11,
                    },
                  },
                },
                {
                  0: 'ul',
                  1: {},
                  2: [
                    {
                      0: 'li',
                      1: {},
                      2: [
                        {
                          type: 'text',
                          content: 'def',
                          position: {
                            start: {
                              index: 19,
                              line: 0,
                              column: 19,
                            },
                            end: {
                              index: 22,
                              line: 0,
                              column: 22,
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ])
    })

    test('parser() should handle ancestor breaker special case (#39.2)', () => {
      const str = '<ul><li>abc<ul><span><li>def</li></span></ul></li></ul>'
      const tokens = lexer(str, lexerOptions)
      const nodes = parser(tokens, {
        voidTags: [],
        closingTags: ['li'],
        closingTagAncestorBreakers: {
          li: ['ul'],
        },
      })

      expect(nodes).toEqual([
        {
          0: 'ul',
          1: {},
          2: [
            {
              0: 'li',
              1: {},
              2: [
                {
                  type: 'text',
                  content: 'abc',
                  position: {
                    start: {
                      index: 8,
                      line: 0,
                      column: 8,
                    },
                    end: {
                      index: 11,
                      line: 0,
                      column: 11,
                    },
                  },
                },
                {
                  0: 'ul',
                  1: {},
                  2: [
                    {
                      0: 'span',
                      1: {},
                      2: [
                        {
                          0: 'li',
                          1: {},
                          2: [
                            {
                              type: 'text',
                              content: 'def',
                              position: {
                                start: {
                                  index: 25,
                                  line: 0,
                                  column: 25,
                                },
                                end: {
                                  index: 28,
                                  line: 0,
                                  column: 28,
                                },
                              },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ])
    })

    test('parser() should handle ancestor breaker special case (#39.3)', () => {
      const str = '<ul><li>abc<ul><li>def<li>ghi</li></ul></li></ul>'
      const tokens = lexer(str, lexerOptions)
      const nodes = parser(tokens, {
        voidTags: [],
        closingTags: ['li'],
        closingTagAncestorBreakers: {
          li: ['ul'],
        },
      })

      expect(nodes).toEqual([
        {
          0: 'ul',
          1: {},
          2: [
            {
              0: 'li',
              1: {},
              2: [
                {
                  type: 'text',
                  content: 'abc',
                  position: {
                    start: {
                      index: 8,
                      line: 0,
                      column: 8,
                    },
                    end: {
                      index: 11,
                      line: 0,
                      column: 11,
                    },
                  },
                },
                {
                  0: 'ul',
                  1: {},
                  2: [
                    {
                      0: 'li',
                      1: {},
                      2: [
                        {
                          type: 'text',
                          content: 'def',
                          position: {
                            start: {
                              index: 19,
                              line: 0,
                              column: 19,
                            },
                            end: {
                              index: 22,
                              line: 0,
                              column: 22,
                            },
                          },
                        },
                      ],
                    },
                    {
                      0: 'li',
                      1: {},
                      2: [
                        {
                          type: 'text',
                          content: 'ghi',
                          position: {
                            start: {
                              index: 26,
                              line: 0,
                              column: 26,
                            },
                            end: {
                              index: 29,
                              line: 0,
                              column: 29,
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ])
    })
  })

  test('parser() should handle nested tables', () => {
    const str =
      '<table><tbody><tr><td><table><tbody><tr><td></td></tr></tbody></table></td></tr></tbody></table>'
    const tokens = lexer(str, lexerOptions)
    const nodes = parser(tokens, {
      voidTags: [],
      closingTags: ['tbody'],
      closingTagAncestorBreakers: {
        tbody: ['table'],
        tr: ['table'],
        td: ['table'],
      },
    })

    expect(nodes).toEqual([
      {
        0: 'table',
        1: {},
        2: [
          {
            0: 'tbody',
            1: {},
            2: [
              {
                0: 'tr',
                1: {},
                2: [
                  {
                    0: 'td',
                    1: {},
                    2: [
                      {
                        0: 'table',
                        1: {},
                        2: [
                          {
                            0: 'tbody',
                            1: {},
                            2: [
                              {
                                0: 'tr',
                                1: {},
                                2: [
                                  {
                                    0: 'td',
                                    1: {},
                                    2: [],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ])
  })

  test('parser() should ignore unnecessary closing tags', () => {
    /*
      In this case the </i> bit is unnecessary and should
      not be represented in the output nor interfere with the stack.
    */
    const str = '</i>x'
    const tokens = lexer(str, lexerOptions)
    const nodes = parser(tokens, parserOptions)

    expect(nodes).toEqual([
      {
        type: 'text',
        content: 'x',
        position: {
          start: {
            index: 4,
            line: 0,
            column: 4,
          },
          end: {
            index: 5,
            line: 0,
            column: 5,
          },
        },
      },
    ])
  })
})
