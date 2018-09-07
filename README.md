# Himalaya
http://andrejewski.github.io/himalaya
> Parse HTML into JSON

# Cell
https://www.celljs.org/
> Parse JSON into HTML

## Usage

### Node

## Example Input/Output

```html
<div class='post post-featured'>
  <p>Himalaya parsed me...</p>
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
      content: 'Himalaya parsed me...'
    }]
  }, {
    type: 'comment',
    content: ' ...and I liked it. '
  }]
}]
```
