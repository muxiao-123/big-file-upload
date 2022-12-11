import { createServer, IncomingMessage, ServerResponse } from 'http'
import { createRouter } from './instance'
import { checkRouter } from './routers/checkRouter'
import { mergeRouter } from './routers/mergeRouter'
import { uploadRouter } from './routers/uploadRouter'

const requestListener = function (req: IncomingMessage, res: ServerResponse) {
  const router = createRouter(req, res)
  // console.log(router.url)
  router.set({
    'Access-Control-Allow-Origin': 'http://127.0.0.1:5173',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,HEAD,DELETE',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
    connection: 'keep-alive',
  })
  router.use('check', checkRouter)
  router.use('merge', mergeRouter)
  router.use('upload', uploadRouter)
  router.start()
}
const server = createServer(requestListener)

const port = 9999
server.listen(port, () => {
  console.log('start')
  console.log(`http://127.0.0.1:${port}/`)
})
export {}
