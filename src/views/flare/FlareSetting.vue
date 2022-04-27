<template>
  <el-card>
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="200px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="有效期" prop="expire">
            <el-input v-model.number="formData.expire" placeholder="令牌有效时间"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="17">
          <span>令牌保留时间(小时) -1 永久</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="Flare 令牌" prop="token">
            <el-input v-model="formData.token" placeholder="请输入 CloudFlare 授权令牌" type="password" show-password>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" @click="save(formRef)">保存令牌</el-button>
        <el-button type="danger" @click="clear">删除令牌</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { FormInstance, ElMessage } from 'element-plus'
import { getToken, verifyFlareToken, deleteToken } from '@/api/flare'
import { AES_ECB_decrypt, AES_ECB_encrypt } from '@/utils/auth'
import { useStore } from 'vuex'

const key = '11f6fa0a98f58bhk'

const formRef = ref<FormInstance>()
const formData: {
  expire: number;
  token: string;
} = reactive({
  expire: 1,
  token: ''
})
const rules = reactive({
  expire: [
    { type: 'number', message: '只能是数字', trigger: 'blur' },
  ],
  token: [
    { required: true, message: '令牌不能为空', trigger: 'blur' }
  ]
})

onMounted(async () => {
  const res = await getToken()
  if (res) {
    formData.expire = res.data.expire
    formData.token = AES_ECB_decrypt(res.data.token, key)
  }
})

const store = useStore()
/**
 * 保存令牌
 */
function save(formEl: FormInstance | undefined) {
  if (!formEl) return
  formEl.validate(async valid => {
    if (!valid) return
    const res = await verifyFlareToken(AES_ECB_encrypt(formData.token, key), formData.expire.toString())
    if (res) {
      store.dispatch('setTokan', 'token')
      ElMessage.success('令牌有效，状态：' + res.data.status)
    }else{
      store.dispatch('setTokan', '')
    }
  })
}

/**
 * 清除浏览器保存的token
 */
function clear() {
  store.dispatch('setTokan', '')
  deleteToken()
  .then(res => {
    if (res) {
      formData.expire = -1
      formData.token = ''
      ElMessage.success(res.data)
    }
  })
}
</script>

<style scoped>
.el-row {
  margin: 20px 0;
}
</style>