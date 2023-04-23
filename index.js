let counter = 0
const $ = selector => document.querySelector(selector)

const buttonClick = event => {
  alert(`A button was clicked`)
  console.log(event)
}

const options = {
  attrCamelCase: true,
  trim: true,
  lowerCaseTag: false,
  comments: false,
  root: {
    0: 'article',
    1: {
      class: 'foo',
    },
    2: [
      {
        0: 'div',
        1: {
          class: 'added-child',
          style: {
            padding: '10px',
            marginBottom: '5px',
            backgroundColor: '#4e9b81',
          },
        },
        2: 'Sub-Sub-Added Child',
      },
    ],
  },
  tagConvert: {
    p: (element, key, value, allNodes, children, options) => {
      return 'div'
    },
  },
  attrKeyConvert: {
    id: {
      'input, select': (element, key, value, allNodes, children, options) => {
        return 'sy-changed'
      },
      'input#super-input': 'sy-changed',
    },
    name: {
      'input#super-input, select': (
        element,
        key,
        value,
        allNodes,
        children,
        options
      ) => {
        return 'sy-changed'
      },
    },
  },
  attrValueConvert: {
    name: {
      'input, select': (element, key, value, allNodes, children, options) => {
        return 'sy-changed'
      },
    },
  },
  attrKeyAdd: {
    onclick: {
      button: (element, key, value, allNodes, children, options) => {
        return 'buttonClick(event)'
      },
    },
    style: {
      button: (element, key, value, allNodes, children, options) => {
        return {
          color: `#fff`,
          border: `none`,
          cursor: `pointer`,
          padding: `6px 8px`,
          borderRadius: `4px`,
          background: `#4e6d9b`,
        }
      },
    },
  },
  allElements: (el, tree) => {
    if (el[0] === 'input') el = { ...el, 0: 'div', 2: 'No More Input' }
    return el
  },
}

const stringOpts = {
  attrLowerCase: true,
  styleAsCss: true,
}

const init = () => {
  const html = $('#source').value || ''
  const code = Symplasm.parse(html, options)

  $('#output').innerText = JSON.stringify(code, null, 2)
  var htmlString = Symplasm.stringify(code, stringOpts)
  $('#string-html').textContent = htmlString
  $('#converted-html').innerHTML = htmlString
  $('#settings').innerText = JSON.stringify(options, null, 2)
  $('#string-opts').innerText = JSON.stringify(stringOpts, null, 2)
}

/*
 * This script is loaded at the end of the index.html file
 * This is ensure the Parkin library has been loaded
 * We use an iif to ensure it's run when the browser is ready
 */
window.addEventListener('load', async event => {
  const mod = await import('/symplasm.js')
  $('#source').onkeyup = init
  init()
})
