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
      <zone-result :data="pageData.resData" />
    </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { validateZoneName, splitZoneName } from '@/utils'
import { deleteDns } from '@/api/flare'
import { ZoneRow } from '@/type'
import ZoneResult from '@/components/ZoneResult.vue'

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
  isDialog: false
})

// 数据存放
const pageData: {
  resData: ZoneRow[]
} = reactive({
  resData: []
})

function submit(formEl: FormInstance | undefined): void {
  if (!formEl) return
  formEl.validate(valid => {
    if (!valid) return
    pageData.resData = []
    control.isDialog = true
    // 获取域名数组
    const names = splitZoneName(formData.zoneNames)
    names.forEach(async name => {
      const item = reactive({
        name,
        success: true,
        message: ''
      })
      pageData.resData.push(item)
      let res = await deleteDns(name)
      if (!res) return
      item.message = res.data.message
      if (!res.data.success) {
        item.success = false
      }
    })
  })
}
</script>