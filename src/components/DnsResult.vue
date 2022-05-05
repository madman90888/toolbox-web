<template>
  <el-table :data="pageData.data">
    <el-table-column property="zone_name" label="域名" sortable></el-table-column>
    <el-table-column property="name" label="名称" width="130" sortable></el-table-column>
    <el-table-column property="type" label="类型" width="100" sortable></el-table-column>
    <el-table-column property="content" label="解析值" sortable></el-table-column>
    <el-table-column label="结果" sortable>
      <template #default="{ row: { success, message } }">
        <el-tag
          v-if="!message"
          size="large" type="info"
        ><loading-icon /></el-tag>
        <el-tag
          v-if="message"
          size="large"
          :type="success ? 'success' : 'danger'"
        >{{ message == 'ok' ? '添加成功' : message }}</el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { DnsVo } from '@/type'
import LoadingIcon from '@/components/Loading.vue'

const pageData = defineProps<{
  data: DnsVo[];
}>()
</script>