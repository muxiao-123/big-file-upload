<script setup lang="ts">
  import { toRaw, reactive } from 'vue'
  import { request } from '../request'
  import type { Chunk, ViedoInfo, MergeParam, ResponseResult } from '../types'
  import MenuCom from '@/components/MenuCom.vue'
  import NaviveUpload from '@/components/NativeUpload.vue'
  import TimeDivide from '@/components/TimeDivide.vue'
  import ServerUpload from '@/components/ServerUpload.vue'
  import { ElMessage } from 'element-plus'
  import 'element-plus/theme-chalk/el-message.css'

  const chunkList = reactive<Chunk[]>([])
  const ajaxQueue = reactive<Map<any, XMLHttpRequest>>(new Map())
  const videoInfo = reactive<ViedoInfo>({
    name: '--|--',
    type: '--|--',
    percentage: 0,
    size: 0,
    sPercentage: 0,
    state: 'none',
  })

  const messageModal = (type: 'success' | 'error', message: string) => {
    ElMessage({ type, message, duration: 2000 })
  }
  const checkRequest = async (type: string, chunk?: Chunk) => {
    const data = {} as MergeParam
    if (type === 'all') {
      data.name = videoInfo.name
      data.hash = videoInfo.hash as string
      data.size = videoInfo.size as unknown as string
      data.type = 'file'
    } else {
      data.name = chunk?.name || ''
      data.hash = chunk?.hash || ''
      data.size = chunk?.chunk.size || 0
      data.index = chunk?.index || 0
      data.type = 'chunk'
    }
    return await request<ResponseResult>({
      url: '/api/check',
      method: 'GET',
      data,
    })
  }
  const checkMergeStatus = () => {
    return chunkList.every((chunk) => {
      return chunk.state === 'fulfilled'
    })
  }
  // videoInfo
  const checkPercentage = () => {
    videoInfo.state = 'fulfilled'
    if (videoInfo.sPercentage !== 100) {
      videoInfo.sPercentage = 100
    }
  }
  const uploadChunkServer = (diff: number, chunk: Chunk, index: number) => {
    const formData = new FormData()
    formData.append('name', chunk.name)
    formData.append('chunk', chunk.chunk)
    formData.append('hash', chunk.hash)
    formData.append('type', chunk.type)
    formData.append('size', chunk.size)
    const progressHandle = (percentage: number) => {
      chunk.sPercentage = percentage
    }
    const successHandle = (percentage: number) => {
      if (percentage === 100) {
        videoInfo.sPercentage = (videoInfo.sPercentage || 0) + diff
      }
      if (chunkList[index].state === 'pending') {
        chunkList[index].state = 'fulfilled'
      }
    }
    const onAbort = () => {
      chunkList[index].state = 'rejected'
    }
    const onError = () => {
      if (chunkList[index].state === 'pending') {
        chunkList[index].state = 'rejected'
      }
    }
    const addQueue = (xhr: XMLHttpRequest) => {
      ajaxQueue.set(index, xhr)
      chunk.state = 'pending'
    }
    const deleteQueue = () => {
      ajaxQueue.delete(index)
    }
    const _request = request({
      url: '/api/upload',
      method: 'POST',
      data: formData,
      onProgress: progressHandle,
      onSuccess: successHandle,
      onAbort,
      onError,
      addQueue,
      deleteQueue,
    })
    return _request
  }
  const uploadServer = async () => {
    const diff = Math.floor(100 / chunkList.length)
    const requestList = chunkList.reduce((pre, chunk, index) => {
      if (chunk.state !== 'fulfilled') {
        const _request = uploadChunkServer(diff, chunk, index)
        pre.push(_request)
      }
      return pre
    }, [] as any[])
    videoInfo.state = 'pending'
    return Promise.all(requestList)
  }
  const mergeRequest = () => {
    const data = {} as MergeParam
    data.name = videoInfo.name
    data.hash = videoInfo.hash as string
    data.size = videoInfo.size as unknown as string
    data.length = chunkList.length
    return request<ResponseResult>({
      url: '/api/merge',
      method: 'GET',
      data,
    })
  }
  // continue paused
  const pauseUpload = async (type: string) => {
    if (type === 'continue') {
      try {
        await uploadServer()
        const flag = chunkList.every((chunk) => {
          return chunk.state === 'fulfilled'
        })
        if (flag) {
          checkPercentage()
          const mergeResult = await mergeRequest()
          messageModal('success', (mergeResult.result as { url: string }).url)
        }
      } catch (error) {
        videoInfo.state = 'rejected'
        console.log(error)
        messageModal('error', (error as { message: string }).message || 'error')
      }
      return
    }
    ajaxQueue.forEach((xhr: XMLHttpRequest) => {
      if (type === 'pause') {
        xhr.abort()
      }
    })
    ajaxQueue.clear()
  }

  const uploadHandle = async (params: { type: string }) => {
    const { type } = params
    if (type === 'pause') {
      pauseUpload('pause')
      return
    }
    if (type === 'continue') {
      pauseUpload('continue')
      return
    }
    try {
      const checkResult = await checkRequest('all')
      const diff = Math.floor(100 / chunkList.length)

      if ((checkResult.result as { url: string }).url) {
        chunkList.forEach((chunk) => {
          chunk.sPercentage = 100
          videoInfo.sPercentage += diff
          chunk.state = 'fulfilled'
        })
        checkPercentage()
        ElMessage({
          type: 'success',
          message: (checkResult.result as { url: string }).url,
          duration: 2000,
        })
        return
      }
      await uploadServer()
      const flag = checkMergeStatus()
      if (flag) {
        checkPercentage()
        const mergeResult = await mergeRequest()
        messageModal('success', (mergeResult.result as { url: string }).url)
      }
    } catch (error) {
      messageModal('error', (error as { message: string }).message || 'error')
      videoInfo.state = 'rejected'
      console.log(error)
    }
  }
  const chunkUploadHandle = async (data: { type: string; chunk: Chunk }) => {
    try {
      if (data.type === 'paused') {
        const xhr = ajaxQueue.get(data.chunk.index)
        xhr && xhr.abort()
      } else {
        const diff = Math.floor(100 / chunkList.length)
        await uploadChunkServer(diff, data.chunk, data.chunk.index as number)
        if (checkMergeStatus()) {
          checkPercentage()
          const mergeResult = await mergeRequest()
          messageModal('success', (mergeResult.result as { url: string }).url)
        }
      }
    } catch (error) {
      console.log(error)
      messageModal('error', (error as { message: string }).message || 'error')
    }
  }
  const calcHash = () => {
    return new Promise((resolve, reject) => {
      const worker = new Worker('workers/index.js')
      worker.postMessage({ chunkList: toRaw(chunkList) })
      worker.onmessage = function (e) {
        const { percentage, hash, index } = e.data
        chunkList[index].percentage = 100
        videoInfo.percentage = parseInt(percentage)
        if (hash) {
          videoInfo.hash = hash
          chunkList.forEach((chunk) => {
            if (hash) {
              chunk.hash += '-' + hash
            }
          })
          resolve(hash)
        }
      }
      worker.onerror = function (e) {
        reject(e)
      }
    })
  }
  const calcDivideHandle = async (data: {
    chunkList: Chunk[]
    videoInfo: ViedoInfo
  }) => {
    const length = chunkList.length
    if (length > 0) {
      videoInfo.hash = 'none'
      console.log(length)
      chunkList.splice(0, length)
    }
    chunkList.push(...data.chunkList)
    Object.assign(videoInfo, data.videoInfo)
    await calcHash()
  }
</script>

<template>
  <main class="home">
    <aside class="home-left">
      <MenuCom></MenuCom>
    </aside>
    <main class="home-container">
      <div class="home-container-top">
        <NaviveUpload
          class="navive-upload"
          @calcchunks="calcDivideHandle"
        ></NaviveUpload>
        <TimeDivide
          class="timer-divide"
          :chunk-list="chunkList"
          :video-info="videoInfo"
        ></TimeDivide>
      </div>
      <ServerUpload
        :chunk-list="chunkList"
        :video-info="videoInfo"
        @upload="uploadHandle"
        @chunkUpload="chunkUploadHandle"
      ></ServerUpload>
    </main>
  </main>
</template>
<style scoped>
  .home {
    height: 100%;
    display: flex;
    flex-wrap: nowrap;
  }
  .home-left {
    background-color: brown;
  }
  .home-container {
    min-width: 600px;
    height: 100%;
    flex: 1;
    overflow-y: auto;
  }
  .home-container-top {
    display: flex;
    flex-wrap: wrap;
    min-width: 600px;
  }
  .navive-upload {
    flex: 1;
    min-width: 300px;
    max-width: 600px;
  }
  .timer-divide {
    flex: 1;
    min-width: 400px;
  }
</style>
