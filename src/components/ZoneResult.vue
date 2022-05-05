<template>
  <el-table :data="props.data">
    <el-table-column property="name" label="域名" width="333" sortable></el-table-column>
    <el-table-column :label="title ? title : '结果'">
      <template #default="{ row: { success, message } }">
        <el-tag
          v-if="!message"
          size="large" type="info"
        ><loading-icon /></el-tag>
        <el-tag
          v-if="message"
          size="large"
          :type="success ? 'success' : 'danger'"
        >{{ message == 'ok' ? '成功' : message }}</el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { ZoneRow } from '@/type'
import LoadingIcon from '@/components/Loading.vue'

const props = defineProps<{
  data: ZoneRow[];
  title?: string;
}>()
</script>
