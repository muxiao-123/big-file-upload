export const isEmpty = (val: Object) => {
  // console.log(Object.keys(val))
  return Object.keys(val).length === 0
}
export const checkParams = (
  key: string | string[],
  search: URLSearchParams
) => {
  if (Array.isArray(key)) {
    return key.every((val) => {
      return search.has(val) === true
    })
  } else {
    return search.has(key)
  }
}
