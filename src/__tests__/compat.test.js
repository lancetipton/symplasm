
import {
  startsWith,
  endsWith,
  stringIncludes,
  arrayIncludes
} from '../compat'

describe(`compat`, () => {

  test('startsWith() should pass simple cases', () => {
    const str = 'To be, or not to be, that is the question.'
    expect(startsWith(str, 'To be')).toBe(true)
    expect(startsWith(str, 'not to be')).toBe(false)
    expect(startsWith(str, 'not to be', 10)).toBe(true)
  })

  test('endsWith() should pass simple cases', () => {
    const str = 'To be, or not to be, that is the question.'
    expect(endsWith(str, 'question.')).toBe(true)
    expect(endsWith(str, 'to be')).toBe(false)
    expect(endsWith(str, 'to be', 19)).toBe(true)
  })

  test('stringIncludes() should pass simple cases', () => {
    const str = 'To be, or not to be, that is the question.'
    expect(stringIncludes(str, 'To be')).toBe(true)
    expect(stringIncludes(str, 'question')).toBe(true)
    expect(stringIncludes(str, 'nonexistent')).toBe(false)
    expect(stringIncludes(str, 'To be', 1)).toBe(false)
    expect(stringIncludes(str, 'TO BE')).toBe(false)
  })

  test('arrayIncludes() should pass simple cases', () => {
    expect(arrayIncludes([1, 2, 3], 2)).toBe(true)
    expect(arrayIncludes([1, 2, 3], 4)).toBe(false)
    expect(arrayIncludes([1, 2, 3], 3, 3)).toBe(false)
    expect(arrayIncludes([1, 2, 3], 3, -1)).toBe(true)
    expect(arrayIncludes([1, 2, NaN], NaN)).toBe(true)

    expect(arrayIncludes(['tag', 'name', 'test'], 'test')).toBe(true)
    expect(arrayIncludes(['tag', 'name', 'test'], 'name')).toBe(true)
    expect(arrayIncludes(['tag', 'name', 'test'], 'none')).toBe(false)
  })
  
})
