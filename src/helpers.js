const selectTypes = [[ 'class', '.'], [ 'id', '#'], [ 'data', '[']]

const addChildren = (block, childs) => {
  const addChilds = childs.length === 1 && typeof childs[0] === 'string'
    ? childs[0]
    : childs.length && childs || null

  if(addChilds) {
    if(!block[2]) block[2] = addChilds
    else if(Array.isArray(block[2])) block[2] = block[2].concat(addChilds)
    else block[2] = [block[2]].concat(addChilds)
  }
  return block
}

const convertCase = text => {
  let converted = ''
  const text_split = text.split('-')
  if(!text_split.length) return text
  converted += text_split.shift()
  text_split.map(val => {
    converted += val.charAt(0).toUpperCase() + val.slice(1)
  })
  return converted
}

const convertStyle = styles => {
  const valObj = {}
  const val_split = styles.trim().split(';')
  
  Array.isArray(val_split) &&
    val_split[0].trim() !== '' &&
    val_split.map(item => {
      if (item.indexOf(':') !== -1) {
        const item_split = item.split(':')
        if (Array.isArray(item_split) && item_split.length === 2) {
          if (item_split[0].trim() !== '' && item_split[1].trim() !== '') {
            valObj[convertCase(item_split[0].trim())] = item_split[1].trim()
          }
        }
      }
    })

  return valObj
}


const setupSelectors = (selectorCheck, options) => {
  const selectorArr = Object.keys(selectorCheck)
  Object.keys(options).map(key => {
    // Only check keys from the selector Array
    if(selectorArr.indexOf(key) === -1) return
    
    const props = {}
    Object.keys(options[key]).map(attr => {
      // Get the attribute to be checked - i.e. class / id / name
      const attribute = options[key][attr]

      // Get the element selectors,
      let elementSelectors = attribute && attribute.selector
      
      if(key !== 'tagConvert'){
        // If it's just a string set it, and return
        // This means all items should be coverted
        // i.e. class='className'
        if(typeof attribute === 'string' || typeof attribute === 'function'){
          selectorCheck[key][attr] = attribute
          return
        }

        // If there's no selectors, loop the attribute and add the keys 
        // to the elementSelector
        if(attribute && !elementSelectors && Object.keys(attribute).length){
          elementSelectors = {}
          Object.keys(attribute).map(key => {
            elementSelectors[key] = attribute[key]
          })
        }

        if(!elementSelectors){
          if(attribute === null) selectorCheck[key][attr] = null
          return
        }
        // Set the default for the selectorCheck items
        selectorCheck[key][attr] = selectorCheck[key][attr] || {}
      }
      else {
        elementSelectors = {}
        elementSelectors[attr] = attribute
      }

      // chache selector type
      const isArr = Array.isArray(elementSelectors)
      // check that is has a value to return
      if(isArr){
        // If it's an array and there is no value, we have no way to conver the items
        // So just return
        if(!options[key][attr].value) return
        // Otherwise set the items
        selectorCheck[key][attr].value = options[key][attr].value
      }

      Object.keys(elementSelectors).map(select => {
        // Selector tags - i.e. input.class / button#primary / select[td-select]
        const tags = isArr && elementSelectors[select] || select
        // split all tags if more then 1
        const allTags = tags.split(',')
        // loop tags and split on selector type - i.e. class / id / name
        allTags.map(_tag => {
          const tag = clean(_tag)
          let el
          
          const hasSelectors = []
          // Loop selector types and add to select checker
          // This checks for a class / id / attribute on the select item
          selectTypes.map(type => {
            // If it has the passed in type in the string convert it, and add the the props
            if(tag.indexOf(type[1]) !== -1){
              const split = tag.split(type[1])
              if(type[0] === 'data'){
                const dataSplit = split[1].split('=')
                const key = clean(dataSplit[0].replace(']', ''))
                const dataKey = dataSplit[1] && clean(dataSplit[1].replace(']', '')) || ''
                props[key] = Object.assign({}, props[key], {
                  [dataKey]: elementSelectors[select]
                })
              }
              else {
                props[type[0]] = Object.assign({}, props[type[0]], {
                  [clean(split[1])]: elementSelectors[select]
                })
              }

              el = clean(split[0])
              if(el.indexOf('.') !== -1 || el.indexOf('#') !== -1 || el.indexOf('[') !== -1 ){
                console.warn(`Error: "${el}" is not formatted correctly. It contains one of ". # ["`)
              }
              // Update that we have a select type on the selector
              hasSelectors.push(true)
            }
          })

          // Check if a select type was found on the selector
          // This will be an array of true if it had a select type on it
          // If no class / id / attribute was found on the selector, it will be an empty array
          // ------------------ ELEMENT WITH A SELECTOR ------------------ //
          if(hasSelectors.indexOf(true) !== -1){
            const loc = key !== 'tagConvert'
              ? attr
              : el
            selectorCheck[key] = selectorCheck[key] || {}
            selectorCheck[key][loc] = selectorCheck[key][loc] || {}
            selectorCheck[key][loc][el] = Object.assign({}, selectorCheck[key][loc][el], props)
          }
          // ------------------ ALL OF ELEMENT TYPE ------------------ //
          else {
            const loc = key !== 'tagConvert'
              ? attr
              : tag
              
            selectorCheck[key] = selectorCheck[key] || {}
            selectorCheck[key][loc] = selectorCheck[key][loc] || {}
            selectorCheck[key][loc][tag] = selectorCheck[key][loc][tag] || {}
            selectorCheck[key][loc][tag].all = elementSelectors[select]
          }
        })
      })
    })
  })

  return selectorCheck
}

const splitKeyValue = (str, sep) => {
  const idx = str.indexOf(sep)
  if (idx === -1) return [str]
  return [str.slice(0, idx), str.slice(idx + sep.length)]
}

const clean = (str) => {
  return str && unquote(str.trim()).trim() || ''
}

const unquote = str => {
  const car = str.charAt(0)
  const end = str.length - 1
  const isQuoteStart = car === '"' || car === "'"
  if (isQuoteStart && car === str.charAt(end)) {
    return str.slice(1, end)
  }
  return str
}

export {
  addChildren,
  convertCase,
  convertStyle,
  setupSelectors,
  splitKeyValue,
  unquote
}