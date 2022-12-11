<script setup lang="ts"></script>

<template>
  <el-menu
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="menuCom"
    default-active="2"
    text-color="#fff"
  >
    <el-menu-item index="1">
      <span>Home</span>
    </el-menu-item>
    <el-menu-item index="2">
      <span>Upload</span>
    </el-menu-item>
  </el-menu>
</template>

<style scoped>
  .menuCom {
    min-width: 120px;
    height: 100%;
    border-right: none;
  }
  .el-menu-item {
    height: 30px;
  }
</style>
