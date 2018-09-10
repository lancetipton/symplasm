# Symplasm
> https://github.com/lancetipton/symplasm

> Parse HTML into td-VDom JS Object

> Works in browser and Node.js

## Example

### Input HTML String
```html
<div class='post post-featured'>
  <p>Symplasm feels good...</p>
  <!-- ...like a dream come true. -->
</div>
```

### Export JS Object
```js
{
  0: 'div',
  1: {}
  2: [
    {
      0: 'div',
      1: {
        class: 'post post-featured'
      },
      2: [
        {
          0: 'p',
          1: {},
          2: 'Symplasm feels good...'
        },
        '<!--...like a dream come true.-->',
      ]
      
    }
  ]
}
```
## To Use

**symplasm.parse**
* params
  * htmlString - string of html content
  * Options - JS object ( See options below )

```js
import symplasm from 'symplasm'

cosnt jsObject = symplasm.parse( htmlString, options )

```

**symplasm.stringify**
* params
  * jsObject - a td-VDom formatted object to be converted into an html string

```js

cosnt htmlString = symplasm.stringify( jsObject )

```

## Options

**Default Options**
```js
{
  root: {
    0: 'div',
  },
  tagConvert: {},
  attrKeyConvert: {},
  attrValueConvert: {},
  attrKeyAdd: {},
  trim: false,
  lowerCaseTag: true
}
```

* root

  * Override the default div object
  * Must be in td-VDom format
  * Any children add in the 2 position, will be added first
  
* tagConvert

  * Key / value pair of tags to be converted during the parse
  * Key is the tag to be converted
  * Value is the tag to convert to
    * Can be `tag type / element selector as a string` / `function` / `td-VDom object`
    * `Function` must retrun a `tag type as a string` or `td-VDom object`
    * Any children of the td-VDom object will be added before other children
    * Example
      ```js
        {
          // only paragraph with span-text class with be converted to spans
          'p.span-text': 'span',
          // all articles will be converted to section, and have the class article
          article: {
            0: 'section',
            1: { class: 'article' },
            2: 'I am added as the first child'
          },
          // all buttons will be converted into div's
          button: function(element, key, value, allNodes, children, options){
            return 'div'
          }
        }
      ```
      
* attrKeyConvert

  * Key / value pair of property keys to be converted during the parse
  * Key is the key to be converted
    * Select multiple elements by using a comma
  * Value is the property key to convert to
    * Can be `string` / `function` / `object`
      * `Functions` must retrun a `string`
      * If it's an object
        * Object can have a selector array of items to update, and a value
          * Value can be a `string` / `function` - **must retrun a string**
        * **OR**
        * Sub items can be defined to allow only updating the specified elements
        * Must be a Key / value pair to be converted during the parse
        * Key must be an `tag type / element selector as a string`
        * Value can be a `string` / `function` - **must retrun a string**
  * Example
    ```js
      {
        // All class attributes will be converted to className
        class: 'className',
        id: {
          // all input id key property will be converted to td-input attribute
          input: function(element, key, value, allNodes, children, options){
            return 'td-input'
          },
          // all selects with the class 'no-id', will have their id converted to no-select-id attribute
          'select.no-id': 'no-select-id'
          // al buttons and divs will have their id converted to updates-both-elements
          'button,div': 'updates-both-elements'
        },
        name: {
          selector: ['button', 'section'],
          value: 'name-key-converted'
        }
      }
    ```

* attrKeyConvert

  * Same as attrKeyConvert, but for the value
      * Select multiple elements by using a comma
  * Example
    ```js
      {
        class: {
          // buttons with the td-button attribute, and divs with td-root attribue will have their
          // class  attribute value updated to 'td-replaced-' + element[0]
          'button[td-button],div[td-root]': function(element, key, value, allNodes, children, options){
            return 'td-replaced-' + element[0]
          },
        },
        name: {
          // all inputs will have their name attribute value updated to 'td-' + element[0]
          input: function(element, key, value, allNodes, children, options){
            return 'td-' + element[0]
          },
          'select.class-select': 'td-select-name'
        }
      }
    ```

* attrKeyAdd

  * Same as attrKeyConvert, but to add a key value pair
  * Example
    ```js
      {
        'onclick': {
          // all buttons with the td-button attribute will have an onclick attribute added
          selector: ['button[td-button]'],
          value: 'buttonClick(event)'
        }
        'id': {
          // all inputs with the class add-id will get an id added
          // and the value will be what the function returns
          'input.add-id': function(element, key, value, allNodes, children, options){
            return uuid.v4()
          },
        }
      }
    ```