import {parse, parseDefaults} from '../lib'
import {formatAttributes} from '../format'

describe(`format`, () => {

  test('formatAttributes() should return a key-value array', () => {
    const attributes = [
      'foo="bar"',
      'disabled',
      'cake=\'man\''
    ]
    expect(formatAttributes(attributes)).toEqual([
      {key: 'foo', value: 'bar'},
      {key: 'disabled', value: null},
      {key: 'cake', value: 'man'}
    ])
  })

  test('parse() should emit positions if includePositions is true', () => {
    expect(parse('<h1>Hello world</h1>', Object.assign({}, parseDefaults, { includePositions: true })))
    .toEqual([
      {
        type: 'element',
        tagName: 'h1',
        attributes: [],
        children: [
          {
            type: 'text',
            content: 'Hello world',
            position: {
              start: {
                index: 4,
                line: 0,
                column: 4
              },
              end: {
                index: 15,
                line: 0,
                column: 15
              }
            }
          }
        ],
        position: {
          start: {
            index: 0,
            line: 0,
            column: 0
          },
          end: {
            index: 20,
            line: 0,
            column: 20
          }
        }
      }
    ])
  })

  /*
  These tests ensure the parser and v1 formatting align.

  These tests mainly serve as a gauntlet for generic use.
  Do not add any more of these kinds of tests, instead
  test the more granular bits.
  */

  test('parse() should pass the Hello World case', () => {
    const html = '<html><h1>Hello, World</h1></html>'
    const data = [{
      type: 'element',
      tagName: 'html',
      attributes: [],
      children: [{
        type: 'element',
        tagName: 'h1',
        attributes: [],
        children: [{
          type: 'text',
          content: 'Hello, World'
        }]
      }]
    }]
    expect(data).toEqual(parse(html, parseDefaults))
  })

  test('parse() should work for mixed attributes', () => {
    const html = "<div class='section widget'><b disabled>Poop</b><p>Pee</p></div>"
    const data = [{
      type: 'element',
      tagName: 'div',
      attributes: [{
        key: 'class',
        value: 'section widget'
      }],
      children: [{
        type: 'element',
        tagName: 'b',
        attributes: [{
          key: 'disabled',
          value: null
        }],
        children: [{
          type: 'text',
          content: 'Poop'
        }]
      }, {
        type: 'element',
        tagName: 'p',
        attributes: [],
        children: [{
          type: 'text',
          content: 'Pee'
        }]
      }]
    }]
    expect(data).toEqual(parse(html, parseDefaults))
  })

  test('parse() should work for commented html', () => {
    const html = '<b><!--comment text-->words</b>'
    const data = [{
      type: 'element',
      tagName: 'b',
      attributes: [],
      children: [{
        type: 'comment',
        content: 'comment text'
      }, {
        type: 'text',
        content: 'words'
      }]
    }]
    expect(data).toEqual(parse(html, parseDefaults))
  })

  test('parse() should work for style properties', () => {
    const html = "<div style='width: 360px; height: 120px; background-color: #fff'></div>"
    const data = [{
      type: 'element',
      tagName: 'div',
      attributes: [{
        key: 'style',
        value: 'width: 360px; height: 120px; background-color: #fff'
      }],
      children: []
    }]
    expect(data).toEqual(parse(html, parseDefaults))
  })

  test('parse() should work on data-* attributes', () => {
    const html = "<div data-num=0 data-word='poop' data-cake='2'></div>"
    const data = [{
      type: 'element',
      tagName: 'div',
      attributes: [{
        key: 'data-num',
        value: '0'
      }, {
        key: 'data-word',
        value: 'poop'
      }, {
        key: 'data-cake',
        value: '2'
      }],
      children: []
    }]
    expect(data).toEqual(parse(html, parseDefaults))
  })

  test('should work on unclosed tags', () => {
    const html = '<p>One two<p>three four'
    const data = [{
      type: 'element',
      tagName: 'p',
      attributes: [],
      children: [{
        type: 'text',
        content: 'One two'
      }]
    }, {
      type: 'element',
      tagName: 'p',
      attributes: [],
      children: [{
        type: 'text',
        content: 'three four'
      }]
    }]
    expect(data).toEqual(parse(html, parseDefaults))
  })

  test('should not set custom attrs to zeroes', () => {
    const html = "<div custom-attr=''></div>"
    const data = [{
      type: 'element',
      tagName: 'div',
      attributes: [{
        key: 'custom-attr',
        value: ''
      }],
      children: []
    }]
    expect(data).toEqual(parse(html, parseDefaults))
  })

  test('custom tags should appear in the ast', () => {
    {
      const html = '<result>Hello</result>'
      const data = [{
        type: 'element',
        tagName: 'result',
        attributes: [],
        children: [{
          type: 'text',
          content: 'Hello'
        }]
      }]
      expect(data).toEqual(parse(html, parseDefaults))
    }

    {
      const html = `<div><h1>Hi there</h1><result></result></div>`
      const data = [{
        type: 'element',
        tagName: 'div',
        attributes: [],
        children: [{
          type: 'element',
          tagName: 'h1',
          attributes: [],
          children: [{
            type: 'text',
            content: 'Hi there'
          }]
        }, {
          type: 'element',
          tagName: 'result',
          attributes: [],
          children: []
        }]
      }]
      expect(data).toEqual(parse(html, parseDefaults))
    }
  })


})