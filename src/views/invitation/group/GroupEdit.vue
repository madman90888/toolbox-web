<template>
  <el-dialog v-model="control.isVisible" title="添加小组" :before-close="closeDialog">
    <el-form :model="formData" label-width="120px" style="width:400px;">
      <el-form-item label="小组名">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="formData.remark" />
      </el-form-item>
      <el-form-item >
        <el-button type="primary" @click="create">保存</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, reactive, watch, toRaw } from 'vue'
import { Groups } from '@/type'
import { updateGroup } from '@/api/invitation'
import { ElMessage } from 'element-plus'

// 父组件传递
const props = defineProps<{
  isDialog: boolean;
  data: Groups | null;
}>()
const emit = defineEmits(['update:isDialog'])
// 控制页面组件显示、可操作性
const control: Record<string, boolean> = reactive({
  isVisible: false
})
// 显示关闭弹窗
watch(() => props.isDialog, val => {
  if(control.isVisible != val) control.isVisible = val
  if (val && props.data) {
    formData.id = props.data.id
    formData.name = props.data.name
    formData.remark = props.data.remark
  }
})
watch(() => control.isVisible, val => {
  if (props.isDialog != val) emit('update:isDialog', val)
})
const closeDialog = (done: ()=>void ): void => {
  emit('update:isDialog', false)
  done()
}
const formData: Groups = reactive({
  id: -1,
  name: '',
  remark: ''
})

// 事件
const create = async () => {
  if (!formData.name) {
    ElMessage.warning('组名不能为空')
    return
  }
  const res = await updateGroup(toRaw(formData))
  if (!res) return
  ElMessage.success('修改成功')
  control.isVisible = false
}
</script>
