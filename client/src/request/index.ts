import type { RequestOptions, ResponseError } from '../types'
import { isPlainObject, isFunction } from '@/utils'
const requestQueue = new Map()
export const request = <T>(options: RequestOptions) => {
  return new Promise<T>((resolve, reject) => {
    const mid = getMid()
    const {
      data,
      headers = {},
      method = 'GET',
      timeout = 60 * 1000,
      addQueue,
    } = options
    const xhr = new XMLHttpRequest()

    dealParams(options)
    xhr.open(method, options.url, true)
    xhr.timeout = timeout

    initHeader(headers, data)
    setHeader(headers, xhr)

    initEvent<T>(resolve, reject, xhr, options, mid)
    requestQueue.set(mid, xhr)
    if (addQueue && isFunction(addQueue)) {
      addQueue(xhr)
    }
    xhr.send(method === 'GET' ? null : data || null)
  })
}

function initHeader(headers: RequestOptions['headers'], data: any) {
  if (Object.prototype.toString.call(data) !== '[object FormData]') {
    headers!['Content-Type'] = 'application/json'
  }
}
function setHeader(headers: RequestOptions['headers'], xhr: XMLHttpRequest) {
  Object.keys(headers!).forEach((v) => {
    xhr.setRequestHeader(v, headers![v])
  })
  xhr.setRequestHeader('Accept', 'application/json, text/plain, */*')
}
function initEvent<T>(
  resolve: (value: T | PromiseLike<T>) => void,
  reject: (value: unknown) => void,
  xhr: XMLHttpRequest,
  options: RequestOptions,
  mid: number
) {
  const { onProgress, onSuccess, deleteQueue, onAbort } = options
  xhr.onerror = function (err) {
    console.log(err)
    deleteRequest(mid)
    if (deleteQueue && isFunction(deleteQueue)) {
      deleteQueue()
    }
    reject(transformErrorData(options, xhr))
  }
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 400) {
        if (onSuccess && isFunction(onSuccess)) {
          onSuccess(100)
        }
        const { responseType, responseText, response } = xhr
        const responseData =
          !responseType || responseType === 'text' || responseType === 'json'
            ? responseText
            : response
        try {
          // console.log(responseData)
          resolve(JSON.parse(responseData))
        } catch (error) {
          reject(error)
        }
        // console.log(requestQueue.size)
        deleteRequest(mid)
        if (deleteQueue && isFunction(deleteQueue)) {
          deleteQueue()
        }
      } else {
        reject(transformErrorData(options, xhr))
      }
    }
  }
  // xhr.onload = function () {}
  xhr.onprogress = function (e) {
    if (onProgress) {
      if (e.lengthComputable) {
        const percentage = parseInt(
          ((e.loaded / e.total) * 100) as unknown as string
        )
        onProgress(percentage)
      }
    }
  }
  xhr.onabort = function () {
    if (onAbort && isFunction(onAbort)) {
      onAbort()
      reject(transformErrorData(options, xhr))
    }
  }
  xhr.onload = () => {
    // console.log('onload')
  }
}
function dealParams(options: RequestOptions) {
  const { data, method, url } = options
  // if (method === 'GET' && isPlainObject(data)) {
  //   const _search = new URLSearchParams(data).toString()
  //   console.log(_search)
  // }
  if (method === 'GET' && isPlainObject(data)) {
    let search = ''
    Object.keys(data).forEach((key) => {
      search += `${key}=${data[key]}&`
    })
    search = search.replace(/&+$/, '')
    if (url.includes('?')) {
      if (!/&$/.test(url)) {
        search = '&' + search
      }
    } else {
      search = '?' + search
    }
    options.url += search
  }
}

function getMid() {
  let mid = Number(Math.random() * 1000)
  while (requestQueue.get(mid)) {
    mid = Number(Math.random() * 1000)
  }
  return mid
}
function deleteRequest(mid: number) {
  requestQueue.delete(mid)
}

function transformErrorData(config: RequestOptions, xhr: XMLHttpRequest) {
  const { response, responseType, responseText } = xhr
  const responseData =
    !responseType || responseType === 'text' || responseType === 'json'
      ? responseText
      : response
  const errorData = {} as ResponseError
  errorData.config = config
  errorData.xhr = xhr
  errorData.headers = transformHeaders(xhr.getAllResponseHeaders())
  errorData.status = xhr.status
  errorData.statusText = xhr.statusText
  try {
    errorData.data = JSON.parse(responseData)
    return errorData
  } catch (error) {
    // console.log(error)
    errorData.data = responseData
    return errorData
  }
}

function transformHeaders(val: string) {
  return val
    .split('\r\n')
    .map((value) => {
      return value.split(':')
    })
    .filter((_val) => {
      return _val.length === 2
    })
    .reduce((pre, cur) => {
      pre[cur[0]] = cur[1].trim()
      return pre
    }, {} as { [propName: string]: any })
}
