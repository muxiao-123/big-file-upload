<script setup lang="ts">
  import type { Chunk, ViedoInfo } from '@/types'
  import { computed } from 'vue'
  const props = defineProps<{
    chunk: Chunk
    videoInfo: ViedoInfo
  }>()
  const emit = defineEmits(['click'])
  const canPaused = computed(() => {
    return props.chunk?.state === 'pending' && props.videoInfo?.hash
  })
  const canUplaod = computed(() => {
    return props.chunk?.state === 'none' && props.videoInfo?.hash
  })
  const canContinued = computed(() => {
    return props.chunk?.state === 'rejected' && props.videoInfo?.hash
  })
  const clickHandle = (type: string) => {
    emit('click', { type, chunk: props.chunk })
  }
</script>

<template>
  <div class="singer-upload">
    <p class="singer-upload-name">
      分片名称: {{ chunk.name.split('.')[0] + '-' + chunk.index }}
    </p>
    <div class="singer-upload-container">
      <el-progress
        :percentage="chunk.sPercentage || 0"
        :status="chunk.sPercentage === 100 ? 'success' : ''"
      ></el-progress>
      <el-button
        size="small"
        round
        type="warning"
        plain
        :disabled="!canUplaod"
        @click="clickHandle('upload')"
        >上传</el-button
      >
      <el-button
        size="small"
        round
        type="warning"
        plain
        :disabled="!canPaused"
        @click="clickHandle('paused')"
        >暂停</el-button
      >
      <el-button
        size="small"
        round
        type="primary"
        plain
        :disabled="!canContinued"
        @click="clickHandle('continued')"
        >恢复</el-button
      >
    </div>
  </div>
</template>

<style scoped>
  .singer-upload-name {
    transform-origin: left;
    transform: scale(0.7, 0.7);
  }
  .singer-upload-container {
    display: flex;
    flex-wrap: nowrap;
  }
  .el-progress {
    width: 200px;
  }
</style>
