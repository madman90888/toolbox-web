<template>
  <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="150px"
      style="width:500px"
    >
      <!-- 解析 -->
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-select v-model="formData.type" placeholder="请选择...">
              <el-option label="A" value="A"></el-option>
              <el-option label="AAAA" value="AAAA"></el-option>
              <el-option label="CNAME" value="CNAME"></el-option>
              <el-option label="TXT" value="TXT"></el-option>
              <el-option label="MX" value="MX"></el-option>
              <el-option label="NS" value="NS"></el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="解析值" prop="content">
        <el-input v-model="formData.content"></el-input>
      </el-form-item>
      <el-form-item label="TTL" prop="ttl">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input v-model.number="formData.ttl"></el-input>
          </el-col>
          <el-col :span="16">60 和 86400之间，1 表示自动</el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="代理">
        <el-switch v-model="formData.proxied"></el-switch>
      </el-form-item>
      <el-form-item label="域名列表" prop="zoneNames">
        <el-input
          type="textarea"
          v-model="formData.zoneNames"
          :placeholder="`只能输入顶级域名，一行一个，例如：\nname1.com\nname2.com\nname3.com`"
          :autosize="{ minRows: 9, maxRows: 9 }"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit(formRef)">添加解析</el-button>
      </el-form-item>
    </el-form>
    <!-- 显示批量操作记录 -->
    <el-dialog title="添加DNS解析" v-model="control.isDialog">
      <DnsRes :data="pageData.resData" :loading="control.isLoading" />
    </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { validateZoneName, splitZoneName } from '@/utils'
import { createDns } from '@/api/flare'
import { Dns, DnsVo } from '@/type'
import DnsRes from '@/components/DnsRes.vue'
interface DnsForm extends Dns {
  zoneNames?: string
}

const formRef = ref<FormInstance>()
const formData: DnsForm = reactive({
  type: 'A',
  name: '@',
  content: '',
  proxied: true,
  ttl: 1,
  zone_name: '',
  zoneNames:''
})
// 表单验证
const rules = reactive({
  name: [{ required: true, message: '域名前缀不能为空', trigger: 'blur' }],
  content: [{ required: true, message: 'Dns解析不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
  ttl: [{ type: 'number', message: '只能是数字', trigger: 'blur' }],
  zoneNames: [
    { required: true, message: '解析域名列表不能为空', trigger: 'blur' },
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
    const names = splitZoneName(formData.zoneNames as string)
    const list: Dns[] = []
    const baseDns = Object.assign({}, formData)
    delete baseDns.zoneNames
    names.forEach(name => {
      let dns = Object.assign({}, baseDns)
      dns.zone_name = name
      list.push(dns)
    })
    
    let res = await createDns(list)
    // 展示数据
    pageData.resData = res.data
    control.isLoading = false
  })
}
</script>