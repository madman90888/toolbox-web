<template>
<el-form ref="formRef" :model="formData" 
    :rules="rules" label-width="150px">
    <el-form-item label="域名列表" prop="name">
      <el-row :gutter="2" style="width:300px">
        <el-col :span="24">
          <el-input
            type="textarea"
            v-model="formData.name"
            :placeholder="`只能输入顶级域名，一行一个，例如：\nname1.com\nname2.com\nname3.com`"
            :autosize="{ minRows: 11, maxRows: 9 }"
          ></el-input>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit(formRef)">删除域名</el-button>
    </el-form-item>
  </el-form>
  <!-- 显示批量操作记录 -->
  <el-dialog title="批量删除域名" v-model="control.isDialog">
    <zone-result :data="pageData.resData" />
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { validateZoneName, splitZoneName } from '@/utils'
import { deleteZone } from '@/api/flare'
import { ZoneRow } from '@/type'
import ZoneResult from '@/components/ZoneResult.vue'

const formRef = ref<FormInstance>()
const formData: {
  name: string
} = reactive({
  name: ''
})
// 表单验证
const rules = reactive({
  name: [
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

/**
 * 删除域名
 */
function submit(formEl: FormInstance | undefined): void {
  if (!formEl) return
  formEl.validate(valid => {
    if (!valid) return
    // 初始化
    pageData.resData = []
    control.isDialog = true
    // 获取域名数组，遍历发送请求
    const names = splitZoneName(formData.name)
    names.forEach(async name => {
      const item = reactive({
        name,
        success: true,
        message: ''
      })
      pageData.resData.push(item)
      // 发送请求，显示结果
      let res = await deleteZone(name)
      if (!res) return
      item.message = res.data.message
      if (!res.data.success) {
        item.success = false
      }
    })
  })
}
</script>
