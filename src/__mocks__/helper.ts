const testWrapper = {
  deepEqual: (opt1, opt2) => {
    expect(opt1).toEqual(opt2)
  },
  is: (opt1, opt2) => {
    expect(opt1).toBe(opt1)
  },
}

export { testWrapper as t }
