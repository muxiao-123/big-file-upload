import { IncomingMessage, ServerResponse } from 'http'

export interface RouterConstructorOptions {
  req: IncomingMessage
  res: ServerResponse<IncomingMessage>
}
// export interface Router {
//   req: IncomingMessage
//   res: ServerResponse<IncomingMessage> | undefined
//   url: UrlWithStringQuery
//   emitter: EventEmitter
//   routers: Map<any, any>
//   search: URLSearchParams
//   query: URLSearchParams
//   new: (options: RouterConstructorOptions) => void
//   add: (path: string | symbol, callback: (...args: any[]) => void) => void
//   remove: (path: string | symbol) => void
//   removeAll: () => void
//   emitEmitter: (path?: string) => void
//   getPath: () => string
//   start: () => void
//   use: (path: string, router: (instance: Router) => void) => void
// }
