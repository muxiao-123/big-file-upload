<script setup lang="ts">
  import type {
    UploadInstance,
    UploadProps,
    UploadRawFile,
    UploadFile,
  } from 'element-plus'
  import { genFileId } from 'element-plus'
  import { reactive, ref } from 'vue'
  import type { Chunk, ViedoInfo } from '@/types'

  const emit = defineEmits(['calcchunks'])
  const fileList = reactive([])
  const chunkList = reactive<Chunk[]>([])
  const upload = ref<UploadInstance>()
  const videoInfo = reactive<ViedoInfo>({
    name: '',
    type: '',
    percentage: 0,
    sPercentage: 0,
  })
  const initVideoInfo = (uploadFile: UploadFile) => {
    videoInfo.name = uploadFile.name
    videoInfo.type = uploadFile.raw?.type || 'video/mp4'
    videoInfo.size = uploadFile.size
    videoInfo.hash = ''
    videoInfo.percentage = 0
    videoInfo.sPercentage = 0
    videoInfo.state = 'none'
  }
  const createChunkList = (uploadFile: UploadFile) => {
    const length = chunkList.length
    initVideoInfo(uploadFile)
    if (length > 0) {
      chunkList.splice(0, length)
    }
    // 10kb
    const minSize = 10 * 1024 * 1024
    const { size = 0, name, raw } = uploadFile
    let cur = 0
    while (cur < size) {
      const end = cur + minSize
      const chunk = raw?.slice(cur, end) as Blob
      chunkList.push({
        name: name,
        chunk,
        hash: name.split('.')[0],
        type: raw?.type as string,
        size: chunk.size,
        state: 'none',
      })
      cur = end
    }
    chunkList.forEach((chunk: Chunk, i) => {
      chunk.index = i
      chunk.percentage = 0
      chunk.hash = chunk.hash + '-' + i
      return chunk
    })
    emit('calcchunks', { chunkList, videoInfo })
  }
  const hadnleExceed: UploadProps['onExceed'] = (files) => {
    upload.value!.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    upload.value!.handleStart(file)
  }
  const changeHandle = (uploadFile: UploadFile) => {
    if (uploadFile) {
      createChunkList(uploadFile)
    }
  }
</script>

<template>
  <div class="container container-top">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>上传到本地文件</span>
          <el-button class="button" text>真的吗</el-button>
        </div>
      </template>
      <el-upload
        ref="upload"
        v-model:file-list="fileList"
        action=""
        class="native-upload"
        drag
        accept="image/png, image/jpeg, video/avi, video/mp4"
        :limit="1"
        :auto-upload="false"
        :on-exceed="hadnleExceed"
        :on-change="changeHandle"
      >
        <i class="avatar-uploader-icon">+</i>
        <!-- <el-button type="primary" plain>点击上传到本地</el-button> -->
        <template #tip>
          <div class="el-upload__tip">限制为1个文件,新文件会覆盖掉旧文件</div>
        </template>
      </el-upload>
    </el-card>
  </div>
</template>

<style scoped>
  .container:deep(.el-card__header) {
    padding: 0 20px;
  }
  .card-header {
    padding: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .text {
    font-size: 14px;
  }
  .box-card {
    margin: 10px;
  }
  .box-card:deep(.el-upload-dragger) {
    padding: 10px;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
</style>
