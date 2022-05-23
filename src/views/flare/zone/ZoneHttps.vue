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
      <el-form-item label="SSL/TLS 模式">
        <el-select v-model="formData.ssl" placeholder="请选择SSL级别">
          <el-option label="关闭" value="off"></el-option>
          <el-option label="灵活" value="flexible"></el-option>
          <el-option label="完全" value="full"></el-option>
          <el-option label="严格" value="strict"></el-option>
        </el-select>
      </el-form-item>
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
      <el-button type="primary" @click="submit(formRef, 1)">自动 HTTPS 重写</el-button>
      <el-button type="primary" @click="submit(formRef, 2)">始终使用 HTTPS</el-button>
      <el-button type="primary" @click="submit(formRef, 0)">SSL/TLS 模式</el-button>
    </el-form-item>
  </el-form>
  <!-- 显示批量操作记录 -->
  <el-dialog title="HTTP/SSL设置" v-model="control.isDialog">
    <zone-result :data="pageData.resData" :title="pageData.title" />
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { validateZoneName, splitZoneName } from '@/utils'
import { updateAutoHttps, updateAlwaysUseHttps, updateSSL } from '@/api/flare'
import { ZoneRow } from '@/type'
import ZoneResult from '@/components/ZoneResult.vue'

const formRef = ref<FormInstance>()
const formData: {
  name: string;
  auto: boolean;
  always: boolean;
  ssl: 'off' | 'flexible' | 'full' | 'strict' | '';
} = reactive({
  name: '',
  auto: true,
  always: true,
  ssl: 'flexible'
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
  resData: ZoneRow[];
  title: string;
} = reactive({
  resData: [],
  title: ''
})

/**
 * 自动 HTTPS 重写
 * 始终使用 HTTPS
 * SSL/TLS 模式
 */
function submit(formEl: FormInstance | undefined, type: number): void {
  if (!formEl) return
  formEl.validate(valid => {
    if (!valid) return
    // 初始化
    pageData.resData = []
    control.isDialog = true
    if (type === 1) pageData.title = '自动 HTTPS 重写'
    else if (type === 2) pageData.title = '始终使用 HTTPS'
    else if (type === 0) pageData.title = 'SSL/TLS 模式'

    // 获取域名数组，遍历发送请求
    const names = splitZoneName(formData.name)
    names.forEach(async name => {
      const item = reactive({
        name,
        success: true,
        message: ''
      })
      pageData.resData.push(item)
      // 发起请求
      let res
      if (type === 1) {
        res = await updateAutoHttps(item.name, formData.auto)
      }else if(type === 2) {
        res = await updateAlwaysUseHttps(item.name, formData.always)
      }else{
        res = await updateSSL(item.name, formData.ssl)
        if (!res) return
        let msg = res.data.message
        if (msg == 'off') msg = '关闭'
        else if (msg == 'flexible') msg = '灵活'
        else if (msg == 'full') msg = '完全'
        else if (msg == 'strict') msg = '严格'
        res.data.message = msg
      }
      if (!res) return
      item.message = res.data.message
      if (!res.data.success) {
        item.success = false
      }
    })
  })
}
</script>
