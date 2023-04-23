import { t } from '../__mocks__'

import lexer, {
  lexText,
  lexComment,
  lexTag,
  lexTagName,
  lexTagAttributes,
  lexSkipTag,
  findTextEnd,
  isWhitespaceChar,
} from '../lexer'

function ps(index) {
  return { index, line: 0, column: index }
}

describe(`lexer`, () => {
  test('lexer should return tokens', () => {
    const str = '<h1>Test case</h1>'
    const options = { childlessTags: [] }
    const tokens = lexer(str, options)
    t.deepEqual(tokens, [
      { type: 'tag-start', close: false, position: { start: ps(0) } },
      { type: 'tag', content: 'h1' },
      { type: 'tag-end', close: false, position: { end: ps(4) } },
      {
        type: 'text',
        content: 'Test case',
        position: { start: ps(4), end: ps(13) },
      },
      { type: 'tag-start', close: true, position: { start: ps(13) } },
      { type: 'tag', content: 'h1' },
      { type: 'tag-end', close: false, position: { end: ps(str.length) } },
    ])
  })

  test('lexer should parse tags beginning with alphanumeric names', () => {
    {
      const str = '2 <= 4 >'
      const options = { childlessTags: [] }
      const tokens = lexer(str, options)
      t.deepEqual(tokens, [
        {
          type: 'text',
          content: '2 <= 4 >',
          position: { start: ps(0), end: ps(str.length) },
        },
      ])
    }

    {
      const str = '2 <a 4 >'
      const options = { childlessTags: [] }
      const tokens = lexer(str, options)
      t.deepEqual(tokens, [
        { type: 'text', content: '2 ', position: { start: ps(0), end: ps(2) } },
        { type: 'tag-start', close: false, position: { start: ps(2) } },
        { type: 'tag', content: 'a' },
        { type: 'attribute', content: '4' },
        { type: 'tag-end', close: false, position: { end: ps(str.length) } },
      ])
    }
  })

  test('lexer should skip lexing the content of childless tags', () => {
    const str = '<template>Hello <img/></template>'
    const options = { childlessTags: ['template'] }
    const tokens = lexer(str, options)
    t.deepEqual(tokens, [
      { type: 'tag-start', close: false, position: { start: ps(0) } },
      { type: 'tag', content: 'template' },
      { type: 'tag-end', close: false, position: { end: ps(10) } },
      {
        type: 'text',
        content: 'Hello <img/>',
        position: { start: ps(10), end: ps(22) },
      },
      { type: 'tag-start', close: true, position: { start: ps(22) } },
      { type: 'tag', content: 'template' },
      { type: 'tag-end', close: false, position: { end: ps(str.length) } },
    ])
  })

  test('findTextEnd should find the end of the text segment', () => {
    t.is(findTextEnd('</end', 0), 0)
    t.is(findTextEnd('<= 4', 0), -1)
    t.is(findTextEnd('a<b', 0), 1)
    t.is(findTextEnd('<= <= <=', 0), -1)
  })

  test('lexText should tokenize the next text segment', () => {
    const str = 'text that ends<x>'
    const finish = str.indexOf('<')

    const state = { str, position: ps(0), tokens: [] }
    lexText(state)

    t.is(state.position.index, finish)
    const token = state.tokens[0]
    t.deepEqual(token, {
      type: 'text',
      content: 'text that ends',
      position: {
        start: ps(0),
        end: ps(14),
      },
    })
  })

  test('lexText should tokenize from the current position', () => {
    const str = 'abcdtext that ends<x>'
    const finish = str.indexOf('<')

    const state = { str, position: ps(4), tokens: [] }
    lexText(state)

    t.is(state.position.index, finish)
    const token = state.tokens[0]
    t.deepEqual(token, {
      type: 'text',
      content: 'text that ends',
      position: {
        start: ps(4),
        end: ps(18),
      },
    })
  })

  test('lexText should tokenize safely to string end', () => {
    const str = 'text that does not end'
    const finish = str.length

    const state = { str, position: ps(0), tokens: [] }
    lexText(state)

    t.is(state.position.index, finish)
    const token = state.tokens[0]
    t.deepEqual(token, {
      type: 'text',
      content: 'text that does not end',
      position: {
        start: ps(0),
        end: ps(str.length),
      },
    })
  })

  test('lexText should not add a token for an empty text', () => {
    const str = '  <x>never reach here</x>'
    const start = 2
    const finish = 2

    const state = { str, position: ps(start), tokens: [] }
    lexText(state)

    t.is(state.position.index, finish)
    t.is(state.tokens.length, 0)
  })

  test('lexComment should tokenize the next comment', () => {
    const str = '<!-- this is a comment -->abcd'
    const finish = str.indexOf('abcd')
    const state = { str, position: ps(0), tokens: [] }
    lexComment(state)

    t.is(state.position.index, finish)
    t.deepEqual(state.tokens[0], {
      type: 'comment',
      content: ' this is a comment ',
      position: {
        start: ps(0),
        end: ps(finish),
      },
    })
  })

  test('lexComment should tokenize safely to string end', () => {
    const str = '<!-- this is a comment'
    const finish = str.length
    const state = { str, position: ps(0), tokens: [] }
    lexComment(state)

    t.is(state.position.index, finish)
    t.deepEqual(state.tokens[0], {
      type: 'comment',
      content: ' this is a comment',
      position: {
        start: ps(0),
        end: ps(finish),
      },
    })
  })

  test('lexComment should tokenize from current position', () => {
    const str = 'abcd<!-- comment text --><x>'
    const finish = str.indexOf('<x>')
    const state = { str, position: ps(4), tokens: [] }
    lexComment(state)

    t.is(state.position.index, finish)
    t.deepEqual(state.tokens[0], {
      type: 'comment',
      content: ' comment text ',
      position: {
        start: ps(4),
        end: ps(finish),
      },
    })
  })

  test('lexComment should add a token for an empty comment', () => {
    const str = '<!---->'
    const finish = str.length
    const state = { str, position: ps(0), tokens: [] }
    lexComment(state)
    t.is(state.position.index, finish)
    t.deepEqual(state.tokens[0], {
      type: 'comment',
      content: '',
      position: {
        start: ps(0),
        end: ps(finish),
      },
    })
  })

  test('lexTag should tokenize the next tag', () => {
    const str = '<img/>abcd'
    const finish = str.indexOf('abcd')
    const state = { str, position: ps(0), tokens: [] }
    lexTag(state)
    t.is(state.position.index, finish)
    t.deepEqual(state.tokens, [
      { type: 'tag-start', close: false, position: { start: ps(0) } },
      { type: 'tag', content: 'img' }, // not a part of this test
      { type: 'tag-end', close: true, position: { end: ps(finish) } },
    ])
  })

  test('lexTagName should tokenize the next tag name', () => {
    const str = 'h1 id="title"> test'
    const finish = 2
    const state = { str, position: ps(0), tokens: [] }
    lexTagName(state)
    t.is(state.position.index, finish)
    t.deepEqual(state.tokens[0], {
      type: 'tag',
      content: 'h1',
    })
  })

  test('lexTagName should ignore leading not-tagname characters', () => {
    const str = '>/ div'
    const state = { str, position: ps(0), tokens: [] }
    lexTagName(state)
    t.is(state.position.index, str.length)
    t.deepEqual(state.tokens[0], {
      type: 'tag',
      content: 'div',
    })
  })

  test('lexTagAttributes should tokenize attributes until tag end', () => {
    const str = 'yes="no" maybe data-type="array">abcd'
    const finish = str.indexOf('>abcd')
    const state = { str, position: ps(0), tokens: [] }
    lexTagAttributes(state)
    t.is(state.position.index, finish)
    t.deepEqual(state.tokens, [
      { type: 'attribute', content: 'yes="no"' },
      { type: 'attribute', content: 'maybe' },
      { type: 'attribute', content: 'data-type="array"' },
    ])
  })

  test('lexTagAttributes should tokenize independent of whitespace', () => {
    const str = 'yes =   "no" maybe   data-type= "array" key ="value" >abcd'
    const finish = str.indexOf('>abcd')
    const state = { str, position: ps(0), tokens: [] }
    lexTagAttributes(state)
    t.is(state.position.index, finish)
    t.deepEqual(state.tokens, [
      { type: 'attribute', content: 'yes="no"' },
      { type: 'attribute', content: 'maybe' },
      { type: 'attribute', content: 'data-type="array"' },
      { type: 'attribute', content: 'key="value"' },
    ])
  })

  test('lexTagAttributes should handle an unset attribute name', () => {
    const str = '<div foo= bar="baz"></div>'
    const state = { str, position: ps(4), tokens: [] }
    lexTagAttributes(state)
    t.is(state.position.index, str.indexOf('></div>'))
    t.deepEqual(state.tokens, [
      { type: 'attribute', content: 'foo' },
      { type: 'attribute', content: 'bar="baz"' },
    ])
  })

  test('lexTagAttributes should handle newline separated attributes', () => {
    const str = '<div foo="bar"\nbaz="bat"></div>'
    const state = { str, position: ps(4), tokens: [] }
    lexTagAttributes(state)
    t.is(state.position.index, str.indexOf('></div>'))
    t.deepEqual(state.tokens, [
      { type: 'attribute', content: 'foo="bar"' },
      { type: 'attribute', content: 'baz="bat"' },
    ])
  })

  test('lexTagAttributes should handle tab separated attributes', () => {
    const str = '<div foo="bar"\tbaz="bat"></div>'
    const state = { str, position: ps(4), tokens: [] }
    lexTagAttributes(state)
    t.is(state.position.index, str.indexOf('></div>'))
    t.deepEqual(state.tokens, [
      { type: 'attribute', content: 'foo="bar"' },
      { type: 'attribute', content: 'baz="bat"' },
    ])
  })

  test('lexTagAttributes should handle prefixed spacing', () => {
    const str = '  \n\tyes="no">abcd'
    const finish = str.indexOf('>abcd')
    const state = { str, position: ps(0), tokens: [] }
    lexTagAttributes(state)
    t.is(state.position.index, finish)
    t.deepEqual(state.tokens, [{ type: 'attribute', content: 'yes="no"' }])
  })

  test('lexTagAttributes should handle unquoted one-word values', () => {
    const str = 'num=8 ham = steak>abcd'
    const finish = str.indexOf('>abcd')
    const state = { str, position: ps(0), tokens: [] }
    lexTagAttributes(state)
    t.is(state.position.index, finish)
    t.deepEqual(state.tokens, [
      { type: 'attribute', content: 'num=8' },
      { type: 'attribute', content: 'ham=steak' },
    ])
  })

  test('lexTagAttributes should handle incomplete attributes', () => {
    const str = 'x = >abcd'
    const finish = str.indexOf('>abcd')
    const state = { str, position: ps(0), tokens: [] }
    lexTagAttributes(state)
    t.is(state.position.index, finish)
    t.deepEqual(state.tokens, [{ type: 'attribute', content: 'x' }])
  })

  test('lexSkipTag should tokenize as text until the matching tag name', () => {
    const str = 'abcd<test><h1>Test case</h1></test><x>'
    const finish = str.indexOf('<x>')
    const state = { str, position: ps(10), tokens: [] }
    lexSkipTag('test', state)
    t.is(state.position.index, finish)
    t.deepEqual(state.tokens, [
      {
        type: 'text',
        content: '<h1>Test case</h1>',
        position: { start: ps(10), end: ps(28) },
      },
      { type: 'tag-start', close: true, position: { start: ps(28) } },
      { type: 'tag', content: 'test' },
      { type: 'tag-end', close: false, position: { end: ps(finish) } },
    ])
  })

  test('lexSkipTag should stop at the case-insensitive matching tag name', () => {
    const str = '<tEsT>proving <???> the point</TeSt><x>'
    const finish = str.indexOf('<x>')
    const state = { str, position: ps(6), tokens: [] }
    lexSkipTag('tEsT', state)
    t.is(state.position.index, finish)
    t.deepEqual(state.tokens, [
      {
        type: 'text',
        content: 'proving <???> the point',
        position: { start: ps(6), end: ps(29) },
      },
      { type: 'tag-start', close: true, position: { start: ps(29) } },
      { type: 'tag', content: 'TeSt' },
      { type: 'tag-end', close: false, position: { end: ps(finish) } },
    ])
  })

  test('lexSkipTag should auto-close if the end tag is not found', () => {
    const str = '<script>This never ends'
    const state = { str, position: ps(8), tokens: [] }
    lexSkipTag('script', state)
    t.is(state.position.index, str.length)
    t.deepEqual(state.tokens, [
      {
        type: 'text',
        content: 'This never ends',
        position: { start: ps(8), end: ps(str.length) },
      },
    ])
  })

  test('lexSkipTag should handle finding a stray "</" [resilience]', () => {
    const str = '<script>proving </nothing></script>'
    const state = { str, position: ps(8), tokens: [] }
    lexSkipTag('script', state)
    t.is(state.position.index, str.length)
    t.deepEqual(state.tokens, [
      {
        type: 'text',
        content: 'proving </nothing>',
        position: { start: ps(8), end: ps(26) },
      },
      { type: 'tag-start', close: true, position: { start: ps(26) } },
      { type: 'tag', content: 'script' },
      { type: 'tag-end', close: false, position: { end: ps(str.length) } },
    ])
  })

  test('lexSkipTag should not add an empty inner text node', () => {
    const str = '<script></script>'
    const state = { str, position: ps(8), tokens: [] }
    lexSkipTag('script', state)
    t.is(state.position.index, str.length)
    t.deepEqual(state.tokens, [
      { type: 'tag-start', close: true, position: { start: ps(8) } },
      { type: 'tag', content: 'script' },
      { type: 'tag-end', close: false, position: { end: ps(str.length) } },
    ])
  })

  test('isWhitespace should work', () => {
    t.is(isWhitespaceChar(' '), true)
    t.is(isWhitespaceChar('\n'), true)
    t.is(isWhitespaceChar('\t'), true)
    t.is(isWhitespaceChar('x'), false)
  })
})
