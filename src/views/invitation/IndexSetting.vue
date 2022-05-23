<template>
  <el-card>
    <el-form ref="formRef" :model="formData" 
      label-width="150px">
      <el-form-item label="拦截爬虫">
        <el-switch v-model="formData.use"></el-switch>
      </el-form-item>
      <el-form-item label="响应方式">
        <el-select v-model="formData.type" placeholder="请选择...">
          <el-option label="拒绝访问" :value="0"></el-option>
          <el-option label="虚假页面" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="拦截字段" prop="name">
        <el-row :gutter="2" style="width:300px">
          <el-col :span="24">
            <el-input
              type="textarea"
              v-model="formData.filter"
              placeholder="对 user-agent 请求头进行简单过滤"
              :autosize="{ minRows: 11, maxRows: 9 }"
            ></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit()">保存</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, toRaw } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { splitZoneName } from '@/utils'
import { getIndexAccess, updateIndexAccess } from '@/api/invitation'

const formRef = ref<FormInstance>()
const formData: {
  use: boolean;
  type: number;
  filter: string;
} = reactive({
  use: false,
  type: 0,
  filter: ''
})

onMounted(async () => {
  const res = await getIndexAccess()
  if(!res) return
  formData.use = res.data.use
  formData.type = res.data.type
  const filter = res.data.filter
  if (filter) {
    formData.filter = filter.join('\n')
  }
})

/**
 * 修改
 */
const submit = async () => {
  const obj = { ...toRaw(formData) }
  obj.filter = splitZoneName(obj.filter) as any
  let res = await updateIndexAccess(obj)
  if (res) {
    ElMessage.success('修改成功')
  }
}
</script>
