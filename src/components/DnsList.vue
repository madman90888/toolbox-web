<template>
  <el-table :data="props.data" v-loading="props.isLoading">
    <!-- <el-table-column property="zone_name" label="域名" sortable></el-table-column> -->
    <el-table-column property="name" label="名称" sortable></el-table-column>
    <el-table-column property="type" label="类型" width="100" sortable></el-table-column>
    <el-table-column property="content" label="解析值" sortable></el-table-column>
    <el-table-column label="操作" sortable width="100">
      <template #default="{ row }">
        <el-button type="danger" :icon="Delete" circle @click="delDns(row)" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { Dns } from '@/type'
import { Delete } from '@element-plus/icons-vue'
import { deleteDnsById } from '@/api/flare'
import { ElMessage, ElMessageBox } from 'element-plus';

const props = defineProps<{
  data: Dns[];
  isLoading: boolean;
}>()

const emit = defineEmits(['getDns'])

function delDns(dns: Dns) {
  ElMessageBox.confirm('确定要删除该DNS记录', '删除DNS记录', {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
  .then(async () => {
    const res = await deleteDnsById(dns.zone_id as string, dns.id as string)
    if (res) {
      ElMessage.success('删除成功')
      emit('getDns', { id: dns.zone_id }, { label: '域名'})
    }
  })
  .catch(() => {
    ElMessage.info("已取消删除")
  })
  
}
</script>
