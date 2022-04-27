<template>
  <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="150px"
      style="width:500px"
    >
      <el-form-item label="域名列表" prop="zoneNames">
        <el-input
          type="textarea"
          v-model="formData.zoneNames"
          :placeholder="`只能输入顶级域名，一行一个，例如：\nname1.com\nname2.com\nname3.com`"
          :autosize="{ minRows: 9, maxRows: 9 }"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit(formRef)">清空解析</el-button>
      </el-form-item>
    </el-form>
    <!-- 显示批量操作记录 -->
    <el-dialog title="添加DNS解析" v-model="control.isDialog">
      <DnsDelRes :data="pageData.resData" :loading="control.isLoading" />
    </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { validateZoneName, splitZoneName } from '@/utils'
import { deleteDns } from '@/api/flare'
import { DnsVo } from '@/type'
import DnsDelRes from '@/components/DnsDelRes.vue'

const formRef = ref<FormInstance>()
const formData: {
  zoneNames: string;
} = reactive({
  zoneNames: ''
})
// 表单验证
const rules = reactive({
  zoneNames: [
    { required: true, message: '域名列表不能为空', trigger: 'blur' },
    { validator: validateZoneName, trigger: 'blur' }
  ]
})

// 控制页面组件显示、可操作性
const control: Record<string, boolean> = reactive({
  isLoading: false,
  isDialog: false
})

// 数据存放
const pageData: {
  resData: DnsVo[]
} = reactive({
  resData: []
})

function submit(formEl: FormInstance | undefined): void {
  if (!formEl) return
  formEl.validate(async valid => {
    if (!valid) return
    control.isLoading = true
    control.isDialog = true
    // 整理数据
    const names = splitZoneName(formData.zoneNames)
    
    let res = await deleteDns(names)
    // 展示数据
    pageData.resData = res.data
    control.isLoading = false
  })
}
</script>