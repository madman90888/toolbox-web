<template>
  <div>
    <ul class="infinite-list" style="overflow: auto">
      <li v-for="t in pageData.list" :key="t" class="infinite-list-item">{{ t }}</li>
    </ul>
    <div class="input" @keydown.enter="pushMsg">
      <el-input v-model="pageData.text" placeholder="请输入文字" size="large" />
    </div>
    <div class="button">
      <el-row>
        <el-col :span="12">
          <el-button type="primary" size="large" @click="pushMsg">留言</el-button>
        </el-col>
        <el-col :span="12">
          <el-button type="danger" size="large" @click="delMsg">删除</el-button> 
        </el-col>
      </el-row>
      
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMesList, pushMessage, deleteMessage } from '@/api/msg'

const route = useRoute()
const router = useRouter()
const pageData = reactive({
  mark: '',
  text: '',
  list: []
})

onMounted(() => {
  const mark = route.params.m
  if (!mark) {
    ElMessage.error('标识为空，无法获取数据')
    return
  }
  pageData.mark = mark as string
  getList()
})

const getList = async (): Promise<void> => {
  let result = await getMesList(pageData.mark)
  if (!result) {
    router.push('/m')
    return
  }
  pageData.list = result.data
}

const pushMsg = async (): Promise<void> => {
  const text = pageData.text
  if (!text || !pageData.mark) {
    ElMessage.error("文本不能为空")
    return 
  }
  pageData.text = ''
  const result = await pushMessage(pageData.mark, text)
  if (result) {
    pageData.list = result.data
  }
}

const delMsg = (): void => {
  ElMessageBox.confirm(
    '删除后记录无法找回，是否确认删除？',
    '删除确认',
    {
      distinguishCancelAndClose: true,
      confirmButtonText: '确认',
      cancelButtonText: '取消',
    }
  )
  .then(async () => {
    await deleteMessage(pageData.mark)
    pageData.list = []
    ElMessage.success('删除成功')
    router.push('/m')
  })
  .catch(() => ElMessage.info('取消删除'))
}
</script>

<style scoped>
.infinite-list {
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
.input {
  padding: 20px 10px;
}
.button {
  width: 200px;
  margin: 0 auto;
  padding-bottom: 100px;
}
</style>