<script setup lang="ts">
  import type { Chunk, ViedoInfo } from '@/types'
  import { computed } from 'vue'
  import SingerUpload from '@/components/SingerUpload.vue'

  const props = defineProps<{
    chunkList: Chunk[]
    videoInfo: ViedoInfo
  }>()
  const emit = defineEmits(['upload', 'chunkUpload'])
  const clickHandle = (type: string) => {
    console.log(type)
    emit('upload', { type })
  }
  const canPaused = computed(() => {
    return props.videoInfo.state === 'pending' && props.videoInfo?.hash
  })
  const canContinued = computed(() => {
    return props.videoInfo.state === 'rejected' && props.videoInfo?.hash
  })
  const canUplaod = computed(() => {
    return props.videoInfo.state === 'none' && props.videoInfo?.hash
  })
  const clickChunkHandle = (data: { chunk: Chunk; type: string }) => {
    emit('chunkUpload', data)
  }
</script>

<template>
  <div class="container container-top">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>上传文件到服务器</span>
          <div>
            <el-button
              @click="clickHandle('upload')"
              class="button"
              type="success"
              plain
              size="small"
              :disabled="!canUplaod"
              >上传</el-button
            >
            <el-button
              @click="clickHandle('pause')"
              class="button"
              type="warning"
              plain
              size="small"
              :disabled="!canPaused"
              >暂停</el-button
            >
            <el-button
              @click="clickHandle('continue')"
              class="button"
              type="primary"
              plain
              size="small"
              :disabled="!canContinued"
              >继续</el-button
            >
          </div>
        </div>
      </template>
      <div class="card-body">
        <div class="all-progress-box">
          <p class="all-progress-box-name">总进度</p>
          <el-progress
            :percentage="videoInfo?.sPercentage"
            type="circle"
          ></el-progress>
        </div>
        <div class="progress-box">
          <singer-upload
            v-for="chunk in chunkList"
            :key="chunk.index"
            :chunk="chunk"
            :video-info="videoInfo"
            @click="clickChunkHandle"
            class="progress-box-item"
          ></singer-upload>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
  .container:deep(.el-card__header) {
    padding: 0 20px;
  }
  .card-header {
    padding: 10px 0;
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
  .box-card:deep(.el-card__body) {
    padding: 5px 10px;
  }
  .card-body {
    display: flex;
  }
  .all-progress-box {
    min-width: 200px;
    max-width: 400px;
    height: 200px;
    display: flex;
    align-items: center;
  }
  .all-progress-box-name {
    flex-shrink: 0;
    height: 100%;
    transform-origin: left top;
    transform: scale(0.7, 0.7);
  }
  .progress-box {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
  }
  .progress-box-item {
    flex: 1;
  }
</style>
