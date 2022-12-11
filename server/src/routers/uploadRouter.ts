import { Router } from '../instance'
import formidable from 'formidable'
import { fileURLToPath } from 'node:url'
import { existsSync, rename, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { error, success } from '../response'
export const uploadRouter = function (instance: Router) {
  const exist = existsSync('chunk_temp')
  if (!exist) {
    mkdirSync('chunk_temp')
  }
  const form = formidable({
    multiples: false,
    uploadDir: fileURLToPath(new URL('../../chunk_temp', import.meta.url)),
  })

  form.parse(instance.req, (err, _fields, files) => {
    if (err) {
      error(err, instance)
      return
    }
    const { filepath } = files.chunk as { filepath: string }

    if (existsSync(filepath)) {
      rename(
        filepath,
        resolve(dirname(filepath), _fields.hash as string),
        (err) => {
          if (err) {
            error(err, instance)
            return
          }
          success(null, instance, {
            err_code: 0,
            message: 'success',
            result: {
              _fields: _fields,
              files: files,
            },
          })
        }
      )
    } else {
      success(null, instance, {
        err_code: 0,
        message: 'success',
        result: {
          _fields: _fields,
          files: files,
        },
      })
    }
  })
}
