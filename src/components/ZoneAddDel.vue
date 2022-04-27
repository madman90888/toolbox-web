<template>
  <el-table :data="pageData.data" v-loading="pageData.loading">
    <el-table-column property="name" label="域名" width="333" sortable></el-table-column>
    <el-table-column label="结果">
      <template #default="{ row: { success, message } }">
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
import { IZoneAddDel } from '@/type'
const pageData = defineProps<{
  data: IZoneAddDel[];
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
