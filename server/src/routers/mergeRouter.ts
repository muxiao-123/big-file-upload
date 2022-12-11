// import formidable from 'formidable'
import {
  readdir,
  createReadStream,
  unlinkSync,
  createWriteStream,
  rmdir,
} from 'node:fs'
import { resolve } from 'node:path'
import { Router } from '../instance'
import { error, success } from '../response'
import { checkParams } from '../utils'

export const mergeRouter = function (instance: Router) {
  const { search } = instance
  if (!checkParams(['hash', 'name', 'size'], search)) {
    error({ code: 400 }, instance, {
      err_code: 400,
      message: 'requset not params',
    })
    return
  }
  // eslint-disable-next-line no-unused-vars
  readdir('chunk_temp', function (err, files) {
    if (err) {
      error(err, instance)
      return
    }
    const mergeList = files.filter((v) => {
      return v.includes(search.get('hash') as string)
    })

    mergeList.sort((a, b) => {
      return (
        (a.split('-')[1] as unknown as number) -
        (b.split('-')[1] as unknown as number)
      )
    })
    // eslint-disable-next-line no-unused-vars
    const [_filename, type] = (search.get('name') as string).split('.')

    let size = Number(search.get('size'))
    mergeList.forEach((chunkPath, index) => {
      const writeStream = createWriteStream(
        resolve(`upload/${search.get('hash')}.${type}`),
        {
          start: index * 10 * 1024 * 1024,
        }
      )
      writeStream.on('close', function (err: any) {
        if (err) {
          error(err, instance)
          return
        }
        size = size - writeStream.bytesWritten
        if (size === 0) {
          rmdir('chunk_temp', function (err) {
            if (err) {
              error(err, instance)
              return
            }
            success(null, instance, {
              err_code: 0,
              result: {
                url: writeStream.path,
              },
              message: 'success upload',
            })
          })
        }
      })
      const readStream = createReadStream(resolve(`chunk_temp/${chunkPath}`))

      readStream.on('end', () => {
        unlinkSync(resolve(`chunk_temp/${chunkPath}`))
      })
      readStream.pipe(writeStream)
    })
  })
}
