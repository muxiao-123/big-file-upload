import { Router } from '../instance'
// import formidable from 'formidable'
import { error, success } from '../response'
import { existsSync, realpath } from 'node:fs'
import { checkParams } from '../utils'

export const checkRouter = function (instance: Router) {
  const { search } = instance
  if (!checkParams(['hash', 'name', 'type'], search)) {
    error({ code: 400 }, instance, {
      err_code: 400,
      message: 'requset not params',
    })
    return
  }
  const hash = search.get('hash') as string
  const type = search.get('name')?.split('.')[1] || ''
  const exist = existsSync(`upload/${hash}.${type}`)
  // console.log(realPath)
  if (exist) {
    realpath(`upload/${hash}.${type}`, function (err, resolvePath) {
      if (err) {
        error({ code: 500 }, instance)
        return
      }
      success(null, instance, {
        err_code: 0,
        message: 'success',
        result: {
          url: resolvePath,
        },
      })
    })
  } else {
    console.log('fasdf')
    success(null, instance, {
      erro_code: 0,
      message: 'file no exsit',
      result: { url: '' },
    })
  }
}
