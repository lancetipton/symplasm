import { parse, parseDefaults } from '../symplasm'

describe(`format`, () => {
  test('parse() should emit positions if includePositions is true', () => {
    expect(
      parse(
        '<h1>Hello world</h1>',
        Object.assign({}, parseDefaults, { includePositions: true })
      )
    ).toEqual({ 0: 'div', 1: {}, 2: [{ 0: 'h1', 1: {}, 2: 'Hello world' }] })
  })

  test('parse() should pass the Hello World case', () => {
    const html = '<html><h1>Hello, World</h1></html>'
    const data = {
      0: 'div',
      1: {},
      2: [
        {
          0: 'html',
          1: {},
          2: [{ 0: 'h1', 1: {}, 2: 'Hello, World' }],
        },
      ],
    }
    expect(data).toEqual(parse(html, parseDefaults))
  })

  test('parse() should work for mixed attributes', () => {
    const html =
      "<div class='section widget'><b disabled>Poop</b><p>Pee</p></div>"
    const data = {
      0: 'div',
      1: {},
      2: [
        {
          0: 'div',
          1: {
            class: 'section widget',
          },
          2: [
            {
              0: 'b',
              1: {
                disabled: true,
              },
              2: 'Poop',
            },
            {
              0: 'p',
              1: {},
              2: 'Pee',
            },
          ],
        },
      ],
    }

    expect(data).toEqual(parse(html, parseDefaults))
  })

  test('parse() should work for commented html', () => {
    const html = '<b><!--comment text-->words</b>'
    const data = {
      0: 'div',
      1: {},
      2: [{ 0: 'b', 1: {}, 2: [ '<!--comment text-->', 'words' ] }],
    }

    expect(data).toEqual(parse(html, parseDefaults))
  })

  test('parse() should work for style properties', () => {
    const html =
      "<div style='width: 360px; height: 120px; background-color: #fff'></div>"
    const data = {
      0: 'div',
      1: {},
      2: [
        {
          0: 'div',
          1: {
            style: { width: '360px', height: '120px', backgroundColor: '#fff' },
          },
        },
      ],
    }

    expect(data).toEqual(parse(html, parseDefaults))
  })

  test('parse() should work on data-* attributes', () => {
    const html = "<div data-num=0 data-word='poop' data-cake='2'></div>"
    const data = {
      0: 'div',
      1: {},
      2: [
        {
          0: 'div',
          1: { 'data-num': '0', 'data-word': 'poop', 'data-cake': '2' },
        },
      ],
    }
    expect(data).toEqual(parse(html, parseDefaults))
  })

  test('should work on unclosed tags', () => {
    const html = '<p>One two<p>three four'
    const data = {
      0: 'div',
      1: {},
      2: [
        { 0: 'p', 1: {}, 2: 'One two' },
        { 0: 'p', 1: {}, 2: 'three four' },
      ],
    }
    expect(data).toEqual(parse(html, parseDefaults))
  })

  test('should not set custom attrs to zeroes', () => {
    const html = "<div custom-attr=''></div>"
    const data = {
      0: 'div',
      1: {},
      2: [{ 0: 'div', 1: { 'custom-attr': true } }],
    }

    expect(data).toEqual(parse(html, parseDefaults))
  })

  test('custom tags should appear in the ast', () => {
    const html = '<result>Hello</result>'
    const data = {
      0: 'div',
      1: {},
      2: [{ 0: 'result', 1: {}, 2: 'Hello' }],
    }

    expect(data).toEqual(parse(html, parseDefaults))
  })

  test('custom tags should appear as children in the ast', () => {
    const html = `<div><h1>Hi there</h1><result></result></div>`
    const data = {
      0: 'div',
      1: {},
      2: [
        {
          0: 'div',
          1: {},
          2: [
            {
              0: 'h1',
              1: {},
              2: 'Hi there',
            },
            {
              0: 'result',
              1: {},
            },
          ],
        },
      ],
    }

    expect(data).toEqual(parse(html, parseDefaults))
  })
})
