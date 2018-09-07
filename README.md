# Symplasm
http://andrejewski.github.io/symplasm
> Parse HTML into JSON

# Cell
https://www.celljs.org/
> Parse JSON into HTML

## Usage

### Node

## Example Input/Output

```html
<div class='post post-featured'>
  <p>Symplasm parsed me...</p>
  <!-- ...and I liked it. -->
</div>
```

```js
[{
  type: 'element',
  tagName: 'div',
  attributes: [{
    key: 'class',
    value: 'post post-featured'
  }],
  children: [{
    type: 'element',
    tagName: 'p',
    attributes: [],
    children: [{
      type: 'text',
      content: 'Symplasm parsed me...'
    }]
  }, {
    type: 'comment',
    content: ' ...and I liked it. '
  }]
}]
```
