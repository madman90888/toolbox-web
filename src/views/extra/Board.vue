<template>
  <div class="box">
    <el-card class="box-card">
      <h3>创建留言板</h3>
      <el-form 
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="80px"
        @keydown.enter="submit(formRef)"
        >
        <el-form-item label="标识符" prop="mark">
          <el-row>
            <el-input
              v-model="formData.mark"
              class="w-50 m-2"
              size="large"
              placeholder="访问标识"
          />
          </el-row>
        </el-form-item>
        <el-form-item label="有效期" prop="time">
          <el-row>
            <el-input
              v-model.number="formData.time"
              class="w-50 m-2"
              placeholder="有效时间：小时"
            />
          </el-row>
        </el-form-item>
        <el-row>
          <el-button type="primary" size="large" @click="submit(formRef)">创建留言</el-button>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance } from 'element-plus'
import { createMsg } from '@/api/msg'
import ruoter from '@/router'

const formRef = ref<FormInstance>()
const formData = reactive({
  mark: '',
  time: 1
})

const rules = reactive({
  mark: [{ required: true, message: '标识不能为空', trigger: 'blur' }],
  time: [{ required: true, message: '有效时间不能为空', trigger: 'blur' }],
})

const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (!valid) return
    let result = await createMsg(formData.mark, formData.time)
    if (result) {
      ruoter.push('/m/' + formData.mark)
    }
    
  })
}

</script>

<style scoped>
.box {
  width: 400px;
  margin: 20px auto;
}
h3 {
  text-align: center;
  margin-bottom: 30px;
}
.el-button {
 margin: 10px auto;
}
</style>