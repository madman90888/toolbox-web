<template>
  <el-table :data="pageData.data" v-loading="pageData.loading">
    <el-table-column property="zone_name" label="域名" sortable></el-table-column>
    <el-table-column label="结果" sortable>
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
import { DnsVo } from '@/type'
const pageData = defineProps<{
  data: DnsVo[];
  loading: boolean;
}>()
const emit = defineEmits(['update:data'])
watch(() => pageData.loading, (): void => {
  if (pageData.loading) {
    emit('update:data', [])
  }
})
</script>