export interface ChunkList {
  percentage: number
  filename: string
  chunk?: Blob
}

export interface Chunk {
  name: string
  chunk: Blob
  hash: string
  type: string
  index?: number
  percentage?: number
  sPercentage?: number
  state?: string
  [propName: string]: any
}
export interface ViedoInfo {
  name: string
  hash?: string
  type: string
  percentage: number
  sPercentage: number
  size?: number
  file?: Blob
  state?: string
  [propName: string]: any
}
export type Method = 'GET' | 'POST' | 'OPTIONS' | 'DELETE' | 'HEAD' | 'PATCH'
export interface RequestOptions {
  url: string
  data?: any
  headers?: Record<string, string>
  method?: Method
  timeout?: number
  onProgress?: (percentage: number) => void
  onSuccess?: (percentage: number) => void
  onAbort?: () => void
  onError?: () => void
  addQueue?: (xhr: XMLHttpRequest) => void
  deleteQueue?: () => void
}

export interface MergeParam {
  name: string
  hash: string
  size: number | string
  length?: number
  index?: number | string
  type: string
  [propName: string]: any
}

export interface ResponseResult {
  err_msg: number | string
  message: string
  result: { url: string } | string
}
export interface ResponseError {
  data?: any
  headers?: Record<string, string>
  config?: RequestOptions
  xhr?: XMLHttpRequest
  status?: number
  statusText?: string
  [propName: string]: any
}
