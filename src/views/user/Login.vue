<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="login-title">用户登录</h2>
      <el-form
        ref="userRef"
        :model="userForm"
        status-icon
        :rules="userRules"
        label-width="0px"
        class="login-form"
      >
      <el-form-item prop="username">
        <el-input 
          v-model="userForm.username"
           :prefix-icon="UserFilled"
           placeholder="请输入用户名"
           size="large"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input 
          v-model="userForm.password"
          :prefix-icon="PassIcon"
          type="password" 
          placeholder="请输入密码"
          show-password
          size="large"
        />
      </el-form-item>
      <el-form-item class="btn">
        <el-button type="primary" @click="login(userRef)">登录</el-button>
      </el-form-item>
    </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance } from 'element-plus'
import { UserFilled, Key as PassIcon } from '@element-plus/icons-vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { User } from '@/type'

const store = useStore()
const router = useRouter()
const userRef = ref<FormInstance>()

const userForm: User = reactive({
  username: '',
  password: ''
})

const userRules = reactive({
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 9, message: "长度在 3 到 9 个字符", trigger: "blur" }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" }
  ]
})

const login = (formEl: FormInstance | undefined): void => {
  if (!formEl) return
  formEl.validate(async (valid: boolean) => {
    if (!valid) return
    
    const result = await store.dispatch("login", {...userForm})
    if (result) {
      router.push("/")
    }
  })
  
}
</script>

<style scoped>
.login-container {
  height: 100%;
  /* background-color: #2b4b6b; */
  background: url(../../assets/images/login_bg.jpg) no-repeat;
  background-size: cover;
}
.login-box {
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 300px;
  background: transparent;
}
.login-title {
  text-align: center;
  font-size: 32px;
  color: white;
}
.login-form {
  width: 70%;
  padding: 30px 15%;
}
.btn button {
  width: 200px;
  height: 50px;
  margin: 10px auto;
  font-size: 18px;
}
</style>