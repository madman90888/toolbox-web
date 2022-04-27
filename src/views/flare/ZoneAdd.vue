<template>
  <el-form ref="formRef" :model="formData" 
      :rules="rules" label-width="150px">
      <el-form-item label="获选现有DNS记录">
        <el-switch v-model="formData.jump"></el-switch>
      </el-form-item>
      <el-form-item label="交由Flare托管">
        <el-select v-model="formData.type" placeholder="托管">
          <el-option label="全部" value="full"></el-option>
          <el-option label="部分" value="partial"></el-option>
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
        <el-button type="primary" @click="submit(formRef)">添加域名</el-button>
      </el-form-item>
    </el-form>
    <!-- 显示批量操作记录 -->
    <el-dialog title="批量添加域名" v-model="control.isDialog">
      <ZoneAddDel :data="pageData.resData"
        :loading="control.isLoading" />
    </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, toRaw } from 'vue'
import type { FormInstance } from 'element-plus'
import { validateZoneName, splitZoneName } from '@/utils'
import { createZone } from '@/api/flare'
import { ZoneBatch, IZoneAddDel } from '@/type'
import ZoneAddDel from '@/components/ZoneAddDel.vue'

const formRef = ref<FormInstance>()
const formData: {
  zoneNames: string | string[];
  jump: boolean;
  type: string;
} = reactive({
  zoneNames: '',
  jump: false,
  type: 'full'
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
  resData: IZoneAddDel[]
} = reactive({
  resData: []
})

/**
 * 添加域名
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
    data.zoneNames = splitZoneName(data.zoneNames as string)
    
    let res = await createZone(data as ZoneBatch)
    // 展示数据
    pageData.resData = res.data
    control.isLoading = false
  })
}
</script>
