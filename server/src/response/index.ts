import type { Router } from '../instance'

export const error = (err: any, instance: Router, data?: Record<any, any>) => {
  // instance.res?.writeHead(err.httpCode || 400, {
  //   'Content-Type': 'text/plain;charset=utf-8;',
  // })
  if (data) {
    instance.res?.writeHead(err.code)
    instance.res?.end(JSON.stringify(data))
  } else {
    instance.res?.writeHead(err.httpCode || 500, {
      'Content-Type': 'text/plain',
    })
    instance.res?.end(String(err))
  }
}
export const success = (
  _err: any,
  instance: Router,
  data: Record<any, any>
) => {
  // instance.res?.write(JSON.stringify(data), function (err) {
  //   if (err) {
  //     console.log(err)
  //   }
  // })
  instance.res?.end(JSON.stringify(data))
}

export const pathError = (_err: any, instance: Router) => {
  instance.res?.writeHead(404)
  // instance.res.
  instance.res?.end(
    JSON.stringify({ err_code: 404, message: 'request URL not exsit' })
  )
}
