import { parse, stringify } from '../symplasm'
import { formatAttributes } from '../stringify'

describe(`stringify`, () => {
  test('stringify() should handle simple conversions', () => {
    const str1 = '<h1>Text</h1>'
    expect(stringify(parse(str1)['2'])).toBe(str1)

    const str2 = 'Text'
    expect(stringify(parse(str2)['2'])).toBe(str2)

    const str3 = '<!--Comment-->'
    expect(stringify(parse(str3)['2'])).toBe(str3)
  })

  test('stringify() should work for void elements', () => {
    const meta = "<meta charset='utf8'>"
    expect(stringify(parse(meta)['2'], { selfClosing: false })).toBe(meta)

    const link = "<link rel='stylesheet' href='file.css'>"
    const closed = link.replace(/>$/, ` />`)

    expect(stringify(parse(link)['2'])).toBe(closed)
  })

  test('stringify() should build the class attribute properly', () => {
    const elem = "<div class='foo bar baz'></div>"
    expect(stringify(parse(elem)['2'])).toBe(elem)
  })

  test('stringify() should build data-* attributes properly', () => {
    const elem = "<div data-one='5' data-two='five'></div>"
    expect(stringify(parse(elem)['2'])).toBe(elem)
  })

  test('stringify() should build the style attribute properly', () => {
    const elem = "<div style='color: #fff; font-size: 12px;'></div>"

    expect(stringify(parse(elem)['2'])).toBe(elem)
  })

  test('stringify() should do basic escaping if a value contains either single or double quotes', () => {
    const html = '<div data-val="cake is \'good\'"></div>'
    expect(stringify(parse(html)['2'])).toBe(html)
  })

  test('stringify() should preserve whitespace', () => {
    const html = [
      '<html>    ',
      '    <h1>    Document    </h1>',
      '</html>   ',
    ].join('\n')
    expect(stringify(parse(html)['2'])).toBe(html)
  })

  test('formatAttributes should stringify attribute lists correctly', () => {
    expect(formatAttributes({})).toBe('')
    expect(formatAttributes({ disabled: null })).toBe(' disabled')
    expect(formatAttributes({ 'data-key': '123' })).toBe(" data-key='123'")
  })
})
