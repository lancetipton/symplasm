const selectTypes = [[ 'class', '.'], [ 'id', '#'], [ 'data', '[']]

const buildElSelectors = (selCheck, selAttr, key, attr) => {
  // Get the element selectors,
  let elSelect = selAttr && selAttr.selector
  
  if(key !== 'tagConvert'){
    // If it's just a string set it, and return
    // This means all items should be coverted
    // i.e. class='className'
    if(typeof selAttr === 'string' || typeof selAttr === 'function'){
      selCheck[key][attr] = selAttr
      return
    }

    // If there's no selectors, loop the selAttr and add the keys 
    // to the elementSelector
    if(selAttr && !elSelect && Object.keys(selAttr).length){
      elSelect = {}
      Object.keys(selAttr).map(key => {
        elSelect[key] = selAttr[key]
      })
    }

    if(!elSelect){
      if(selAttr === null) selCheck[key][attr] = null
      return
    }
    // Set the default for the selCheck items
    selCheck[key][attr] = selCheck[key][attr] || {}
  }
  else {
    elSelect = {}
    elSelect[attr] = selAttr
  }

  return elSelect
}


const findSelector = (hasSelectors, elSelectors, select, props, tag) => {
  let el
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
        props[key] = { ...props[key], [dataKey]: elSelectors[select] }
      }
      else {
        props[type[0]] = {
          ...props[type[0]],
          [clean(split[1])]: elSelectors[select]
        }
      }

      el = clean(split[0])
      if(el.indexOf('.') !== -1 || el.indexOf('#') !== -1 || el.indexOf('[') !== -1 ){
        console.warn(`Error: "${el}" is not formatted correctly. It contains one of ". # ["`)
      }
      // Update that we have a select type on the selector
      hasSelectors.push(true)
    }
  })

  return el
}

const setupSelectors = (selCheck, options) => {
  const selectorArr = Object.keys(selCheck)
  Object.keys(options).map(key => {
    // Only check keys from the selector Array
    if(selectorArr.indexOf(key) === -1) return
    
    const props = {}
    Object.keys(options[key]).map(attr => {
      // Get the attribute to be checked - i.e. class / id / name
      const attribute = options[key][attr]
      let elSelectors = buildElSelectors(selCheck, attribute, key, attr)
      if(!elSelectors) return

      // chache selector type
      const isArr = Array.isArray(elSelectors)
      // check that is has a value to return
      if(isArr){
        // If it's an array and there is no value, we have no way to conver the items
        // So just return
        if(!options[key][attr].value) return
        // Otherwise set the items
        selCheck[key][attr].value = options[key][attr].value
      }

      Object.keys(elSelectors).map(select => {
        // Selector tags - i.e. input.class / button#primary / select[td-select]
        const tags = isArr && elSelectors[select] || select
        // split all tags if more then 1
        const allTags = tags.split(',')
        // loop tags and split on selector type - i.e. class / id / name
        allTags.map(_tag => {
          const tag = clean(_tag)
          const hasSelectors = []
          let el = findSelector(hasSelectors, elSelectors, select, props, tag)
          // Check if a select type was found on the selector
          // This will be an array of true if it had a select type on it
          // If no class / id / attribute was found on the selector, it will be an empty array
          // ------------------ ELEMENT WITH A SELECTOR ------------------ //
          if(hasSelectors.indexOf(true) !== -1){
            const loc = key !== 'tagConvert'
              ? attr
              : el
            selCheck[key] = selCheck[key] || {}
            selCheck[key][loc] = selCheck[key][loc] || {}
            selCheck[key][loc][el] = { ...selCheck[key][loc][el], ...props }
          }
          // ------------------ ALL OF ELEMENT TYPE ------------------ //
          else {
            const loc = key !== 'tagConvert'
              ? attr
              : tag
              
            selCheck[key] = selCheck[key] || {}
            selCheck[key][loc] = selCheck[key][loc] || {}
            selCheck[key][loc][tag] = selCheck[key][loc][tag] || {}
            selCheck[key][loc][tag].all = elSelectors[select]
          }
        })
      })
    })
  })

  return selCheck
}

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