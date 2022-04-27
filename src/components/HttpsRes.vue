<template>
  <el-table :data="pageData.data" v-loading="pageData.loading">
    <el-table-column property="zoneName" label="域名" width="333" sortable></el-table-column>
    <el-table-column label="自动跳转HTTPS" sortable>
      <template #default="{ row: { auto: { success, message }} }">
        <el-tag
          size="large"
          :type="success ? 'success' : 'danger'"
        >{{ success ? '成功' : message }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="始终使用HTTPS" sortable>
      <template #default="{ row: { always: { success, message }} }">
        <el-tag
          size="large"
          :type="success ? 'success' : 'danger'"
        >{{ success ? '成功' : message }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="SSL级别" sortable>
      <template #default="{ row: { always: { success, message }} }">
        <el-tag
          size="large"
          :type="success ? 'success' : 'danger'"
        >{{ success ? '成功' : message }}</el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, watch } from 'vue'
import { HttpsAndSsl } from '@/type'
const pageData = defineProps<{
  data: HttpsAndSsl[];
  loading: boolean;
}>()

// 重置数据
const emit = defineEmits(['update:data'])
watch(() => pageData.loading, (): void => {
  if (pageData.loading) {
    emit('update:data', [])
  }
})
</script>

<style scoped>
</style>