export const isPlainObject = (val: any) => {
  return Object.prototype.toString.call(val) === '[object Object]'
}
export const isFunction = (val: any) => {
  return typeof val === 'function'
}
