<script setup lang="ts">
  import type { Chunk, ViedoInfo } from '@/types'
  defineProps<{
    chunkList?: Chunk[]
    videoInfo?: ViedoInfo
  }>()
  const colorFn = (percentage: number) => {
    if (percentage < 20) {
      return '#f56c6c'
    } else if (percentage < 40) {
      return '#e6a23c'
    } else if (percentage < 60) {
      return '#5cb87a'
    } else if (percentage < 80) {
      return '#1989fa'
    } else if (percentage <= 100) {
      return '#6f7ad3'
    }
  }
</script>

<template>
  <div class="container container-top">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>文件分片进度</span>
          <el-button class="button" text>看我操作</el-button>
        </div>
      </template>
      <div class="card-container">
        <div class="file-info">
          <span class="name file-info-item">名称: {{ videoInfo?.name }}</span>
          <span class="size file-info-item">大小: {{ videoInfo?.size }}</span>
          <span class="type file-info-item">类型: {{ videoInfo?.type }}</span>
          <span class="hash file-info-item"
            >哈希: {{ videoInfo?.hash || 'none' }}</span
          >
        </div>
        <el-progress
          :percentage="videoInfo?.percentage || 0"
          :color="colorFn"
          type="circle"
        ></el-progress>
      </div>
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
  .card-container {
    display: flex;
    flex-wrap: nowrap;
  }
  .file-info {
    flex: 1;
    padding: 10px 0;
    display: flex;
    flex-direction: column;
  }
  .file-info .file-info-item {
    font-size: 14px;
    transform-origin: left;
    transform: scale(0.8, 0.8);
  }
  .file-info .name {
    padding-left: 0;
    color: var(--el-color-primary);
  }
  .file-info .type {
    color: var(--el-color-warning);
  }
  .file-info .size {
    color: var(--el-color-danger);
  }
  .file-info .hash {
    color: var(--el-color-info);
    /* border-right: none; */
  }
  .progress-box {
    display: flex;
    flex-wrap: wrap;
  }
  .progress-box-item {
    flex: 1;
    min-width: 200px;
    max-width: 350px;
  }
  .progress-box-item .name {
    font-size: 14px;
    color: var(--el-color-info-light-3);
  }
</style>
