<template>
  <el-menu
    :default-active="navUrl"
    class="el-menu-vertical-demo"
    background-color="#333744"
    text-color="#fff"
    active-text-color="#409EFF"
    router
  >
    <el-sub-menu index="1">
      <template #title>
        <el-icon><MostlyCloudy /></el-icon>
        <span>CloudFlare</span>
      </template>
      <el-menu-item index="/zone" key="/zone">
        <template #title>
          <el-icon><IconList /></el-icon>
          <span>域名列表</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/zone/batch" key="/zone/batch">
        <template #title>
          <el-icon><DocumentAdd /></el-icon>
          <span>域名操作</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/dns" key="/dns">
        <template #title>
          <el-icon><Suitcase /></el-icon>
          <span>DNS解析</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/flare/setting" key="/flare/setting">
        <template #title>
          <el-icon><Lollipop /></el-icon>
          <span>令牌设置</span>
        </template>
      </el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/file" key="/file">
        <template #title>
          <el-icon><FilesIcon /></el-icon>
          <span>文件暂存</span>
        </template>
      </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import {
  MostlyCloudy,
  List as IconList,
  DocumentAdd,
  Suitcase,
  Lollipop,
  Files as FilesIcon
} from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { ref, watch, nextTick } from 'vue'

const route = useRoute()
const navUrl = ref<string>(route.path)
watch(() => route.path, () => {
  nextTick(() => {
    navUrl.value = route.path
  })
})

</script>

