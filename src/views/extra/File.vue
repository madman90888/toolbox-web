<template>
  <div class="file-box">
    <el-form
      ref="formRef"
      :model="formData"
      status-icon
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      v-if="panel.show"
    >
      <el-form-item label="文件夹" prop="fileDir">
        <el-row>
          <el-input v-model="formData.fileDir" type="text" placeholder="文件夹名称" />
        </el-row>
      </el-form-item>
      <el-form-item label="文件名" prop="fileName">
        <el-row>
          <el-input v-model="formData.fileName" type="text" placeholder="仅单文件上传有效" />
        </el-row>
      </el-form-item>
      <el-form-item label="有效期">
        <el-row>
          <el-col :span="12">
            <el-input v-model.number="formData.day" placeholder="有效天数，-1永久" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="选择文件">
        <el-upload
          ref="uploadRef"
          class="upload-demo"
          action="/file"
          multiple
          :limit="10"
          :on-exceed="handleExceed"
          :auto-upload="false"
          :data="formData"
          :on-success="handleSuccess"
        >
          <el-button type="primary">选择文件</el-button>
          <template #tip>
            <div class="el-upload__tip">
              小于 500MB 的文件。
            </div>
          </template>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)">上传文件</el-button>
      </el-form-item>
    </el-form>

    <ul class="infinite-list" style="overflow: auto" v-if="panel.show">
      <li v-for="item in resData" :key="item.fileName" class="infinite-list-item">
      {{ item.fileName }}  ==> {{ item.success ? item.url : item.message }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, UploadProps, UploadInstance } from 'element-plus'
import { ElMessage } from 'element-plus'

const formRef = ref<FormInstance>()

const validateFileDir = (rule: any, value: string, callback: any) => {
  if (value) {
    if (value.length > 6) {
      return callback('文件夹长度不得超过6位')
    }
    if (!/^[a-zA-Z0-9]{1,6}$/.test(value)) {
      return callback('只支持字母+数字组合')
    }
  }  
  return callback()
}

const validateFileName = (rule: any, value: any, callback: any) => {
  if (value) {
    if (!/^[a-zA-Z0-9]{1,333}$/.test(value)) {
      return callback('只支持字母+数字组合')
    }
  }  
  return callback()
}

const formData: {
  fileDir: string;
  fileName: string;
  day: number;
} = reactive({
  fileDir: '',
  fileName: '',
  day: -1
})

const rules = reactive({
  fileDir: [{ validator: validateFileDir, trigger: 'blur' }],
  fileName: [{ validator: validateFileName, trigger: 'blur' }]
})

// 文件处理
const uploadRef = ref<UploadInstance>()
const resData: {
  success: boolean;
  fileName: string;
  message: string;
  url: string;
}[] = reactive([])

const panel: {
  show: boolean;
} = reactive({
  show: true
})

// 选择文件超出上限提示
const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
    `单次上传最多10个文件，你选择了${files.length + uploadFiles.length}文件，超出上限！`
  )
}

// 成功返回结果
const handleSuccess: UploadProps['onSuccess'] = (response: any): void => {
  resData.push(response.data)
}

// 上传文件
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (!valid) {
      return
    }
    uploadRef.value?.submit()
  })
}
</script>

<style scoped>
.file-box {
  width: 100%;
  height: 100%;
  background: white;
}
.el-form {
  width: 40%;
  padding: 50px 15% 0 10px;
}
.upload-demo {
  width: 100%;
  min-height: 100px;
}

.infinite-list {
  height: 300px;
  padding: 0;
  margin: 0;
  list-style: none;
}
.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: var(--el-color-primary-light-9);
  margin: 10px;
  color: var(--el-color-primary);
}
.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}
</style>