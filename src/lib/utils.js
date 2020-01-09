//help function that composes two functions together
const _pipe = (f, g) => (...args) => g(f(...args))

//function that composes multiple functions together by using _pipe (f, g, h, i) => i(h(g(f())))
export const pipe = (...fns) => fns.reduce(_pipe)

//function that binds the first argument to a function ahead of time
export const partial = (fn, ...args) => fn.bind(null, ...args)