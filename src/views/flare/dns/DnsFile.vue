<template>
  <div class="box">
    <el-row>
      <el-col :span="6">
        <el-upload
        drag
        ref="uploadRef" 
        action="flare/dns/file"
        accept=".xls,.xlsx"
        :auto-upload="false" 
        :on-success="handleSuccess"
        :before-upload="beforeUpload">
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            将文件拖放到此处或<em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              小于 5MB 的文件，模板点击此处 <a href="/flare/dns/demo">下载</a>
            </div>
          </template>
        </el-upload>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <el-button type="primary" @click="submitForm(uploadRef)">添加解析</el-button>
      </el-col>
    </el-row>
    <!-- 显示操作记录 -->
    <el-dialog title="添加DNS解析" v-model="control.isDialog">
      <DnsResult :data="pageData.resData" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { UploadProps, UploadInstance, UploadRawFile } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { Dns, DnsVo } from '@/type'
import DnsResult from '@/components/DnsResult.vue'
import { createDns } from '@/api/flare'

// 文件处理
const uploadRef = ref<UploadInstance>()

// 控制页面组件显示、可操作性
const control: Record<string, boolean> = reactive({
  isDialog: false
})

// 数据存放
const pageData: {
  resData: DnsVo[]
} = reactive({
  resData: []
})

// 限制大小
const beforeUpload = (rawFile: UploadRawFile) => {
  if (rawFile.size > 5 * 1024 * 1024) {
    ElMessage.error('文件不能超过 5MB')
    return false
  }
}

// 显示结果
const handleSuccess: UploadProps['onSuccess'] = (response: any): void => {
  const list: Dns[] = response.data
  pageData.resData = []
  control.isDialog = true

  list.forEach(async ele => {
    const item = reactive({
      name: ele.name,
      type: ele.type,
      content: ele.content,
      ttl: ele.ttl,
      zone_name: ele.zone_name,
      success: true,
      message: ''
    })
    // 判断格式是否正确
    pageData.resData.push(item)
    if (!item.name || !item.type || !item.content || !item.zone_name) {
      item.success = false
      item.message = 'DNS 格式错误'
      return
    }
    let res = await createDns(item)
    if (!res) return
    item.message = res.data.message
    if (!res.data.success) {
      item.success = false
    }
  })
}

// 手动提交
const submitForm = (uploadFile: UploadInstance | undefined) => {
  if (!uploadFile) return
  uploadFile.submit()
}
</script>

<style scoped>
.box {
  margin: 10px;
}
a {
  color: blue;
  text-decoration: none;
}
</style>