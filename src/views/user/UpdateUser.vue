<template>
  <el-form :model="formData" ref="formRef" 
    :rules="rules" label-width="100px" class="box"
    @keydown.enter="submit(formRef)">
    <el-form-item label="旧密码" prop="oldPass">
      <el-input v-model="formData.oldPass" 
      type="password" placeholder="请输入旧密码" show-password />
    </el-form-item>
    <el-form-item label="新密码"  prop="password">
      <el-input v-model="formData.password" 
      type="password" placeholder="请输入新密码" show-password />
    </el-form-item>
    <el-form-item label="确认密码" prop="password2">
      <el-input v-model="formData.password2" 
      type="password" placeholder="请再次输入新密码" show-password />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit(formRef)">修改密码</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, defineEmits } from 'vue'
import { ElMessage, FormInstance } from 'element-plus';
import { useStore } from 'vuex'

const store = useStore()
const emit = defineEmits([ 'close' ])

// 表单数据定义
const formRef = ref<FormInstance>()
const formData: {
  oldPass: string;
  password: string;
  password2: string;
} = reactive({
  oldPass: '',
  password: '',
  password2: ''
})

const validatePass = (rule: any, value: any, callback: any): void => {
  if (value != formData.password) {
    return callback(new Error('两次输入的密码不一致'))
  }
  callback()
}

const rules = reactive({
  oldPass: [
    { required: true, message: '旧密码不能为空', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '新密码不能为空', trigger: 'blur' }
  ],
  password2: [
    { required: true, message: '确认密码不能为空', trigger: 'blur' },
    { validator: validatePass, trigger: 'blur' }
  ],
})

// 修改密码
function submit(formEl: FormInstance | undefined): void {
  if (!formEl) return
  formEl.validate(async valid => {
    if (!valid) return
    const res = await store.dispatch('updatePass', { 
      oldPass: formData.oldPass,
      newPass: formData.password,
      })
    if (res) {
      ElMessage.success('密码修改成功')
      emit('close')
    }
  })
}

</script>

<style scoped>
.box {
  padding-right: 100px;
}
</style>