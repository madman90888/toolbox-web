<template>
  <el-dialog v-model="control.isVisible" title="批量添加域名" :before-close="closeDialog">
    <div v-if="!pageData.resultData.length">
      <el-input
        v-model="pageData.addData"
        :rows="9"
        type="textarea"
        placeholder="以空格隔开，格式：&#10;域名 邀请码 小组 静态页 备注&#10;name.com DL888 A组 s1 第一组"
        style="margin-bottom:10px;"
      />
      <el-button type="primary" @click="create">批量新增</el-button>
    </div>
    <el-table :data="pageData.resultData" v-if="pageData.resultData.length">
    <el-table-column property="name" label="域名" sortable></el-table-column>
    <el-table-column property="code" label="邀请码" sortable></el-table-column>
    <el-table-column property="groupName" label="小组" sortable></el-table-column>
    <el-table-column property="pageName" label="静态页" sortable></el-table-column>
    <el-table-column property="remark" label="备注" sortable></el-table-column>
    <el-table-column label="结果">
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
  </el-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, reactive, watch } from 'vue'
import { DomainAdd } from '@/type'
import { createDomain } from '@/api/invitation'
import LoadingIcon from '@/components/Loading.vue'

// 父组件传递
const props = defineProps<{
  isDialog: boolean;
}>()
const emit = defineEmits(['update:isDialog'])
// 控制页面组件显示、可操作性
const control: Record<string, boolean> = reactive({
  isVisible: false
})
// 显示关闭弹窗
watch( () => props.isDialog, val => control.isVisible = val )
const closeDialog = (done: ()=>void ): void => {
  emit('update:isDialog', false)
  done()
  pageData.addData = ''
  pageData.resultData = []
}

// 页面数据
interface ResRow extends DomainAdd {
  success: boolean;
  message: string;
}
const pageData: {
  addData: string;
  resultData: ResRow[];
} = reactive({
  addData: '',
  resultData: []
})

// 事件
const create = () => {
  if (!pageData.addData || !pageData.addData.trim().length) {
    return
  }
  pageData.resultData = []
  const arr: string[] = pageData.addData.trim().split(/\n+/)
  arr.forEach(async item => {
    const t = item.trim().split(/\s+/)
    const domain: DomainAdd = {
      name: t[0],
      code: t[1] ? t[1] : '',
      groupName: t[2] ? t[2] : '',
      pageName: t[3] ? t[3] : '',
      remark : t[4] ? t[4] : ''
    }
    const resRow = reactive({
      ... domain,
      success: true,
      message: ''
    })
    pageData.resultData.push(resRow)
    const res = await createDomain(domain)
    if (!res) return
    resRow.message = res.data.message
    if (!res.data.success) resRow.success = false
  })
}
</script>

<style scoped>

</style>