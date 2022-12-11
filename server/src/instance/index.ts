import EventEmitter from 'events'
import { IncomingMessage, ServerResponse } from 'http'
import { parse, UrlWithStringQuery } from 'url'
import { RouterConstructorOptions } from '../types'
export class Router {
  req: IncomingMessage
  res: ServerResponse<IncomingMessage> | undefined
  url: UrlWithStringQuery
  emitter: EventEmitter
  routers: Map<any, any>
  search: URLSearchParams
  query: URLSearchParams
  constructor(options: RouterConstructorOptions) {
    this.req = options.req
    this.res = options.res
    this.url = parse(options.req.url as string)
    this.search = new URLSearchParams(this.url.search || '')
    this.query = new URLSearchParams(this.url.search || '')
    this.emitter = new EventEmitter()
    this.routers = new Map()
  }
  // eslint-disable-next-line no-unused-vars
  add(path: string | symbol, callback: (...args: any[]) => void) {
    this.routers.set('path', callback)
    this.emitter.on(path, callback)
  }
  remove(path: string | symbol) {
    if (this.routers.has(path)) {
      this.emitter.removeListener(path, this.routers.get('path'))
      this.routers.delete(path)
    }
  }
  removeAll() {
    this.routers.forEach(([key]) => {
      this.emitter.removeAllListeners(key)
    })
    this.routers.clear()
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  emitEmitter() {
    const _path = this.getPath()
    if (this.routers.has(_path)) {
      this.emitter.emit(_path)
    } else {
      console.log(_path)
      this.emitter.emit('error')
    }
  }
  getPath() {
    const requestPath = this.url.pathname?.replace(/^\/?/, '').split('/') || []
    return requestPath[0] ? requestPath[0] : '/'
  }
  start() {
    if (!this.req) {
      console.log('error')
    } else {
      this.emitEmitter()
    }
  }
  // eslint-disable-next-line no-unused-vars
  use(path: string, router: (instance: Router) => void) {
    const callback = router.bind(null, this)
    this.routers.set(path, callback)
    this.emitter.on(path, callback)
  }
  set(headers: Record<string, string>) {
    if (
      !headers ||
      Object.prototype.toString.call(headers) !== '[object Object]'
    ) {
      return
    }
    const keys = Object.keys(headers)
    if (keys.length === 0) {
      return
    }
    Object.keys(headers).forEach((v) => {
      this.res?.setHeader(v, headers[v])
    })
  }
}
function genRouter(instance: Router) {
  instance.res?.writeHead(200)
  instance.res?.end(JSON.stringify({ message: 'success' }))
}
function errorRouter(instance: Router) {
  instance.res?.writeHead(400)
  instance.res?.end(
    JSON.stringify({ err_code: '400', message: 'request path no exist' })
  )
}
function faviconRouter(instance: Router) {
  instance.res?.writeHead(200)
  instance.res?.end(JSON.stringify({ message: 'favicon' }))
}
export const createRouter = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>
) => {
  const instance = new Router({ req, res })
  instance.use('/', genRouter)
  instance.use('error', errorRouter)
  instance.use('favicon.ico', faviconRouter)
  return instance
}
export default {}
