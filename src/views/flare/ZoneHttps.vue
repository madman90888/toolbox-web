<template>
<el-form ref="formRef" :model="formData" 
    :rules="rules" label-width="200px">
    <!-- HTTPS设置 -->
      <el-form-item label="自动跳转HTTPS">
        <el-switch v-model="formData.auto"></el-switch>
      </el-form-item>
      <el-form-item label="始终使用HTTPS">
        <el-switch v-model="formData.always"></el-switch>
      </el-form-item>
      <el-form-item label="SSL级别">
        <el-select v-model="formData.ssl" placeholder="请选择SSL级别">
          <el-option label="关闭" value="off"></el-option>
          <el-option label="灵活" value="flexible"></el-option>
          <el-option label="完全" value="full"></el-option>
          <el-option label="严格" value="strict"></el-option>
        </el-select>
      </el-form-item>
    <el-form-item label="域名列表" prop="zoneNames">
      <el-row :gutter="2" style="width:300px">
        <el-col :span="24">
          <el-input
            type="textarea"
            v-model="formData.zoneNames"
            :placeholder="`只能输入顶级域名，一行一个，例如：\nname1.com\nname2.com\nname3.com`"
            :autosize="{ minRows: 11, maxRows: 9 }"
          ></el-input>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit(formRef)">更新设置</el-button>
    </el-form-item>
  </el-form>
  <!-- 显示批量操作记录 -->
  <el-dialog title="HTTP/SSL设置" v-model="control.isDialog">
    <HttpsRes :data="pageData.resData"
      :loading="control.isLoading" />
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, toRaw } from 'vue'
import type { FormInstance } from 'element-plus'
import { validateZoneName, splitZoneName } from '@/utils'
import { updateZone } from '@/api/flare'
import { ZoneBatch, HttpsAndSsl } from '@/type'
import HttpsRes from '@/components/HttpsRes.vue'

const formRef = ref<FormInstance>()
const formData: {
  zoneNames: string | string[];
  auto?: boolean;
  always?: boolean;
  ssl?: 'off' | 'flexible' | 'full' | 'strict' | '';
} = reactive({
  zoneNames: '',
  auto: true,
  always: true,
  ssl: ''
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
  resData: HttpsAndSsl[]
} = reactive({
  resData: []
})

/**
 * 删除域名
 */
function submit(formEl: FormInstance | undefined): void {
  if (!formEl) return
  formEl.validate(async valid => {
    if (!valid) return
    control.isLoading = true
    control.isDialog = true
    // 整理数据
    let data = toRaw(formData)
    data = Object.assign({}, data)
    data.zoneNames = splitZoneName(formData.zoneNames as string)
    let res = await updateZone(data as ZoneBatch)
    // 展示数据
    pageData.resData = res.data
    control.isLoading = false
  })
}
</script>
